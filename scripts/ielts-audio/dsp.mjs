// Dependency-free DSP for mono Float32 PCM at 24 kHz, ported from the IELTS
// site's pipeline (pipeline/audio/dsp.ts): rumble removal, silence trimming,
// speech-loudness normalisation with a look-ahead peak limiter, fades.

export const SAMPLE_RATE = 24000;
export const TRIM_LEAD_MS = 40;
export const TRIM_TAIL_MS = 90;
const PCM_CEILING_DB = -2;

const dbToGain = db => Math.pow(10, db / 20);

export const silence = seconds => new Float32Array(Math.max(0, Math.round(seconds * SAMPLE_RATE)));

function frameDb(x, frame) {
  const n = Math.ceil(x.length / frame);
  const out = new Float32Array(n);
  for (let f = 0; f < n; f++) {
    const a = f * frame;
    const b = Math.min(x.length, a + frame);
    let s = 0;
    for (let i = a; i < b; i++) s += x[i] * x[i];
    out[f] = s > 0 ? 10 * Math.log10(s / (b - a)) : -200;
  }
  return out;
}

function speechRmsDb(x) {
  const db = frameDb(x, Math.round(0.02 * SAMPLE_RATE));
  let max = -200;
  for (const v of db) if (v > max) max = v;
  const gate = Math.max(-60, max - 35);
  let energy = 0;
  let count = 0;
  for (const v of db) if (v >= gate) { energy += Math.pow(10, v / 10); count++; }
  return count ? 10 * Math.log10(energy / count) : -Infinity;
}

export function trimSilence(x, { leadMs = TRIM_LEAD_MS, tailMs = TRIM_TAIL_MS } = {}) {
  const frame = Math.round(0.005 * SAMPLE_RATE);
  const db = frameDb(x, frame);
  let max = -200;
  for (const v of db) if (v > max) max = v;
  if (max <= -100) return new Float32Array(0);
  const thr = Math.max(-55, max - 45);
  let first = -1;
  let last = -1;
  for (let f = 0; f < db.length; f++) if (db[f] >= thr) { if (first < 0) first = f; last = f; }
  if (first < 0) return new Float32Array(0);
  const start = Math.max(0, first * frame - Math.round((leadMs / 1000) * SAMPLE_RATE));
  const end = Math.min(x.length, (last + 1) * frame + Math.round((tailMs / 1000) * SAMPLE_RATE));
  return x.slice(start, end);
}

function highPass(x, cutoffHz = 40) {
  const r = Math.exp((-2 * Math.PI * cutoffHz) / SAMPLE_RATE);
  const y = new Float32Array(x.length);
  let px = 0;
  let py = 0;
  for (let i = 0; i < x.length; i++) {
    const v = x[i] - px + r * py;
    px = x[i];
    py = v;
    y[i] = v;
  }
  return y;
}

function applyFades(x, ms = 10) {
  const n = Math.min(Math.round((ms / 1000) * SAMPLE_RATE), Math.floor(x.length / 2));
  for (let i = 0; i < n; i++) {
    const g = 0.5 - 0.5 * Math.cos((Math.PI * i) / n);
    x[i] *= g;
    x[x.length - 1 - i] *= g;
  }
  return x;
}

function slidingMin(a, r) {
  const n = a.length;
  const out = new Float32Array(n);
  const dq = new Int32Array(n);
  let head = 0;
  let tail = 0;
  let next = 0;
  for (let i = 0; i < n; i++) {
    const hi = Math.min(n - 1, i + r);
    while (next <= hi) {
      while (tail > head && a[dq[tail - 1]] >= a[next]) tail--;
      dq[tail++] = next++;
    }
    while (dq[head] < i - r) head++;
    out[i] = a[dq[head]];
  }
  return out;
}

/** Look-ahead limiter: |y| never exceeds the ceiling, without clicks. */
function limitPeaks(x, ceilingDb) {
  const T = dbToGain(ceilingDb);
  const n = x.length;
  const req = new Float32Array(n);
  let over = false;
  for (let i = 0; i < n; i++) {
    const a = Math.abs(x[i]);
    if (a > T) { req[i] = T / a; over = true; } else req[i] = 1;
  }
  if (!over) return x;
  const L = Math.max(2, Math.round(0.003 * SAMPLE_RATE));
  const h = slidingMin(req, L);
  const r = Math.floor(L / 2);
  const s = new Float32Array(n);
  let acc = 0;
  let count = 0;
  let lo = 0;
  let hi = -1;
  for (let i = 0; i < n; i++) {
    const wantHi = Math.min(n - 1, i + r);
    while (hi < wantHi) { acc += h[++hi]; count++; }
    const wantLo = Math.max(0, i - r);
    while (lo < wantLo) { acc -= h[lo++]; count--; }
    s[i] = Math.min(h[i], acc / count);
  }
  const rc = 1 - Math.exp(-1 / (0.06 * SAMPLE_RATE));
  let g = 1;
  for (let i = 0; i < n; i++) {
    const t = s[i];
    g = t < g ? t : g + (t - g) * rc;
    x[i] *= g;
    if (x[i] > T) x[i] = T;
    else if (x[i] < -T) x[i] = -T;
  }
  return x;
}

/** Per utterance: rumble removal → trim → loudness to -20 dBFS speech RMS → limiter → fades. */
export function conditionSpeech(raw) {
  const trimmed = trimSilence(highPass(raw));
  if (!trimmed.length) return trimmed;
  const measured = speechRmsDb(trimmed);
  const y = new Float32Array(trimmed);
  if (Number.isFinite(measured)) {
    const g = dbToGain(Math.min(30, -20 - measured));
    for (let i = 0; i < y.length; i++) y[i] *= g;
  }
  return applyFades(limitPeaks(y, PCM_CEILING_DB));
}

export function concat(chunks) {
  let n = 0;
  for (const c of chunks) n += c.length;
  const out = new Float32Array(n);
  let o = 0;
  for (const c of chunks) { out.set(c, o); o += c.length; }
  return out;
}

export function floatToInt16Buffer(x) {
  const b = Buffer.alloc(x.length * 2);
  for (let i = 0; i < x.length; i++) {
    const v = Math.max(-1, Math.min(1, x[i]));
    b.writeInt16LE(v < 0 ? Math.round(v * 32768) : Math.round(v * 32767), i * 2);
  }
  return b;
}
