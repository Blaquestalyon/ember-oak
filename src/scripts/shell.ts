/**
 * Shell behaviour: no-js flag, header scrim, the roast line (signature moment 1),
 * scroll reveals, and the Esc layer stack (toast first, then disclosure).
 */

document.documentElement.classList.remove('no-js');

/* ---- Header scrim: transparent over the hero until scrollY > 48. ---- */
const header = document.getElementById('site-header');

/* ---- Roast line: width = scroll fraction, one paint per frame (§6). ---- */
const fill = document.getElementById('roast-line-fill');
let ticking = false;

function paint(): void {
  ticking = false;
  const doc = document.documentElement;
  const max = Math.max(1, doc.scrollHeight - window.innerHeight);
  const progress = Math.min(1, Math.max(0, window.scrollY / max));
  if (fill) fill.style.width = `${progress * 100}%`;
  if (header) header.classList.toggle('is-scrolled', window.scrollY > 48);
}

function requestPaint(): void {
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(paint);
  }
}

window.addEventListener('scroll', requestPaint, { passive: true });
window.addEventListener('resize', requestPaint, { passive: true });
paint();

/* ---- Scroll reveal: children rise and fade once, at 20% visibility. ---- */
const groups = document.querySelectorAll<HTMLElement>('[data-reveal-group]');
for (const group of groups) {
  const children = group.querySelectorAll<HTMLElement>('.reveal');
  children.forEach((el, i) => el.style.setProperty('--reveal-i', String(i)));
}

if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const targets = entry.target.matches('.reveal')
            ? [entry.target]
            : [...entry.target.querySelectorAll('.reveal')];
          for (const el of targets) el.classList.add('is-revealed');
          io.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.2 }
  );
  for (const group of groups) io.observe(group);
  document.querySelectorAll('.reveal:not([data-reveal-group] .reveal)').forEach((el) => io.observe(el));
} else {
  document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-revealed'));
}

/* ---- Esc closes the topmost layer: highest data-esc-priority wins (§4). ---- */
document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  const open = [...document.querySelectorAll<HTMLElement>('[data-esc-layer][data-open="true"]')];
  if (open.length === 0) return;
  open.sort(
    (a, b) => Number(b.dataset.escPriority ?? 0) - Number(a.dataset.escPriority ?? 0)
  );
  open[0]?.dispatchEvent(new CustomEvent('esc-close'));
});

export {};
