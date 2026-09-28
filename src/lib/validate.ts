/**
 * Field validation — blueprint §6, with the exact owner-facing messages.
 * Validation is per field, never per page: one bad field can never blank the site.
 */
import { CONTENT_DEFAULTS, OPTIONAL_KEYS } from '../content/fallback';

export interface FieldCheck {
  ok: boolean;
  /** Owner-facing warning for /status. Present when ok is false, or for advisory warnings. */
  warning?: string;
  /** Advisory: the value is still used even though a warning is raised. */
  advisory?: boolean;
}

const KEY_PATTERN = /^[a-z]+\.[a-z_]+$/;
const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[a-z]{2,}$/;

export function isKnownKey(key: string): boolean {
  return KEY_PATTERN.test(key) && key in CONTENT_DEFAULTS;
}

/** Validate one content field per §6. Assumes the key is known. */
export function checkContentField(key: string, rawValue: string): FieldCheck {
  const value = rawValue.trim();
  const rule = CONTENT_DEFAULTS[key]!;

  if (value.length === 0) {
    if (OPTIONAL_KEYS.has(key)) return { ok: true };
    return { ok: false, warning: `${key} is empty — the page is showing the built-in text.` };
  }

  if (value.length > rule.maxLength) {
    if (key === 'story.body') {
      return {
        ok: false,
        warning: `Your story is ${value.length.toLocaleString('en-GB')} characters — the page is showing the built-in copy until it's under ${rule.maxLength}.`,
      };
    }
    return {
      ok: false,
      warning: `Your ${key} is ${value.length.toLocaleString('en-GB')} characters — the page shows the built-in copy until it's under ${rule.maxLength}.`,
    };
  }

  if (key === 'story.body' && value.length < 120) {
    return {
      ok: false,
      warning: `Your story is very short (${value.length} characters) — the page shows the built-in copy until it's at least 120.`,
    };
  }

  if (key === 'contact.email' && !EMAIL_PATTERN.test(value)) {
    return {
      ok: false,
      warning: `That contact address doesn't look like an email — the page is showing ${CONTENT_DEFAULTS['contact.email']!.value}.`,
    };
  }

  if (key === 'meta.description' && (value.length < 50 || value.length > 160)) {
    // Warning only; the value is still used (§6).
    return {
      ok: true,
      advisory: true,
      warning: `Your search description is ${value.length} characters — search engines show about 160.`,
    };
  }

  return { ok: true };
}
