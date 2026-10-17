// Text normalisation for the IELTS listening recordings, ported from the IELTS
// site's pipeline (pipeline/audio/normalize.ts). Turns script text into what an
// IELTS recording would say: "L-A-R-K-I-N" → letter names, "£54" → "54 pounds",
// "9.30" → "nine thirty", "10p" → "10 pence". The transcript is never changed.

const ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

export function numberToWords(n) {
  if (!Number.isInteger(n) || n < 0 || n > 999) return String(n);
  if (n < 20) return ONES[n];
  if (n < 100) return TENS[Math.floor(n / 10)] + (n % 10 ? `-${ONES[n % 10]}` : '');
  const rest = n % 100;
  return `${ONES[Math.floor(n / 100)]} hundred${rest ? ` and ${numberToWords(rest)}` : ''}`;
}

const DIGIT = d => (d === '0' ? 'oh' : ONES[Number(d)]);

/** ["L","L"] → ["double L"]; runs of three → "triple". */
function collapseRuns(items) {
  const out = [];
  let i = 0;
  while (i < items.length) {
    let j = i;
    while (j + 1 < items.length && items[j + 1] === items[i]) j++;
    let run = j - i + 1;
    while (run > 0) {
      if (run === 1) { out.push(items[i]); run = 0; }
      else if (run === 3) { out.push(`triple ${items[i]}`); run = 0; }
      else { out.push(`double ${items[i]}`); run -= 2; }
    }
    i = j + 1;
  }
  return out;
}

const SPELLED_RE = /(?<![\p{L}\p{N}-])(\p{L}|\p{N})(?:-(\p{L}|\p{N})){2,}(?![\p{L}\p{N}]|-\p{L})/gu;

/** "B-E-L-L-I-N-I" → "B, E, double L, I, N, I" (commas make Kokoro read letter names). */
export function expandSpelled(text) {
  return text.replace(SPELLED_RE, m => {
    const chars = m.split('-');
    if (!chars.some(c => /\p{L}/u.test(c))) return m;
    return collapseRuns(chars.map(c => (/\d/.test(c) ? DIGIT(c) : c.toUpperCase()))).join(', ');
  });
}

const MONEY_RE = /([£$€])\s?(\d{1,3}(?:,\d{3})+|\d+)(?:\.(\d{1,2}))?/g;
const UNIT = { '£': ['pound', 'pounds'], $: ['dollar', 'dollars'], '€': ['euro', 'euros'] };

export function expandMoney(text) {
  return text
    .replace(MONEY_RE, (_m, sym, whole, frac) => {
      const [one, many] = UNIT[sym];
      const pence = frac ? Number(frac.padEnd(2, '0')) : 0;
      const unit = whole === '1' ? one : many;
      return pence ? `${whole} ${unit} ${pence}` : `${whole} ${unit}`;
    })
    .replace(/\b(\d+)p\b/g, (_m, n) => `${n} ${n === '1' ? 'penny' : 'pence'}`);
}

export const expandPercent = text => text.replace(/(\d)\s?%/g, '$1 percent');

function timeWords(h, m, meridiem) {
  const hour = numberToWords(h);
  const ampm = meridiem ? ` ${meridiem.replace(/\./g, '').toUpperCase()}` : '';
  if (m === 0) return meridiem ? `${hour}${ampm}` : `${hour} o'clock`;
  return `${hour} ${m < 10 ? `oh ${ONES[m]}` : numberToWords(m)}${ampm}`;
}

const MERIDIEM = '(a\\.m\\.|p\\.m\\.|am|pm)(?![\\w])';
const TIME_AMPM_RE = new RegExp(`\\b([01]?\\d|2[0-3])[:.]([0-5]\\d)\\s?${MERIDIEM}`, 'gi');
const HOUR_AMPM_RE = new RegExp(`\\b(1[0-2]|0?[1-9])\\s?${MERIDIEM}`, 'gi');
const TIME_COLON_RE = /(?<![\d:])\b([01]?\d|2[0-3]):([0-5]\d)\b(?![:\d])/g;
const MEASURE = '%|percent|per|million|thousand|hundred|minutes?|hours?|days?|weeks?|months?|years?|metres?|kilo\\w*|km|kg|miles?|pounds?|pence|degrees?';
// A bare clock time ("Yes, 9.30 is fine."). Decimals with two places do not occur in the scripts.
const TIME_DOT_RE = new RegExp(`(?<![£$€\\d.,])\\b(1[0-2]|[1-9])\\.([0-5]\\d)\\b(?![.,]?\\d)(?!\\s?(?:${MEASURE})\\b)`, 'gi');

export function expandTimes(text) {
  return text
    .replace(TIME_AMPM_RE, (_m, h, mm, mer) => timeWords(Number(h), Number(mm), mer))
    .replace(HOUR_AMPM_RE, (_m, h, mer) => timeWords(Number(h), 0, mer))
    .replace(TIME_COLON_RE, (_m, h, mm) => timeWords(Number(h), Number(mm)))
    .replace(TIME_DOT_RE, (_m, h, mm) => timeWords(Number(h), Number(mm)));
}

const UNITS = [
  [/km/, 'kilometre', 'kilometres'],
  [/kg/, 'kilogram', 'kilograms'],
];

export function expandAbbreviations(text) {
  let t = text
    .replace(/\bDr\.?(?=\s+[A-Z])/g, 'Doctor')
    .replace(/\bMrs\.?(?=\s+[A-Z])/g, 'Missus')
    .replace(/\bMr\.?(?=\s+[A-Z])/g, 'Mister')
    .replace(/\be\.g\.,?/gi, 'for example,')
    .replace(/\s&\s/g, ' and ');
  for (const [re, one, many] of UNITS) {
    t = t.replace(new RegExp(`\\b(\\d+(?:\\.\\d+)?)\\s?${re.source}(?![\\w])`, 'g'), (_m, n) => `${n} ${n === '1' ? one : many}`);
  }
  return t;
}

export function cleanup(text) {
  return text
    .normalize('NFKC')
    .replace(/[‘’´`]/g, "'")
    .replace(/[“”«»]/g, '"')
    .replace(/[–—]/g, ', ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Full pipeline; idempotent. */
export function normalizeForTts(input) {
  let t = cleanup(input);
  t = expandSpelled(t);
  t = expandMoney(t);
  t = expandPercent(t);
  t = expandTimes(t);
  t = expandAbbreviations(t);
  return cleanup(t);
}

/** Whole-word, case-insensitive respellings for words Kokoro misreads. */
export function applyLexicon(text, lexicon = {}) {
  let t = text;
  for (const [word, say] of Object.entries(lexicon)) {
    const esc = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    t = t.replace(new RegExp(`(?<![\\p{L}\\p{N}])${esc}(?![\\p{L}\\p{N}])`, 'giu'), say);
  }
  return t;
}

/** Sentences; a boundary is . ! ? followed by space and a capital letter, digit or quote. */
export function splitSentences(text) {
  const out = [];
  let start = 0;
  for (const m of text.matchAll(/[.!?…]+["')\]]*\s+(?=["'(\[]?[\p{Lu}\d])/gu)) {
    const end = m.index + m[0].length;
    out.push(text.slice(start, end).trim());
    start = end;
  }
  if (start < text.length) out.push(text.slice(start).trim());
  return out.filter(Boolean);
}

export const endsSentence = chunk => /[.!?…]["')\]]*$/.test(chunk.trim());

/**
 * Kokoro silently truncates input beyond ~510 phonemes, so long lines are
 * synthesized in sentence groups of at most `maxChars` characters.
 */
export function chunkText(text, maxChars = 300, mergeChars = 220) {
  const splitLong = s => {
    if (s.length <= maxChars) return [s];
    const mid = s.length / 2;
    let best = -1;
    for (const m of s.matchAll(/[,;:]\s/g)) {
      const i = m.index + 1;
      if (best < 0 || Math.abs(i - mid) < Math.abs(best - mid)) best = i;
    }
    if (best < 0) {
      const sp = s.lastIndexOf(' ', Math.floor(mid));
      best = sp > 0 ? sp : Math.floor(mid);
    }
    return [...splitLong(s.slice(0, best).trim()), ...splitLong(s.slice(best).trim())];
  };
  const chunks = [];
  for (const p of splitSentences(text).flatMap(splitLong)) {
    const last = chunks[chunks.length - 1];
    if (last !== undefined && endsSentence(last) && last.length + 1 + p.length <= Math.min(maxChars, mergeChars)) {
      chunks[chunks.length - 1] = `${last} ${p}`;
    } else chunks.push(p);
  }
  return chunks;
}
