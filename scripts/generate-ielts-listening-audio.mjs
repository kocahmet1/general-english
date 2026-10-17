// Renders the IELTS listening recordings (src/data/ieltsListeningTests.ts) with
// Kokoro, a free text-to-speech model that runs on your own CPU (no API key, no cost).
//
// One-time setup (kept out of package.json so deploys stay small):
//   npm install --no-save kokoro-js
// Run:
//   node scripts/generate-ielts-listening-audio.mjs                      # every test and part
//   node scripts/generate-ielts-listening-audio.mjs --test ielts-listening-practice-1 --part 2
//   node scripts/generate-ielts-listening-audio.mjs --force              # ignore the speech cache
//
// Needs ffmpeg on PATH, FFMPEG_PATH, or Python's imageio_ffmpeg package (same as
// generate-listening-audio.mjs). The first run downloads the Kokoro model (~330 MB)
// into .tools/kokoro-models. Unchanged lines are reused from .tools/ielts-listening-audio-cache.
//
// Each part becomes one MP3 in public/audio/ielts/, laid out like a real IELTS
// recording: announcer, reading time before each section, the conversation or
// talk, and time to check answers. Timings go to src/data/ieltsListeningAudioManifest.ts.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import ts from 'typescript';
import { applyLexicon, chunkText, endsSentence, normalizeForTts } from './ielts-audio/text.mjs';
import { SAMPLE_RATE, TRIM_LEAD_MS, TRIM_TAIL_MS, concat, conditionSpeech, floatToInt16Buffer, silence, trimSilence } from './ielts-audio/dsp.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const args = process.argv.slice(2);
const argValue = name => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
const onlyTest = argValue('--test');
const onlyPart = argValue('--part') ? Number(argValue('--part')) : undefined;
const force = args.includes('--force');

const MODEL_ID = 'onnx-community/Kokoro-82M-v1.0-ONNX';
const DTYPE = process.env.KOKORO_DTYPE || 'fp32';
const CACHE_VERSION = 1;
const MP3_KBPS = 48;
const ANNOUNCER = { voice: 'bf_isabella', speed: 0.82 };
/** Words Kokoro misreads (whole word, case-insensitive). Audio only; transcripts are unchanged. */
const LEXICON = {};
const PREVIEW_SECONDS = { 1: 30, 2: 30, 3: 30, 4: 45 };
const BREAK_SECONDS = 30;
const CHECK_SECONDS = 30;
/** Silence between utterances in seconds (a little longer than a real recording). */
const GAPS = { sameSpeaker: 0.4, speakerChange: 0.7, paragraph: 1.0, topicShift: 0.2, afterQuestion: -0.1, announcerToAnnouncer: 0.8, announcerToLine: 1.2, lineToAnnouncer: 1.5 };
const DISCOURSE_RE = /^(so|right|ok|okay|now|anyway|next|finally|firstly|secondly|then|let me|let's)\b/i;

async function importTs(file) {
  const source = await readFile(path.join(root, file), 'utf8');
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } });
  return import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
}

function findFfmpeg() {
  const candidates = [process.env.FFMPEG_PATH, 'ffmpeg'].filter(Boolean);
  for (const c of candidates) {
    try { execFileSync(c, ['-version'], { stdio: 'ignore' }); return c; } catch { /* next */ }
  }
  for (const py of ['python', 'python3']) {
    try { return execFileSync(py, ['-c', 'import imageio_ffmpeg; print(imageio_ffmpeg.get_ffmpeg_exe())'], { encoding: 'utf8' }).trim(); } catch { /* next */ }
  }
  throw new Error('ffmpeg not found: install it, set FFMPEG_PATH, or run "pip install imageio-ffmpeg".');
}

/** Deterministic ±12% variation so gaps do not sound mechanical. */
function jitter(base, id) {
  let h = 0x811c9dc5;
  for (let i = 0; i < id.length; i++) { h ^= id.charCodeAt(i); h = Math.imul(h, 0x01000193); }
  const u = ((h >>> 0) % 10000) / 10000 - 0.5;
  return Math.max(0.05, +(base * (1 + 0.24 * u)).toFixed(3));
}

const questionsPhrase = (a, b) => (a === b ? `question ${a}` : `questions ${a} to ${b}`);
const partNoun = part => (part.number === 1 ? 'conversation' : part.number === 2 ? (part.speakers.length > 1 ? 'conversation' : 'talk') : part.number === 3 ? 'discussion' : 'lecture');

/** Part → ordered announcer lines, speaker lines and pauses, with the silence before each. */
function compilePart(part) {
  const numbers = part.questionGroups.flatMap(g => g.questions.map(q => q.number));
  const first = Math.min(...numbers);
  const last = Math.max(...numbers);
  const breaks = part.script.filter(s => s.kind === 'break');
  const firstPreviewEnd = breaks.length ? breaks[0].preview[0] - 1 : last;
  const out = [];
  let annN = 0;
  let pauseN = 0;
  const ann = text => out.push({ kind: 'announcer', id: `ann-${++annN}`, text });
  const pause = seconds => out.push({ kind: 'pause', id: `pause-${++pauseN}`, seconds });

  const context = part.context.trim().replace(/([^.!?])$/, '$1.');
  ann(`${part.number === 1 ? 'Listening test. ' : ''}Part ${part.number}. ${context} First, you have some time to look at ${questionsPhrase(first, firstPreviewEnd)}.`);
  pause(PREVIEW_SECONDS[part.number]);
  ann(`Now listen carefully and answer ${questionsPhrase(first, firstPreviewEnd)}.`);
  for (const seg of part.script) {
    if (seg.kind === 'line') out.push({ kind: 'line', id: seg.id, speaker: seg.speaker, text: seg.text });
    else {
      const [a, b] = seg.preview;
      ann(`Before you hear the rest of the ${partNoun(part)}, you have some time to look at ${questionsPhrase(a, b)}.`);
      pause(BREAK_SECONDS);
      ann(`Now listen and answer ${questionsPhrase(a, b)}.`);
    }
  }
  if (part.number < 4) {
    ann(`That is the end of Part ${part.number}. You now have half a minute to check your answers.`);
    pause(CHECK_SECONDS);
  } else ann('That is the end of the listening test.');

  const monologue = new Set(part.script.filter(s => s.kind === 'line').map(s => s.speaker)).size <= 1;
  let prev;
  let prevWasPause = false;
  out.forEach((seg, i) => {
    if (seg.kind === 'pause') { prevWasPause = true; return; }
    let gap;
    if (i === 0) gap = 0.6;
    else if (prevWasPause) gap = 0;
    else if (seg.kind === 'announcer') gap = prev.kind === 'announcer' ? GAPS.announcerToAnnouncer : GAPS.lineToAnnouncer;
    else if (prev.kind === 'announcer') gap = GAPS.announcerToLine;
    else {
      if (prev.speaker === seg.speaker) gap = monologue || prev.text.length > 250 ? GAPS.paragraph : GAPS.sameSpeaker;
      else gap = GAPS.speakerChange + (/\?["']?$/.test(prev.text.trim()) ? GAPS.afterQuestion : 0);
      if (DISCOURSE_RE.test(seg.text.trim())) gap += GAPS.topicShift;
    }
    seg.gapBefore = i === 0 || prevWasPause ? gap : jitter(gap, seg.id);
    prev = seg;
    prevWasPause = false;
  });
  return out;
}

let ttsPromise;
async function loadKokoro() {
  ttsPromise ??= (async () => {
    let kokoro;
    let transformers;
    try {
      [kokoro, transformers] = await Promise.all([import('kokoro-js'), import('@huggingface/transformers')]);
    } catch {
      throw new Error('kokoro-js is not installed. Run "npm install --no-save kokoro-js" first.');
    }
    transformers.env.cacheDir = process.env.KOKORO_CACHE_DIR || path.join(root, '.tools', 'kokoro-models');
    const t0 = Date.now();
    const tts = await kokoro.KokoroTTS.from_pretrained(MODEL_ID, { dtype: DTYPE, device: 'cpu' });
    console.log(`Kokoro (${DTYPE}) ready in ${((Date.now() - t0) / 1000).toFixed(1)} s`);
    return tts;
  })();
  return ttsPromise;
}

const cacheDir = path.join(root, '.tools', 'ielts-listening-audio-cache');
let synthesized = 0;

let ffmpegPath;

/** Time-stretch without changing pitch (ffmpeg atempo), for voices still too fast at speed 0.82. */
function stretch(pcm, tempo) {
  if (!tempo || tempo === 1) return pcm;
  const out = execFileSync(ffmpegPath, ['-hide_banner', '-loglevel', 'error', '-f', 'f32le', '-ar', String(SAMPLE_RATE), '-ac', '1', '-i', 'pipe:0', '-filter:a', `atempo=${tempo}`, '-f', 'f32le', 'pipe:1'], {
    input: Buffer.from(pcm.buffer, pcm.byteOffset, pcm.byteLength),
    maxBuffer: 256 * 1024 * 1024,
  });
  return new Float32Array(out.buffer.slice(out.byteOffset, out.byteOffset + out.length));
}

/** One utterance as conditioned PCM, from the cache when the text, voice and speed are unchanged. */
async function speech(text, { voice, speed, tempo }, label) {
  const engineText = applyLexicon(normalizeForTts(text), LEXICON);
  const key = createHash('sha256').update(JSON.stringify([CACHE_VERSION, MODEL_ID, DTYPE, voice, speed, engineText])).digest('hex').slice(0, 32);
  const file = path.join(cacheDir, `${key}.f32`);
  if (!force && existsSync(file)) {
    const buf = await readFile(file);
    return conditionSpeech(stretch(new Float32Array(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.length)), tempo));
  }
  const tts = await loadKokoro();
  const chunks = chunkText(engineText);
  const parts = [];
  for (let i = 0; i < chunks.length; i++) {
    // Kokoro babbles on 1–3 word inputs when slowed down; keep those at natural speed.
    const words = chunks[i].split(/\s+/).filter(w => /[\p{L}\p{N}]/u.test(w)).length;
    const res = await tts.generate(chunks[i], { voice, speed: words <= 3 ? Math.max(1, speed) : speed });
    if (res.sampling_rate !== SAMPLE_RATE) throw new Error(`Kokoro returned ${res.sampling_rate} Hz`);
    let pcm = res.audio;
    if (chunks.length > 1) {
      pcm = trimSilence(pcm, { leadMs: 25, tailMs: 70 });
      if (i > 0) parts.push(silence((endsSentence(chunks[i - 1]) ? 0.3 : 0.15) / speed));
    }
    if (pcm.length / SAMPLE_RATE < (chunks[i].length / 17 / speed) * 0.35) console.warn(`  ⚠ output looks truncated: "${chunks[i].slice(0, 60)}…"`);
    parts.push(pcm);
  }
  const raw = concat(parts);
  await writeFile(file, Buffer.from(raw.buffer, raw.byteOffset, raw.byteLength));
  synthesized++;
  console.log(`  ${label} · ${voice}×${speed}${tempo && tempo !== 1 ? ` · tempo ${tempo}` : ''} · ${(raw.length / SAMPLE_RATE).toFixed(1)} s`);
  return conditionSpeech(stretch(raw, tempo));
}

async function renderPart(test, part, ffmpeg) {
  const voices = Object.fromEntries(part.speakers.map(s => [s.id, { voice: s.voice, speed: s.speed, tempo: s.tempo }]));
  const pieces = [];
  const cues = [];
  let pos = 0;
  let speechSamples = 0;
  let words = 0;
  const close = at => { if (cues.length) cues[cues.length - 1].end = at; };
  for (const seg of compilePart(part)) {
    if (seg.kind === 'pause') {
      const n = Math.round(seg.seconds * SAMPLE_RATE);
      close(pos);
      cues.push({ id: seg.id, kind: 'pause', start: pos, end: pos + n });
      pieces.push(new Float32Array(n));
      pos += n;
      continue;
    }
    const voice = seg.kind === 'line' ? voices[seg.speaker] : ANNOUNCER;
    if (!voice) throw new Error(`${test.id} part ${part.number}: no voice for "${seg.speaker}"`);
    const pcm = await speech(seg.text, voice, `${test.id} P${part.number} ${seg.id}`);
    if (!pcm.length) throw new Error(`${seg.id}: Kokoro returned silence`);
    // gapBefore is the audible silence; each utterance already carries its trim margins.
    const afterSpeech = cues.length > 0 && cues[cues.length - 1].kind !== 'pause';
    const margins = (TRIM_LEAD_MS + (afterSpeech ? TRIM_TAIL_MS : 0)) / 1000;
    const gap = Math.round(Math.max(seg.gapBefore > 0 ? 0.03 : 0, seg.gapBefore - (seg.gapBefore > 0 ? margins : 0)) * SAMPLE_RATE);
    pieces.push(new Float32Array(gap));
    pos += gap;
    const start = cues.length ? pos : 0;
    close(start);
    cues.push({ id: seg.id, kind: seg.kind, start, end: pos + pcm.length });
    pieces.push(pcm);
    pos += pcm.length;
    if (seg.kind === 'line') {
      speechSamples += pcm.length;
      words += seg.text.split(/\s+/).filter(w => /[\p{L}\p{N}]/u.test(w)).length;
    }
  }
  const tail = part.number === 4 ? Math.round(1.5 * SAMPLE_RATE) : 0;
  pieces.push(new Float32Array(tail));
  pos += tail;
  close(pos);

  const fileName = `${test.id}-part${part.number}.mp3`;
  const out = path.join(root, 'public', 'audio', 'ielts', fileName);
  await mkdir(path.dirname(out), { recursive: true });
  execFileSync(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-y', '-f', 's16le', '-ar', String(SAMPLE_RATE), '-ac', '1', '-i', 'pipe:0', '-codec:a', 'libmp3lame', '-b:a', `${MP3_KBPS}k`, out], {
    input: floatToInt16Buffer(concat(pieces)),
    maxBuffer: 64 * 1024 * 1024,
  });
  const r3 = n => Math.round((n / SAMPLE_RATE) * 1000) / 1000;
  const wpm = Math.round(words / (speechSamples / SAMPLE_RATE / 60));
  console.log(`Saved ${fileName}: ${Math.round(pos / SAMPLE_RATE)} s, speech ${wpm} words/min`);
  return { src: `audio/ielts/${fileName}`, duration: r3(pos), cues: cues.map(c => ({ id: c.id, kind: c.kind, start: r3(c.start), end: r3(c.end) })) };
}

const { ieltsListeningTests } = await importTs('src/data/ieltsListeningTests.ts');
const manifestFile = 'src/data/ieltsListeningAudioManifest.ts';
let manifest = {};
if (existsSync(path.join(root, manifestFile))) manifest = (await importTs(manifestFile)).ieltsListeningAudio;
await mkdir(cacheDir, { recursive: true });
const ffmpeg = findFfmpeg();
ffmpegPath = ffmpeg;

const tests = ieltsListeningTests.filter(t => !onlyTest || t.id === onlyTest);
if (!tests.length) throw new Error(`No test with id "${onlyTest}"`);
for (const test of tests) {
  manifest[test.id] ??= {};
  for (const part of test.parts.filter(p => !onlyPart || p.number === onlyPart)) {
    manifest[test.id][part.number] = await renderPart(test, part, ffmpeg);
  }
}

await writeFile(
  path.join(root, manifestFile),
  `// Generated by scripts/generate-ielts-listening-audio.mjs. Do not edit by hand.\nimport type { IeltsPartAudio } from '../types/ieltsListening';\n\nexport const ieltsListeningAudio: Record<string, Record<number, IeltsPartAudio>> = ${JSON.stringify(manifest, null, 2)};\n`,
);
console.log(`Done. ${synthesized} new utterances synthesized; timings written to ${manifestFile}.`);
process.exit(0);
