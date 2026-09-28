/**
 * §6 email obfuscation — the literal address never survives encoding.
 */
import { describe, it, expect } from 'vitest';
import {
  toEntities,
  mailtoEntities,
  toJsonEscapes,
  escapeHtml,
  sentenceWithEncodedAddress,
} from '../src/lib/obfuscate';

const ADDRESS = 'thebag@power-in-numbers.net';

describe('toEntities', () => {
  it('encodes every character as a numeric entity', () => {
    expect(toEntities('the')).toBe('&#116;&#104;&#101;');
  });
  it('output never contains the input literally', () => {
    expect(toEntities(ADDRESS)).not.toContain(ADDRESS);
    expect(toEntities(ADDRESS)).not.toContain('thebag');
  });
});

describe('mailtoEntities', () => {
  it('encodes the mailto scheme too (§6 pins its encoded form)', () => {
    expect(mailtoEntities(ADDRESS).startsWith('&#109;&#97;&#105;&#108;&#116;&#111;&#58;')).toBe(
      true
    );
    expect(mailtoEntities(ADDRESS)).not.toContain('mailto');
  });
});

describe('toJsonEscapes', () => {
  it('produces \\uXXXX escapes that JSON.parse decodes back', () => {
    const escaped = toJsonEscapes(ADDRESS);
    expect(escaped).not.toContain('thebag');
    expect(JSON.parse(`"${escaped}"`)).toBe(ADDRESS);
  });
});

describe('escapeHtml', () => {
  it('escapes the five HTML special characters', () => {
    expect(escapeHtml(`<a href="x">&'</a>`)).toBe(
      '&lt;a href=&quot;x&quot;&gt;&amp;&#39;&lt;/a&gt;'
    );
  });
});

describe('sentenceWithEncodedAddress', () => {
  it('encodes only the address inside a pinned sentence', () => {
    const out = sentenceWithEncodedAddress(`Email us at ${ADDRESS}.`, ADDRESS);
    expect(out).not.toContain(ADDRESS);
    expect(out.startsWith('Email us at ')).toBe(true);
  });
  it('escapes the whole sentence when the address is absent', () => {
    expect(sentenceWithEncodedAddress('No address here.', ADDRESS)).toBe('No address here.');
  });
});
