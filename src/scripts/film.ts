/**
 * Film controller (§4 Section C, §5 flow 3).
 *
 * Playback state machine:
 *   idle ── near viewport (200px) ──▶ loading (preload "auto" + load())
 *   idle ── first time ≥50% visible ─▶ play() … promise rejected ─▶ blocked
 *     (blocked: poster + centred play button, no error copy)
 *   playing ── leaves view ─▶ paused (holds its frame; re-entering never resumes)
 *   playing ── 'ended' ─▶ done (holds final frame, Replay becomes available)
 *   done/paused ── Play or Replay ─▶ playing (Replay seeks to 0 first)
 *   any user Play before 'canplay' ─▶ waiting (16px spinner, button disabled)
 *
 * Reduced motion (matchMedia) and a degraded media set (data-degraded) never
 * autoplay: the poster and the centred play button show instead.
 */

/** The frame starts loading this many px from the viewport (§4 lazy-load). */
const NEAR = 200;
/** Disclosure close waits for the --dur-base opacity fade before hiding. */
const DISCLOSURE_CLOSE_MS = 220;

/* ---- The description disclosure (present whenever the video is). ---- */
function initDisclosure(): void {
  const wrapper = document.getElementById('film-disclosure');
  const button = document.getElementById('film-disclosure-toggle');
  const description = document.getElementById('film-description');
  if (!wrapper || !button || !description) return;

  let closeTimer = 0;

  function setOpen(open: boolean): void {
    if (!wrapper || !button || !description) return;
    window.clearTimeout(closeTimer);
    button.setAttribute('aria-expanded', String(open));
    wrapper.dataset.open = String(open);
    if (open) {
      description.hidden = false;
      // Next frame, so the opacity transition actually runs from 0.
      requestAnimationFrame(() => description.classList.add('is-open'));
    } else {
      description.classList.remove('is-open');
      closeTimer = window.setTimeout(() => {
        description.hidden = true;
      }, DISCLOSURE_CLOSE_MS);
    }
  }

  button.addEventListener('click', () => {
    setOpen(button.getAttribute('aria-expanded') !== 'true');
  });

  // Shell convention: Esc dispatches 'esc-close' at the topmost open layer.
  wrapper.addEventListener('esc-close', () => {
    if (wrapper.dataset.open === 'true') {
      setOpen(false);
      button.focus();
    }
  });
}

/* ---- The video itself. ---- */
function initVideo(): void {
  const video = document.getElementById('film-video') as HTMLVideoElement | null;
  const stage = document.getElementById('film-stage');
  const overlay = document.getElementById('film-overlay-play') as HTMLButtonElement | null;
  const toggle = document.getElementById('film-toggle') as HTMLButtonElement | null;
  const toggleLabel = document.getElementById('film-toggle-label');
  const replay = document.getElementById('film-replay') as HTMLButtonElement | null;
  const posterImg = document.getElementById('film-poster-img') as HTMLImageElement | null;
  if (!video || !stage || !overlay || !toggle || !toggleLabel || !replay) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const degraded = stage.dataset.degraded === 'true';

  /** True once the clip has fully played — the gate that arms Replay (§4). */
  let hasPlayedOnce = false;
  /** The scroll-triggered start happens exactly once (§5 flow 3). */
  let autoplayAttempted = false;
  /** A user pressed Play before the file was ready; start on 'canplay'. */
  let pendingPlay = false;
  let loadKicked = false;

  // The muted *attribute* is in the HTML (test 20); mirror it on the IDL
  // property too, which some engines require before allowing autoplay.
  video.muted = true;

  /* Poster cross-fades in over its LQIP once decoded. */
  if (posterImg) {
    const markLoaded = (): void => posterImg.classList.add('is-loaded');
    if (posterImg.complete && posterImg.naturalWidth > 0) markLoaded();
    else posterImg.addEventListener('load', markLoaded, { once: true });
  }

  const showOverlay = (): void => overlay.classList.add('is-visible');
  const hideOverlay = (): void => overlay.classList.remove('is-visible');

  /* Waiting state: inline spinner + disabled until 'canplay' (§5 flow 3). */
  const waitables: HTMLButtonElement[] = [toggle, overlay];
  function setWaiting(button: HTMLButtonElement, on: boolean): void {
    button.classList.toggle('is-waiting', on);
    button.disabled = on;
    if (on) button.setAttribute('aria-disabled', 'true');
    else button.removeAttribute('aria-disabled');
  }
  const clearWaiting = (): void => {
    for (const button of waitables) setWaiting(button, false);
  };

  /** Within 200px of the viewport: fetch for real (preload was "none"). */
  function kickLoad(): void {
    if (loadKicked) return;
    loadKicked = true;
    video!.preload = 'auto';
    if (
      video!.readyState === HTMLMediaElement.HAVE_NOTHING &&
      video!.networkState !== HTMLMediaElement.NETWORK_LOADING
    ) {
      video!.load();
    }
  }

  const ready = (): boolean => video!.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA;

  /** play() with the rejection caught: a refusal is a normal state, not a
   *  fault (§4) — the centred play button appears and no error copy does. */
  function startPlayback(): void {
    const attempt = video!.play();
    if (attempt !== undefined) {
      attempt.catch(() => {
        pendingPlay = false;
        clearWaiting();
        showOverlay();
      });
    }
  }

  /** A user-initiated play: spinner on the pressed button until ready. */
  function userPlay(source: HTMLButtonElement): void {
    kickLoad();
    if (!ready()) {
      pendingPlay = true;
      setWaiting(source, true);
      return;
    }
    startPlayback();
  }

  video.addEventListener('canplay', () => {
    clearWaiting();
    if (pendingPlay) {
      pendingPlay = false;
      startPlayback();
    }
  });

  // Both renditions failing must never strand a disabled, spinning button:
  // an error on the last <source> means no rendition can load.
  const sources = video.querySelectorAll('source');
  const lastSource = sources[sources.length - 1];
  if (lastSource) {
    lastSource.addEventListener('error', () => {
      pendingPlay = false;
      clearWaiting();
      showOverlay();
    });
  }

  /* State reflection: the toggle swaps icon + visible label; the poster and
     overlay layer fade out over --dur-slow when playback starts (§2 motion). */
  video.addEventListener('play', () => {
    stage.classList.add('is-playing');
    hideOverlay();
    toggle.classList.add('is-playing');
    toggleLabel.textContent = 'Pause';
  });
  video.addEventListener('pause', () => {
    toggle.classList.remove('is-playing');
    toggleLabel.textContent = 'Play';
  });
  video.addEventListener('ended', () => {
    // Plays once and holds the final frame — no loop, no snap-back (§4).
    hasPlayedOnce = true;
    replay.disabled = false;
    replay.removeAttribute('aria-disabled');
  });

  toggle.addEventListener('click', () => {
    if (video.paused) userPlay(toggle);
    else video.pause();
  });

  overlay.addEventListener('click', () => userPlay(overlay));

  replay.addEventListener('click', () => {
    if (!hasPlayedOnce) return; // genuinely inert until the clip has played (§4)
    video.currentTime = 0;
    startPlayback();
  });

  /* Observers: one for the 200px-early fetch, one for the 50% autoplay. */
  if ('IntersectionObserver' in window) {
    const near = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            kickLoad();
            near.disconnect();
          }
        }
      },
      { rootMargin: NEAR + 'px' }
    );
    near.observe(stage);

    const half = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (!autoplayAttempted) {
              autoplayAttempted = true;
              // Reduced motion and a degraded media set never autoplay (§4).
              if (!reduced && !degraded) startPlayback();
            }
          } else if (!video.paused) {
            // Leaves view mid-play: pause and hold the frame; scrolling back
            // never resumes on its own (§5 flow 3).
            video.pause();
          }
        }
      },
      { threshold: 0.5 }
    );
    half.observe(stage);
  } else {
    // No IntersectionObserver: no scroll-triggered playback — load eagerly
    // and offer the centred play button.
    kickLoad();
    showOverlay();
  }

  // Poster + centred play button, always, when autoplay is off the table.
  if (reduced || degraded) showOverlay();
}

initDisclosure();
initVideo();

export {};
