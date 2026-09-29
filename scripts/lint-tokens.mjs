#!/usr/bin/env node
/**
 * Lint rule (§12 test 47): no raw hex colour and no raw px length in any
 * .astro, .ts or .tsx component/source file. Token definitions themselves
 * (src/styles/*) are the one place values live.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const SCAN_DIRS = ['src'];
const EXEMPT = [
  join('src', 'styles'), // token definitions live here
];
const EXTENSIONS = new Set(['.astro', '.ts', '.tsx']);

const HEX = /#[0-9a-fA-F]{3,8}\b/;
const PX = /(?<![-\w])\d*\.?\d+px\b/;

const failures = [];

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const rel = relative(ROOT, full);
    if (EXEMPT.some((e) => rel.startsWith(e))) continue;
    const st = statSync(full);
    if (st.isDirectory()) {
      walk(full);
      continue;
    }
    const ext = name.slice(name.lastIndexOf('.'));
    if (!EXTENSIONS.has(ext)) continue;
    const lines = readFileSync(full, 'utf8').split('\n');
    lines.forEach((line, i) => {
      const trimmed = line.trim();
      // Allow references inside comments that merely describe the spec.
      if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*') || trimmed.startsWith('<!--')) return;
      // Media-query breakpoints are pinned in the blueprint (§4: 768px/900px/1024px)
      // and cannot be expressed with var(); they are not component values.
      if (trimmed.startsWith('@media') || trimmed.startsWith('@container')) return;
      if (HEX.test(line)) failures.push(`${rel}:${i + 1} raw hex: ${trimmed.slice(0, 100)}`);
      if (PX.test(line)) failures.push(`${rel}:${i + 1} raw px: ${trimmed.slice(0, 100)}`);
    });
  }
}

for (const dir of SCAN_DIRS) walk(join(ROOT, dir));

if (failures.length > 0) {
  console.error('Token lint failed — visual values must come from src/styles/tokens.css:\n');
  for (const f of failures) console.error(`  ${f}`);
  process.exit(1);
}
console.log('Token lint passed: no raw hex or px outside src/styles.');
