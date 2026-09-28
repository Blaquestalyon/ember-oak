/**
 * Email obfuscation (blueprint §6). The served HTML must never contain the
 * literal address: both the anchor text and its href are HTML numeric entities,
 * decoded natively by browsers (works with JavaScript disabled).
 */

/** Every character as an HTML numeric entity: "abc" -> "&#97;&#98;&#99;" */
export function toEntities(text: string): string {
  return [...text].map((ch) => `&#${ch.codePointAt(0)};`).join('');
}

/** Entity-encoded mailto href for an address ("mailto:" is encoded too). */
export function mailtoEntities(address: string): string {
  return toEntities(`mailto:${address}`);
}

/**
 * JSON string whose characters are \uXXXX escapes — for JSON-LD, where HTML
 * entities would not decode. JSON parsers decode escapes; the raw HTML never
 * contains the literal address.
 */
export function toJsonEscapes(text: string): string {
  return [...text]
    .map((ch) => `\\u${ch.codePointAt(0)!.toString(16).padStart(4, '0')}`)
    .join('');
}

/**
 * Replace the (single) occurrence of the address inside a longer sentence with
 * its entity-encoded form, so pinned copy that names the address never puts the
 * literal string in served HTML. The rest of the sentence is HTML-escaped.
 */
export function escapeHtml(text: string): string {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function sentenceWithEncodedAddress(sentence: string, address: string): string {
  const index = sentence.indexOf(address);
  if (index === -1) return escapeHtml(sentence);
  return (
    escapeHtml(sentence.slice(0, index)) +
    toEntities(address) +
    escapeHtml(sentence.slice(index + address.length))
  );
}
