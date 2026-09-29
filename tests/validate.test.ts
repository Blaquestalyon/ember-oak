/**
 * §6 field validation — exact owner-facing messages.
 */
import { describe, it, expect } from 'vitest';
import { checkContentField, isKnownKey } from '../src/lib/validate';

describe('isKnownKey', () => {
  it('accepts every §3 key shape and known key', () => {
    expect(isKnownKey('hero.headline')).toBe(true);
    expect(isKnownKey('contact.copy_label')).toBe(true);
  });
  it('ignores unknown keys silently (§6)', () => {
    expect(isKnownKey('private.note')).toBe(false);
    expect(isKnownKey('Hero.Headline')).toBe(false);
    expect(isKnownKey('not-a-key')).toBe(false);
  });
});

describe('checkContentField (§6 rules, exact messages)', () => {
  it('rejects empty values with the built-in-text message', () => {
    const check = checkContentField('hero.headline', '   ');
    expect(check.ok).toBe(false);
    expect(check.warning).toBe(
      'hero.headline is empty — the page is showing the built-in text.'
    );
  });

  it('allows footer.social to be empty (hidden row, not an error)', () => {
    expect(checkContentField('footer.social', '').ok).toBe(true);
  });

  it('rejects over-length values naming the count and the limit', () => {
    const check = checkContentField('hero.cue', 'x'.repeat(30));
    expect(check.ok).toBe(false);
    expect(check.warning).toContain('30 characters');
    expect(check.warning).toContain("under 24");
  });

  it('story.body at 1,024 characters shows the exact §6 sentence', () => {
    const check = checkContentField('story.body', 'x'.repeat(1024));
    expect(check.ok).toBe(false);
    expect(check.warning).toBe(
      "Your story is 1,024 characters — the page is showing the built-in copy until it's under 900."
    );
  });

  it('story.body under 120 characters is rejected as very short', () => {
    const check = checkContentField('story.body', 'x'.repeat(80));
    expect(check.ok).toBe(false);
    expect(check.warning).toContain('very short (80 characters)');
  });

  it('contact.email must look like an email; the message names the fallback', () => {
    const check = checkContentField('contact.email', 'not-an-email');
    expect(check.ok).toBe(false);
    expect(check.warning).toBe(
      "That contact address doesn't look like an email — the page is showing thebag@power-in-numbers.net."
    );
  });

  it('meta.description outside 50–160 is a WARNING ONLY (value still used)', () => {
    const check = checkContentField('meta.description', 'Too short.');
    expect(check.ok).toBe(true);
    expect(check.advisory).toBe(true);
    expect(check.warning).toContain('search engines show about 160');
  });

  it('valid values pass with no warning', () => {
    expect(checkContentField('hero.headline', 'Roasted before the sun is up.')).toEqual({
      ok: true,
    });
  });
});
