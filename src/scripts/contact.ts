/**
 * Contact island (§4 Section E): the "Copy address" button and its toast.
 *
 * The address is never present in this file or the served HTML — it is read at
 * click time by decoding the obfuscated anchor's href (the browser has already
 * decoded the §6 HTML entities) and stripping the "mailto:" scheme.
 *
 * Toast lifecycle: created into #toast-root, one at a time (a new toast removes
 * the old instantly), entering with a 12px rise + fade over --dur-base (the
 * rise is CSS-gated behind prefers-reduced-motion: no-preference), auto-
 * dismissing at 4500ms, dismissible via its close button or Esc (it registers
 * on the shell's Esc-layer stack at priority 20, above the film disclosure's
 * 10), exiting over --dur-base before removal.
 */

const AUTO_DISMISS_MS = 4500;
/* Safety net only — the real exit timing is the CSS transition (--dur-base),
 * observed via transitionend. */
const EXIT_FALLBACK_MS = 400;

type ToastVariant = 'success' | 'warning';

let currentToast: HTMLElement | null = null;
let dismissTimer: number | undefined;

/** Lucide "x" (16px via .toast__close svg), built with DOM APIs — no innerHTML. */
function buildCloseIcon(): SVGSVGElement {
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '1.75');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  svg.setAttribute('aria-hidden', 'true');
  for (const d of ['M18 6 6 18', 'm6 6 12 12']) {
    const path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('d', d);
    svg.appendChild(path);
  }
  return svg;
}

function clearDismissTimer(): void {
  if (dismissTimer !== undefined) {
    window.clearTimeout(dismissTimer);
    dismissTimer = undefined;
  }
}

/** Immediate removal — used when a new toast replaces the old one. */
function removeToastNow(): void {
  clearDismissTimer();
  currentToast?.remove();
  currentToast = null;
}

/** Animated dismissal: fade (and settle) out over --dur-base, then remove. */
function dismissToast(): void {
  const toast = currentToast;
  if (!toast) return;
  clearDismissTimer();
  currentToast = null;
  toast.dataset.open = 'false'; // off the Esc-layer stack during its exit
  toast.classList.remove('toast--in');
  let removed = false;
  const finish = (): void => {
    if (removed) return;
    removed = true;
    toast.remove();
  };
  toast.addEventListener('transitionend', finish, { once: true });
  window.setTimeout(finish, EXIT_FALLBACK_MS);
}

function showToast(variant: ToastVariant, message: string): void {
  const root = document.getElementById('toast-root');
  if (!root) return;

  removeToastNow(); // never more than one toast

  const toast = document.createElement('div');
  toast.className = `toast toast--${variant}`;
  toast.setAttribute('role', 'status');
  toast.dataset.escLayer = '';
  toast.dataset.escPriority = '20';
  toast.dataset.open = 'true';
  toast.addEventListener('esc-close', dismissToast);

  const text = document.createElement('span');
  text.className = 'toast__message';
  text.textContent = message;
  toast.appendChild(text);

  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'toast__close';
  close.setAttribute('aria-label', 'Dismiss');
  close.appendChild(buildCloseIcon());
  close.addEventListener('click', dismissToast);
  toast.appendChild(close);

  root.appendChild(toast);
  currentToast = toast;

  // Two frames so the entrance transition runs from the base state.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      if (toast === currentToast) toast.classList.add('toast--in');
    });
  });

  dismissTimer = window.setTimeout(dismissToast, AUTO_DISMISS_MS);
}

/** The address, recovered by decoding the obfuscated anchor (§6). */
function readAddress(): string {
  const link = document.getElementById('contact-address');
  if (!(link instanceof HTMLAnchorElement)) return '';
  return (link.getAttribute('href') ?? '').replace(/^mailto:/, '');
}

const copyButton = document.getElementById('copy-address');
copyButton?.addEventListener('click', () => {
  const address = readAddress();
  const warn = (): void =>
    showToast('warning', `Couldn't copy — the address is ${address}.`);

  if (!address || typeof navigator.clipboard?.writeText !== 'function') {
    warn();
    return;
  }
  navigator.clipboard.writeText(address).then(
    () => showToast('success', 'Address copied. We read every one.'),
    warn
  );
});

export {};
