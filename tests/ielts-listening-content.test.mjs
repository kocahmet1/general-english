// Checks the IELTS listening tests: numbering, answer keys, evidence quotes,
// word limits and the generated recordings. Run: node --test tests/ielts-listening-content.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, statSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

const transpile = text => ts.transpileModule(text, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const dataUrl = js => `data:text/javascript;base64,${Buffer.from(js).toString('base64')}`;

async function loadModule(file, replacements = {}) {
  let text = await readFile(new URL(file, import.meta.url), 'utf8');
  for (const [from, to] of Object.entries(replacements)) text = text.replace(from, to);
  return import(dataUrl(transpile(text)));
}

// The scoring module imports readingAnswers.ts; point that import at a transpiled copy.
const readingAnswersUrl = dataUrl(transpile(await readFile(new URL('../src/services/readingAnswers.ts', import.meta.url), 'utf8')));
const scoring = await loadModule('../src/services/ieltsListeningScoring.ts', { "from './readingAnswers'": `from '${readingAnswersUrl}'` });
const { ieltsListeningTests } = await loadModule('../src/data/ieltsListeningTests.ts');
const { ieltsListeningAudio } = await loadModule('../src/data/ieltsListeningAudioManifest.ts');

const { markTest, markGroup, markTextAnswer, isOverWordLimit, bandForRaw, rawForBand, questionPrompt, expectedLabel } = scoring;
const TIME = /^\d{1,2}\.\d{2}/;

test('three tests with unique ids', () => {
  assert.equal(ieltsListeningTests.length, 3);
  assert.equal(new Set(ieltsListeningTests.map(t => t.id)).size, 3);
});

test('band conversion follows the IELTS listening table', () => {
  assert.equal(bandForRaw(40), 9);
  assert.equal(bandForRaw(30), 7);
  assert.equal(bandForRaw(29), 6.5);
  assert.equal(bandForRaw(26), 6.5);
  assert.equal(bandForRaw(25), 6);
  assert.equal(bandForRaw(18), 5.5);
  assert.equal(bandForRaw(16), 5);
  assert.equal(bandForRaw(13), 4.5);
  assert.equal(bandForRaw(3), 0);
  assert.equal(rawForBand(6.5), 26);
});

test('typed answers: case, currency, articles, word limits, spelling and plurals', () => {
  const key = { kind: 'text', accepted: ['9.30', '9.30 am'] };
  const limit = { maxWords: 1, allowNumber: true, label: 'ONE WORD AND/OR A NUMBER' };
  assert.equal(markTextAnswer(key, '9:30', limit).isCorrect, true);
  assert.equal(markTextAnswer(key, ' 9.30 AM ', limit).isCorrect, true);
  assert.equal(markTextAnswer({ kind: 'text', accepted: ['54'] }, '£54', limit).isCorrect, true);
  assert.equal(markTextAnswer({ kind: 'text', accepted: ['station'] }, 'railway station', limit).issue, 'word_limit');
  assert.equal(markTextAnswer({ kind: 'text', accepted: ['station'] }, 'the station', limit).isCorrect, true);
  assert.equal(markTextAnswer({ kind: 'text', accepted: ['pavements'] }, 'pavement', limit).issue, 'plural');
  assert.equal(markTextAnswer({ kind: 'text', accepted: ['Bellini'] }, 'Belini', limit).issue, 'spelling');
  assert.equal(markTextAnswer({ kind: 'text', accepted: ['Bellini'] }, 'BELLINI', limit).isCorrect, true);
  assert.equal(markTextAnswer({ kind: 'text', accepted: ['seat'] }, '', limit).issue, 'empty');
  assert.equal(markTextAnswer({ kind: 'text', accepted: ['16th', '16'] }, '15th', limit).issue, undefined, 'a wrong date is not a spelling slip');
  assert.equal(isOverWordLimit('12 km', limit), false);
  assert.equal(isOverWordLimit('river path', { maxWords: 1, allowNumber: false, label: 'ONE WORD ONLY' }), true);
});

test('"Choose TWO" pairs: either order, each letter counts once', () => {
  const group = { type: 'mcq_multi', answerKeys: ['C', 'E'], questions: [{ number: 17 }, { number: 18 }] };
  assert.deepEqual(markGroup(group, { 17: 'E', 18: 'C' }).map(m => m.isCorrect), [true, true]);
  assert.deepEqual(markGroup(group, { 17: 'C', 18: 'A' }).map(m => m.isCorrect), [true, false]);
  assert.deepEqual(markGroup(group, { 17: 'C', 18: 'C' }).map(m => m.isCorrect), [true, false]);
});

for (const t of ieltsListeningTests) {
  test(`${t.id}: structure, numbering and answer keys`, () => {
    assert.deepEqual(t.parts.map(p => p.number), [1, 2, 3, 4]);
    const numbers = t.parts.flatMap(p => p.questionGroups.flatMap(g => g.questions.map(q => q.number)));
    assert.deepEqual(numbers, Array.from({ length: 40 }, (_, i) => i + 1), 'questions are numbered 1–40 in order');
    t.parts.forEach(p => assert.equal(p.questionGroups.flatMap(g => g.questions).length, 10, `part ${p.number} has 10 questions`));

    const correct = {};
    for (const part of t.parts) {
      const label = `${t.id} P${part.number}`;
      const lines = part.script.filter(s => s.kind === 'line');
      const speakers = new Set(part.speakers.map(s => s.id));
      assert.equal(new Set(lines.map(l => l.id)).size, lines.length, `${label}: line ids are unique`);
      lines.forEach(l => assert.ok(speakers.has(l.speaker), `${label} ${l.id}: unknown speaker ${l.speaker}`));
      part.speakers.forEach(s => {
        assert.ok(s.speed >= 0.82 && s.speed <= 1.1, `${label} ${s.id}: Kokoro speed ${s.speed} outside 0.82–1.1`);
        assert.ok(s.tempo === undefined || (s.tempo >= 0.85 && s.tempo <= 1), `${label} ${s.id}: tempo ${s.tempo} outside 0.85–1`);
      });
      const scriptText = lines.map(l => l.text).join('\n').toLowerCase();
      const lineById = new Map(lines.map(l => [l.id, l]));
      const groupStarts = part.questionGroups.map(g => Math.min(...g.questions.map(q => q.number)));
      for (const seg of part.script.filter(s => s.kind === 'break')) {
        assert.ok(groupStarts.includes(seg.preview[0]), `${label}: break preview starts a question group`);
      }
      const checkEvidence = (evidence, who) => {
        assert.ok(evidence?.length, `${who}: has evidence`);
        for (const e of evidence) {
          const line = lineById.get(e.line);
          assert.ok(line, `${who}: evidence line ${e.line} exists`);
          assert.ok(line.text.includes(e.quote), `${who}: evidence quote is copied exactly from ${e.line}: "${e.quote}"`);
        }
      };

      for (const g of part.questionGroups) {
        const nums = g.questions.map(q => q.number);
        assert.deepEqual(nums, nums.map((_, i) => nums[0] + i), `${g.id}: consecutive questions`);
        if (g.type === 'gap_fill') {
          const texts = [...(g.blocks ?? []).map(b => b.value ?? b.text ?? ''), ...(g.table?.rows.flat() ?? [])];
          const gaps = texts.flatMap(s => [...s.matchAll(/\{\{(\d+)\}\}/g)].map(m => Number(m[1])));
          assert.deepEqual(gaps, nums, `${g.id}: every gap is one question, in order`);
          assert.ok(g.wordLimit || g.boxOptions, `${g.id}: has a word limit or a box of options`);
        }
        if (g.type === 'mcq_multi') {
          const keys = g.options.map(o => o.key);
          assert.equal(g.answerKeys.length, g.questions.length);
          g.answerKeys.forEach(k => assert.ok(keys.includes(k), `${g.id}: key ${k} is an option`));
          assert.ok(g.explanation.length > 30, `${g.id}: has an explanation`);
          checkEvidence(g.evidence, g.id);
          g.questions.forEach((q, i) => { correct[q.number] = g.answerKeys[i]; });
          continue;
        }
        for (const q of g.questions) {
          const who = `${t.id} Q${q.number}`;
          assert.ok(q.answer, `${who}: has an answer`);
          assert.ok(q.explanation && q.explanation.length > 30, `${who}: has an explanation`);
          checkEvidence(q.evidence, who);
          assert.ok(questionPrompt(g, q) && !questionPrompt(g, q).startsWith('Soru'), `${who}: has a readable prompt`);
          assert.ok(expectedLabel(g, q), `${who}: has a readable key`);
          if (q.answer.kind === 'text') {
            const limit = g.wordLimit;
            for (const a of q.answer.accepted) {
              assert.ok(!isOverWordLimit(a, limit), `${who}: "${a}" fits ${limit.label}`);
              assert.equal(markTextAnswer(q.answer, a.toUpperCase(), limit).isCorrect, true);
            }
            if (!TIME.test(q.answer.accepted[0])) {
              assert.ok(q.answer.accepted.some(a => scriptText.includes(a.toLowerCase())), `${who}: the answer is heard in the recording`);
              // Spelled names ("L-A-R-K-I-N") count as the word itself.
              const unspell = s => s.replace(/(?<![\p{L}-])((?:\p{L}-){2,}\p{L})(?![\p{L}-])/gu, m => m.replace(/-/g, '')).toLowerCase();
              assert.ok(q.evidence.some(e => q.answer.accepted.some(a => unspell(e.quote).includes(a.toLowerCase()))), `${who}: the evidence quote contains the answer`);
            }
            correct[q.number] = q.answer.accepted[0];
          } else {
            const options = g.type === 'mcq_single' ? q.options : g.type === 'matching' ? g.options : g.boxOptions;
            assert.ok(options?.some(o => o.key === q.answer.key), `${who}: key ${q.answer.key} is an option`);
            correct[q.number] = q.answer.key;
          }
        }
      }
    }
    assert.equal(markTest(t, correct).filter(m => m.isCorrect).length, 40, 'the key scores 40/40');
    assert.equal(markTest(t, {}).filter(m => m.isCorrect).length, 0, 'an empty sheet scores 0');
  });

  test(`${t.id}: answers are spread over the options`, () => {
    // A key like A, A, A, A teaches students to guess; keep letter answers varied in every part.
    for (const part of t.parts) {
      const letters = part.questionGroups.filter(g => g.type === 'mcq_single').flatMap(g => g.questions.map(q => q.answer.key));
      const most = Math.max(0, ...['A', 'B', 'C'].map(k => letters.filter(l => l === k).length));
      if (letters.length >= 3) assert.ok(most <= Math.ceil(letters.length / 2), `${t.id} P${part.number}: multiple-choice keys ${letters.join('')} lean on one letter`);
    }
    const all = t.parts.flatMap(p => p.questionGroups.filter(g => g.type === 'mcq_single').flatMap(g => g.questions.map(q => q.answer.key)));
    ['A', 'B', 'C'].forEach(k => assert.ok(all.filter(l => l === k).length >= 2, `${t.id}: letter ${k} is a key at least twice (${all.join('')})`));
  });

  test(`${t.id}: recordings and cues`, () => {
    const audio = ieltsListeningAudio[t.id];
    assert.ok(audio, 'audio manifest has the test');
    for (const part of t.parts) {
      const a = audio[part.number];
      assert.ok(a, `part ${part.number} has audio`);
      const file = new URL(`../public/${a.src}`, import.meta.url);
      assert.ok(existsSync(file) && statSync(file).size > 100_000, `${a.src} exists`);
      const lineIds = part.script.filter(s => s.kind === 'line').map(s => s.id);
      const cueIds = a.cues.filter(c => c.kind === 'line').map(c => c.id);
      assert.deepEqual(cueIds, lineIds, `part ${part.number}: one cue per script line, in order (re-render after editing the script)`);
      a.cues.forEach((c, i) => {
        assert.ok(c.end > c.start, `cue ${c.id} has a length`);
        if (i) assert.ok(c.start >= a.cues[i - 1].start, `cue ${c.id} is in order`);
      });
      assert.ok(a.duration >= a.cues[a.cues.length - 1].end - 0.01);
    }
  });

  test(`${t.id}: figures exist`, () => {
    for (const g of t.parts.flatMap(p => p.questionGroups)) {
      if (g.type === 'matching' && g.figure) assert.ok(existsSync(new URL(`../public/${g.figure.src}`, import.meta.url)), g.figure.src);
    }
  });
}
