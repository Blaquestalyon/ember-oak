/**
 * Hero behaviour (blueprint §4 Section A):
 * - Entrance: the five text children reveal on the hero image's `load` event
 *   OR after 300ms, whichever comes first — not viewport-triggered. The shell
 *   script's IntersectionObserver may also add `.is-revealed`; that class is
 *   idempotent, so double-firing is harmless.
 * - LQIP cross-fade: `.is-loaded` on the image fades it in over --dur-slow;
 *   the already-cached case (`complete === true`) is handled synchronously.
 * - Error: `.is-failed` on the section hides the photographic layers so the
 *   coded drum-glow panel shows. No on-screen message — /status reports it.
 */

const hero = document.querySelector<HTMLElement>('[data-hero]');

if (hero) {
  const reveals = [...hero.querySelectorAll<HTMLElement>('.reveal')];
  reveals.forEach((el, i) => el.style.setProperty('--reveal-i', String(i)));

  let started = false;
  const start = (): void => {
    if (started) return;
    started = true;
    for (const el of reveals) el.classList.add('is-revealed');
  };

  const timer = window.setTimeout(start, 300);

  const img = hero.querySelector<HTMLImageElement>('[data-hero-img]');

  const onLoaded = (): void => {
    img?.classList.add('is-loaded');
    window.clearTimeout(timer);
    start();
  };

  const onFailed = (): void => {
    hero.classList.add('is-failed');
    window.clearTimeout(timer);
    start();
  };

  if (img) {
    if (img.complete) {
      // Already settled (cache hit or early failure) before this script ran.
      if (img.naturalWidth > 0) onLoaded();
      else onFailed();
    } else {
      img.addEventListener('load', onLoaded, { once: true });
      img.addEventListener('error', onFailed, { once: true });
    }
  }
  // No image rendered (set missing on disk): the 300ms timer runs the entrance.
}

export {};
