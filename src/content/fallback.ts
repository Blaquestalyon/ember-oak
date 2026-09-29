/**
 * The committed built-in copy — blueprint §3 seed data, verbatim.
 * Per-field fallback: any key that is missing or invalid in Airtable
 * resolves to the value here, so the page can never render blank.
 */

export interface ContentRule {
  /** Built-in default value. */
  value: string;
  /** Maximum length enforced per §6. */
  maxLength: number;
}

export const CONTENT_DEFAULTS: Record<string, ContentRule> = {
  'meta.title': { value: 'Ember & Oak — small-batch coffee roasters', maxLength: 60 },
  'meta.description': {
    value:
      'Small-batch coffee roasted before sunrise, twelve kilos at a time, and bagged the same morning.',
    maxLength: 160,
  },
  'hero.eyebrow': { value: 'SMALL BATCH · ROASTED DAILY', maxLength: 32 },
  'hero.headline': { value: 'Roasted before the sun is up.', maxLength: 60 },
  'hero.subhead': {
    value: 'Twelve kilos at a time, in a dim room on the edge of town — bagged the same morning.',
    maxLength: 140,
  },
  'hero.alt': {
    value:
      'An Ember & Oak coffee bag standing on a dark oak counter, lit from the left by warm lamplight.',
    maxLength: 160,
  },
  'hero.cue': { value: 'See the roasts', maxLength: 24 },
  'roasts.title': { value: 'Two ways to take it.', maxLength: 48 },
  'roasts.intro': {
    value: "The same bag, filled two ways. Whatever's on the counter this week is listed here.",
    maxLength: 200,
  },
  'film.title': { value: 'Five seconds in the drum.', maxLength: 48 },
  'film.caption': { value: 'Green to dark, on the counter where it happens.', maxLength: 120 },
  'film.description': {
    value:
      'A single green coffee bean rests on an oak counter with the Ember & Oak bag standing behind it. Over five seconds the bean darkens from pale green through tan to a deep, oily brown as warm light moves across it.',
    maxLength: 400,
  },
  'story.title': { value: 'Our story', maxLength: 40 },
  'story.body': {
    value:
      'Ember & Oak started with a secondhand drum roaster, a cold garage and a stubborn idea: that coffee should taste like the morning it was roasted. We roast in small batches before the sun is properly up — twelve kilos at a time, by eye and by ear, listening for the crack. Every bag is filled the same day it comes off the drum. Nothing sits, nothing waits, nothing goes stale on a shelf.',
    maxLength: 900,
  },
  'story.emphasis': { value: 'listening for the crack', maxLength: 80 },
  'contact.title': { value: 'Say hello.', maxLength: 40 },
  'contact.note': {
    value:
      'Wholesale, a bag for the office, or a question about a roast — this reaches us directly.',
    maxLength: 200,
  },
  'contact.email': { value: 'thebag@power-in-numbers.net', maxLength: 120 },
  'contact.copy_label': { value: 'Copy address', maxLength: 24 },
  'footer.line': { value: 'Ember & Oak · Small-batch coffee roasters', maxLength: 80 },
  // Empty by design — the footer's social row stays hidden until filled.
  'footer.social': { value: '', maxLength: 300 },
};

/** Every key the app knows. Unknown Airtable keys are silently ignored (§6). */
export const KNOWN_KEYS = Object.keys(CONTENT_DEFAULTS);

/** Keys whose built-in default is allowed to be empty. */
export const OPTIONAL_KEYS = new Set(['footer.social']);

export type RoastLevel = 'Light' | 'Medium' | 'Dark';
export type RoastProcess = 'Washed' | 'Natural' | 'Honey' | 'Wet-hulled' | 'Anaerobic';
export type ImageSlug = 'roast-light' | 'roast-dark';

export interface Roast {
  name: string;
  roastLevel: RoastLevel;
  origin: string;
  tastingNotes: string;
  process: RoastProcess | null;
  altitude: string | null;
  batchSize: string | null;
  imageSlug: ImageSlug;
  imageAlt: string;
  sortOrder: number;
  published: boolean;
}

/**
 * Committed fallback roast cards — the two published §3 seed rows.
 * Served only when Airtable has never answered since boot.
 */
export const ROAST_DEFAULTS: Roast[] = [
  {
    name: 'Sunrise Light',
    roastLevel: 'Light',
    origin: 'Huila, Colombia',
    tastingNotes: 'Apricot · Honey · Bergamot',
    process: 'Washed',
    altitude: '1,750 m',
    batchSize: '12 kg',
    imageSlug: 'roast-light',
    imageAlt:
      'The Ember & Oak bag with a LIGHT tag on its copper tie, beside pale cinnamon-coloured coffee beans on the oak counter.',
    sortOrder: 10,
    published: true,
  },
  {
    name: 'Nightwood Dark',
    roastLevel: 'Dark',
    origin: 'Gayo, Sumatra',
    tastingNotes: 'Cocoa nib · Molasses · Cedar',
    process: 'Wet-hulled',
    altitude: '1,400 m',
    batchSize: '12 kg',
    imageSlug: 'roast-dark',
    imageAlt:
      'The Ember & Oak bag with a DARK tag on its copper tie, beside oily dark-roasted coffee beans in low warm light.',
    sortOrder: 20,
    published: true,
  },
];
