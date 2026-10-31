import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

async function loadModule(file) {
  const text = await readFile(new URL(file, import.meta.url), 'utf8');
  const { outputText } = ts.transpileModule(text, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } });
  return import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
}
const { ieltsReadingPassages } = await loadModule('../src/data/ieltsReadingPassages.ts');
const { evaluateReadingAnswer, getQuestionOptions, getQuestionGroup, isOverWordLimit } = await loadModule('../src/services/readingAnswers.ts');

test('IELTS passages have unique ids', () => {
  assert.ok(ieltsReadingPassages.length >= 2);
  assert.equal(new Set(ieltsReadingPassages.map(p => p.id)).size, ieltsReadingPassages.length);
});

for (const passage of ieltsReadingPassages) {
  test(`${passage.id}: questions, groups and answers are consistent`, () => {
    const paragraphs = passage.passage.split('\n\n');
    const words = passage.passage.split(/\s+/).filter(w => /[A-Za-z0-9]/.test(w)).length;
    assert.equal(passage.format, 'ielts');
    assert.ok(Math.abs(words - passage.wordCount) <= 10, `wordCount ${passage.wordCount} vs actual ${words}`);
    assert.equal(new Set(passage.questions.map(q => q.id)).size, passage.questions.length);
    passage.questions.forEach((q, i) => assert.equal(q.id, i + 1, 'Question ids follow exam numbering'));

    for (const group of passage.questionGroups) {
      const members = passage.questions.filter(q => q.groupId === group.id);
      assert.ok(members.length > 0, `group ${group.id} has questions`);
      const indexes = members.map(q => passage.questions.indexOf(q));
      assert.deepEqual(indexes, indexes.map((_, k) => indexes[0] + k), `group ${group.id} questions are consecutive`);
      if (group.summary) {
        const gaps = [...group.summary.matchAll(/\[\[(\d+)\]\]/g)].map(m => Number(m[1]));
        assert.deepEqual(gaps, members.map(q => q.id), 'every summary gap is one question, in order');
      }
      if (group.example) assert.ok(group.options.some(o => o.letter === group.example.answer));
    }

    for (const q of passage.questions) {
      const label = `${passage.id} Q${q.id}`;
      assert.ok(getQuestionGroup(passage, q), `${label} belongs to a group`);
      assert.ok(q.explanation && q.explanation.length > 30, `${label} has an explanation`);
      assert.ok(q.evidence && passage.passage.includes(q.evidence), `${label} evidence is quoted exactly from the passage`);
      assert.ok(!paragraphs.some(p => p.includes(q.evidence)) || paragraphs.filter(p => p.includes(q.evidence)).length === 1, `${label} evidence is unambiguous`);
      const format = q.answerFormat ?? 'choice';
      if (format === 'text') {
        const group = getQuestionGroup(passage, q);
        for (const answer of [q.correctAnswer, ...(q.acceptedAnswers ?? [])]) {
          assert.ok(!isOverWordLimit(answer, group), `${label} answer "${answer}" fits the word limit`);
          // Every word of an answer must be taken from the passage (short answers may leave words out).
          // Digits are exempt: "60" is an accepted way to write "sixty".
          const passageWords = new Set(passage.passage.toLowerCase().match(/[a-z0-9]+/g));
          for (const word of answer.toLowerCase().match(/[a-z]+/g) ?? []) {
            assert.ok(passageWords.has(word), `${label} answer "${answer}" uses only words from the passage ("${word}")`);
          }
          assert.equal(evaluateReadingAnswer(passage, q, answer).isCorrect, true);
          assert.equal(evaluateReadingAnswer(passage, q, `  ${answer.toUpperCase()}. `).isCorrect, true);
        }
      } else {
        const options = getQuestionOptions(passage, q).map(o => o.letter);
        assert.ok(options.includes(q.correctAnswer), `${label} correct answer is one of the options`);
        assert.equal(evaluateReadingAnswer(passage, q, q.correctAnswer).isCorrect, true);
        const wrong = options.find(o => o !== q.correctAnswer);
        assert.equal(evaluateReadingAnswer(passage, q, wrong).isCorrect, false);
        if (q.questionType === 'matching_information' || q.questionType === 'matching_headings') {
          assert.ok(passage.labelParagraphs, `${label} needs paragraph letters`);
        }
        if (q.questionType === 'matching_information') {
          assert.ok(q.correctAnswer.charCodeAt(0) - 65 < paragraphs.length);
        }
      }
    }
  });
}

test('typed answers: articles optional, word limit and spelling are reported', () => {
  const passage = ieltsReadingPassages[0];
  const microbes = passage.questions.find(q => q.correctAnswer === 'microbes');
  const sixty = passage.questions.find(q => q.correctAnswer === 'sixty');
  assert.equal(evaluateReadingAnswer(passage, microbes, 'the microbes').isCorrect, true);
  assert.equal(evaluateReadingAnswer(passage, microbes, 'Living organisms').isCorrect, true);
  assert.deepEqual(evaluateReadingAnswer(passage, microbes, 'tiny living organisms'), { isCorrect: false, issue: 'word_limit' });
  assert.deepEqual(evaluateReadingAnswer(passage, microbes, 'microbs'), { isCorrect: false, issue: 'spelling' });
  assert.deepEqual(evaluateReadingAnswer(passage, microbes, 'bacteria'), { isCorrect: false });
  assert.equal(evaluateReadingAnswer(passage, sixty, '60').isCorrect, true);
  assert.equal(evaluateReadingAnswer(passage, sixty, 'about 60').isCorrect, false);
  const shell = ieltsReadingPassages[1].questions.find(q => q.correctAnswer === 'shell');
  assert.deepEqual(evaluateReadingAnswer(ieltsReadingPassages[1], shell, 'protective shell'), { isCorrect: false, issue: 'word_limit' });
  assert.deepEqual(evaluateReadingAnswer(ieltsReadingPassages[1], shell, 'shells'), { isCorrect: false, issue: 'plural' });
  const groups = ieltsReadingPassages[1].questions.find(q => q.correctAnswer === 'groups');
  assert.deepEqual(evaluateReadingAnswer(ieltsReadingPassages[1], groups, 'group'), { isCorrect: false, issue: 'plural' });
});
