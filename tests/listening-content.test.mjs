import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import ts from 'typescript';

async function loadData(file) {
  const text = await readFile(new URL(file, import.meta.url), 'utf8');
  const { outputText } = ts.transpileModule(text, { compilerOptions: { module: ts.ModuleKind.ESNext } });
  return import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
}
const { listeningContent } = await loadData('../src/data/listeningContent.ts');
const { listeningAudioManifest } = await loadData('../src/data/listeningAudioManifest.ts');

test('catalog contains exactly two conversations, four lectures, and 34 questions', () => {
  assert.equal(listeningContent.filter(p => p.section === 'conversation').length, 2);
  assert.equal(listeningContent.filter(p => p.section === 'lecture').length, 4);
  assert.equal(listeningContent.reduce((n, p) => n + p.questions.length, 0), 34);
  assert.equal(new Set(listeningContent.map(p => p.id)).size, 6);
});

for (const passage of listeningContent) {
  test(`${passage.id}: complete recording, timed turns, valid questions and speaker assignments`, async () => {
    assert.equal(passage.questions.length, passage.section === 'conversation' ? 5 : 6);
    assert.equal(new Set(passage.questions.map(q => q.id)).size, passage.questions.length);
    const timing = listeningAudioManifest[passage.id];
    assert.ok(timing);
    assert.equal(timing.turns.length, passage.turns.length);
    assert.ok(timing.duration >= (passage.section === 'conversation' ? 150 : 210));
    assert.ok(timing.duration < 330);
    let lastEnd = 0;
    const voices = new Map();
    passage.turns.forEach((turn, i) => {
      assert.ok(turn.text.trim().length > 0);
      if (voices.has(turn.speaker)) assert.equal(turn.voice, voices.get(turn.speaker));
      voices.set(turn.speaker, turn.voice);
      assert.ok(timing.turns[i].startTime >= lastEnd);
      assert.ok(timing.turns[i].endTime > timing.turns[i].startTime);
      lastEnd = timing.turns[i].endTime;
    });
    assert.ok(Math.abs(lastEnd - timing.duration) < 0.01);
    if (passage.section === 'conversation') {
      assert.equal(voices.size, 2);
      assert.equal(new Set(voices.values()).size, 2, 'Speakers must have genuinely different voice IDs');
    }
    for (const question of passage.questions) {
      assert.equal(question.options.length, 4);
      assert.deepEqual(question.options.map(o => o.letter), ['A', 'B', 'C', 'D']);
      assert.ok(question.explanation.length > 30);
      const correct = question.correctAnswer.split(',');
      assert.equal(correct.length, question.answerCount || 1);
      assert.equal(new Set(correct).size, correct.length);
      assert.ok(correct.every(letter => question.options.some(o => o.letter === letter)));
      if (question.replayTurnIndex !== undefined) assert.ok(timing.turns[question.replayTurnIndex]);
    }
    const recording = new URL(`../public/audio/toefl/${passage.id}.mp3`, import.meta.url);
    assert.ok((await stat(recording)).size > 1_000_000, 'Full recording must be bundled');
  });
}
