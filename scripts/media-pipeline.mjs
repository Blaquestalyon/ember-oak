#!/usr/bin/env node
/**
 * Media derivative pipeline (blueprint §8 steps 2, 7, 8).
 *
 * Runs BEFORE `astro build` (see package.json "build"). Reads the committed
 * master images in assets/master/, produces the public media set in media/
 * (served at /media/* by the middleware), and writes src/media/manifest.json.
 *
 * Degrades gracefully: a missing master leaves its set null (the site renders
 * its designed §4 fallback and /status names it); missing ffmpeg skips the
 * film encode the same way. The build NEVER fails because media is absent.
 */
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const MASTER = join(ROOT, 'assets', 'master');
const OUT = join(ROOT, 'media');
const MANIFEST_PATH = join(ROOT, 'src', 'media', 'manifest.json');

let sharp;
try {
  sharp = (await import('sharp')).default;
} catch {
  console.warn('[media] sharp is not installed — skipping derivative generation.');
  process.exit(0);
}

mkdirSync(OUT, { recursive: true });

const HERO_WIDTHS = [640, 1024, 1600, 2400];
const ROAST_WIDTHS = [640, 1024, 1600];
const FORMATS = /** @type {const} */ (['avif', 'webp', 'jpeg']);

function hash8(buffer) {
  return createHash('sha256').update(buffer).digest('hex').slice(0, 8);
}

async function buildImageSet(inputPath, slug, widths, targetAspect) {
  const src = sharp(readFileSync(inputPath)).rotate();
  const meta = await src.metadata();
  let pipeline = src;
  let cropWidth = meta.width;
  let cropHeight = meta.height;
  if (targetAspect) {
    // Centre-crop to the exact aspect ratio.
    const [aw, ah] = targetAspect;
    const current = meta.width / meta.height;
    const wanted = aw / ah;
    if (current > wanted) {
      cropWidth = Math.round(meta.height * wanted);
      cropHeight = meta.height;
    } else {
      cropWidth = meta.width;
      cropHeight = Math.round(meta.width / wanted);
    }
    pipeline = src.extract({
      left: Math.floor((meta.width - cropWidth) / 2),
      top: Math.floor((meta.height - cropHeight) / 2),
      width: cropWidth,
      height: cropHeight,
    });
  }
  const base = await pipeline.toBuffer();

  const sources = { avif: {}, webp: {}, jpeg: {} };
  const usable = widths.filter((w) => w <= cropWidth);
  if (usable.length === 0) usable.push(cropWidth);
  let intrinsic = { width: 0, height: 0 };

  for (const width of usable) {
    const resized = sharp(base).resize({ width, withoutEnlargement: true });
    const encoded = {
      avif: await resized.clone().avif({ quality: 55, effort: 6 }).toBuffer(),
      webp: await resized.clone().webp({ quality: 78 }).toBuffer(),
      jpeg: await resized.clone().jpeg({ quality: 80, mozjpeg: true }).toBuffer(),
    };
    for (const format of FORMATS) {
      const buf = encoded[format];
      const ext = format === 'jpeg' ? 'jpg' : format;
      const name = `${slug}-${width}.${hash8(buf)}.${ext}`;
      writeFileSync(join(OUT, name), buf);
      sources[format][String(width)] = `/media/${name}`;
    }
    const m = await sharp(encoded.jpeg).metadata();
    if (width === Math.max(...usable)) intrinsic = { width: m.width, height: m.height };
  }

  // 24px-wide blurred LQIP as an inline data URI (AVIF).
  const lqipBuf = await sharp(base).resize({ width: 24 }).avif({ quality: 40 }).toBuffer();
  const lqip = `data:image/avif;base64,${lqipBuf.toString('base64')}`;

  return { widths: usable, width: intrinsic.width, height: intrinsic.height, lqip, sources };
}

function ffmpegAvailable() {
  try {
    execFileSync('ffmpeg', ['-version'], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function ffprobeDuration(file) {
  try {
    const out = execFileSync(
      'ffprobe',
      ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file],
      { encoding: 'utf8' }
    ).trim();
    const n = Number(out);
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}

const manifest = {
  generated: true,
  hero: null,
  roastLight: null,
  roastDark: null,
  film: null,
  ogCard: null,
};

// --- Hero: crop of the accepted master to 3:2 (§8 step 2). ---
// §8 pins the accepted master's canonical name as assets/master/master-bag.png;
// the candidate path is kept as a fallback for trees from before the rename.
const canonicalMaster = join(MASTER, 'master-bag.png');
const candidateMaster = join(MASTER, 'candidates', 'master-candidate-3.png');
const masterPath = existsSync(canonicalMaster) ? canonicalMaster : candidateMaster;
if (existsSync(masterPath)) {
  manifest.hero = await buildImageSet(masterPath, 'hero', HERO_WIDTHS, [3, 2]);
  // OG card: 1200×630 crop from the master (§4 page-wide details).
  const og = await sharp(readFileSync(masterPath))
    .resize({ width: 1200, height: 630, fit: 'cover' })
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();
  const ogName = `og-card.jpg`;
  writeFileSync(join(OUT, ogName), og);
  manifest.ogCard = `/media/${ogName}`;
  console.log('[media] hero + og-card built from master.');
} else {
  console.warn('[media] master still missing — hero set skipped.');
}

// --- Roast stills at 4:5 (§4 Section B). ---
for (const [key, file, slug] of [
  ['roastLight', 'roast-light-master.png', 'roast-light'],
  ['roastDark', 'roast-dark-master.png', 'roast-dark'],
]) {
  const p = join(MASTER, file);
  if (existsSync(p)) {
    manifest[key] = await buildImageSet(p, slug, ROAST_WIDTHS, [4, 5]);
    console.log(`[media] ${slug} set built.`);
  } else {
    console.warn(`[media] ${file} missing — ${slug} set skipped.`);
  }
}

// --- Film: encode §8 renditions from the raw clip. ---
const rawClip = join(MASTER, 'roast-clip-raw.mp4');
if (existsSync(rawClip) && ffmpegAvailable()) {
  const duration = ffprobeDuration(rawClip);
  // If longer than 5.0s, trim to the FINAL 5.0 seconds (§8 step 7).
  const trimArgs =
    duration && duration > 5.0 ? ['-ss', String(Math.max(0, duration - 5.0))] : [];

  const enc = (outName, scale, crf) => {
    const out = join(OUT, outName);
    execFileSync(
      'ffmpeg',
      [
        '-y',
        ...trimArgs,
        '-i',
        rawClip,
        '-an',
        '-c:v',
        'libx264',
        '-profile:v',
        'high',
        '-crf',
        String(crf),
        '-pix_fmt',
        'yuv420p',
        '-vf',
        `scale=${scale}:flags=lanczos`,
        '-movflags',
        '+faststart',
        out,
      ],
      { stdio: 'ignore' }
    );
    return out;
  };

  const p720 = enc('roast-clip-720.tmp.mp4', '1280:720', 23);
  const p480 = enc('roast-clip-480.tmp.mp4', '854:480', 26);
  const b720 = readFileSync(p720);
  const b480 = readFileSync(p480);
  const n720 = `roast-clip-720.${hash8(b720)}.mp4`;
  const n480 = `roast-clip-480.${hash8(b480)}.mp4`;
  writeFileSync(join(OUT, n720), b720);
  writeFileSync(join(OUT, n480), b480);
  execFileSync('rm', ['-f', p720, p480]);

  // Poster extracted at t=0 (the green bean) at 1280w (§8 step 7),
  // then derivatives via the image pipeline.
  const posterPng = join(OUT, 'poster-frame.tmp.png');
  execFileSync(
    'ffmpeg',
    ['-y', ...trimArgs, '-i', rawClip, '-frames:v', '1', '-vf', 'scale=1280:-2', posterPng],
    { stdio: 'ignore' }
  );
  const poster = await buildImageSet(posterPng, 'roast-clip-poster', [640, 1280], [16, 9]);
  // The plain JPEG poster path used by the <video poster> attribute.
  const posterJpg = poster.sources.jpeg[String(Math.max(...poster.widths))];
  execFileSync('rm', ['-f', posterPng]);

  manifest.film = {
    mp4720: `/media/${n720}`,
    mp4480: `/media/${n480}`,
    posterJpg,
    poster,
  };
  const mb = (n) => (n / (1024 * 1024)).toFixed(2);
  console.log(`[media] film encoded: 720p ${mb(b720.length)} MB, 480p ${mb(b480.length)} MB.`);
  if (b720.length > 1.8 * 1024 * 1024) console.warn('[media] 720p exceeds the 1.8 MB target.');
  if (b480.length > 0.7 * 1024 * 1024) console.warn('[media] 480p exceeds the 700 KB target.');
} else if (existsSync(rawClip)) {
  console.warn('[media] ffmpeg unavailable — film encode skipped.');
} else {
  console.warn('[media] raw clip missing — film set skipped.');
}

writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n');
console.log('[media] manifest written.');
