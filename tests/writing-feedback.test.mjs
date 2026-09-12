import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateWriting, normalizeWritingContext, normalizeWritingFeedback } from '../server/writingFeedback.js';

const text = 'Technology help students. Technology help students.';
const context = normalizeWritingContext({ examType: 'ielts', promptTitle: 'Education', promptDescription: 'Discuss the benefits and drawbacks of technology in classrooms.', minWords: 150, maxWords: 250 });
const categories = ['subject_verb_agreement', 'other'];
function result() {
  return {
    criteria: ['taskResponse', 'coherence', 'vocabulary', 'grammar'].map(id => ({ id, score: 40, feedback: 'Fikirler yeterince geliştirilmemiş.', evidence: 'Yanıtta örnek yok.', improvement: 'Somut bir sınıf örneği ekleyin.' })),
    errors: [{ text: 'Technology help students.', startIndex: 0, endIndex: 1, suggestion: 'Technology helps students.', explanation: 'Tekil özne üçüncü tekil fiil gerektirir.', category: 'subject_verb_agreement', errorLevel: 'surface' }],
    addressedPoints: ['Teknolojinin faydasından söz edilmiş.'], missingPoints: ['Dezavantajlar açıklanmamış.'], strengths: ['Konu belli.'], suggestions: ['Bir dezavantajı örnekle açıklayın.'], correctedText: 'Technology helps students. Technology helps students.', summary: 'Dilbilgisi ve içerik geliştirilmeli.', modelAnswer: 'Technology can support learning by providing immediate feedback. However, notifications may distract students, so teachers should establish clear rules for using devices.', modelAnswerExplanation: 'Örnek yanıt her iki yönü nedenleriyle açıklıyor.',
  };
}
function clientReturning(payload, finishReason = 'stop') {
  return { chat: { completions: { create: async () => ({ choices: [{ finish_reason: finishReason, message: { content: typeof payload === 'string' ? payload : JSON.stringify(payload) } }] }) } } };
}

test('evaluates against the full question, chosen exam and requirements in one request', async () => {
  let request;
  const client = clientReturning(result());
  const create = client.chat.completions.create;
  client.chat.completions.create = async input => { request = input; return create(); };
  const feedback = await evaluateWriting(client, text, { ...context, examType: 'toefl' }, categories);
  const submitted = JSON.parse(request.messages[1].content);
  assert.equal(submitted.context.promptDescription, context.promptDescription);
  assert.equal(submitted.context.examType, 'toefl');
  assert.equal(submitted.context.minWords, 150);
  assert.equal(submitted.context.maxWords, 250);
  assert.equal(submitted.studentText, text);
  assert.equal(submitted.wordCount, 6);
  assert.equal(feedback.examAssessment.examType, 'toefl');
  assert.deepEqual(feedback.examAssessment.missingPoints, ['Dezavantajlar açıklanmamış.']);
  assert.equal(feedback.errors[0].endIndex, 25, 'full sentence correction retains an accurate anchor');
});

test('zero scores remain zero and content affects overall practice score', () => {
  const payload = result();
  payload.criteria.forEach(item => { item.score = 0; });
  assert.equal(normalizeWritingFeedback(payload, text, context, categories).overallScore, 0);
  payload.criteria.slice(1).forEach(item => { item.score = 80; });
  const feedback = normalizeWritingFeedback(payload, text, context, categories);
  assert.equal(feedback.contentScore, 0);
  assert.equal(feedback.overallScore, 60);
});

test('title-only and free writing never get fabricated task relevance scores', () => {
  const payload = result();
  payload.criteria[0].score = 100;
  const feedback = normalizeWritingFeedback(payload, text, normalizeWritingContext({ promptTitle: 'Education' }), categories);
  assert.equal(feedback.contentScore, null);
  assert.equal(feedback.overallScore, 40);
  assert.equal(feedback.examAssessment.hasPrompt, false);
  assert.deepEqual(feedback.examAssessment.addressedPoints, []);
  assert.deepEqual(feedback.examAssessment.missingPoints, []);
  assert.match(feedback.examAssessment.criteria[0].feedback, /değerlendirilemedi/);
});

test('invalid, duplicate, missing or nonnumeric criteria fail instead of becoming grades', () => {
  for (const score of [undefined, null, '80', NaN, Infinity, -1, 101]) {
    const payload = result();
    payload.criteria[2].score = score;
    assert.throws(() => normalizeWritingFeedback(payload, text, context, categories), { status: 502 });
  }
  for (const change of [items => items.pop(), items => items.push(items[0])]) {
    const payload = result();
    change(payload.criteria);
    assert.throws(() => normalizeWritingFeedback(payload, text, context, categories), { status: 502 });
  }
});

test('errors highlight the requested occurrence and never fabricated student quotes', () => {
  const payload = result();
  payload.errors[0].startIndex = 26;
  payload.errors.push({ ...payload.errors[0], text: 'A sentence that the student never wrote.' });
  const feedback = normalizeWritingFeedback(payload, text, context, categories);
  assert.equal(feedback.errors.length, 1);
  assert.equal(feedback.errors[0].startIndex, 26);
  assert.equal(feedback.errors[0].endIndex, text.length);
});

test('mechanics-only corrections do not become writing analysis cards', () => {
  const payload = result();
  payload.errors.push({ ...payload.errors[0], issueType: 'mechanics', text: 'students.', suggestion: 'students' });
  const feedback = normalizeWritingFeedback(payload, text, context, categories);
  assert.equal(feedback.errors.length, 1);
  assert.equal(feedback.errors[0].category, 'subject_verb_agreement');
});

test('malformed, incomplete, refused and truncated model responses reject without fake feedback', async () => {
  for (const payload of ['invalid JSON', {}, { ...result(), modelAnswer: '' }, { ...result(), missingPoints: 'not an array' }]) {
    await assert.rejects(evaluateWriting(clientReturning(payload), text, context, categories), { status: 502 });
  }
  await assert.rejects(evaluateWriting(clientReturning(result(), 'length'), text, context, categories), { status: 502 });
  await assert.rejects(evaluateWriting(clientReturning(result(), 'content_filter'), text, context, categories), { status: 502 });
});

test('request validation rejects invalid drafts or context before contacting the model', async () => {
  const client = { chat: { completions: { create: () => assert.fail('must not call model') } } };
  for (const draft of ['', '   ', 22, null]) await assert.rejects(evaluateWriting(client, draft, context, categories), { status: 400 });
  for (const invalid of [null, [], { examType: 'unknown' }, { promptDescription: {} }, { minWords: -2 }, { minWords: 200, maxWords: 100 }]) {
    await assert.rejects(evaluateWriting(client, text, invalid, categories), { status: 400 });
  }
});

test('provider failures propagate so the draft can be retried', async () => {
  const client = { chat: { completions: { create: async () => { throw new Error('Service unavailable'); } } } };
  await assert.rejects(evaluateWriting(client, text, context, categories), /Service unavailable/);
});
