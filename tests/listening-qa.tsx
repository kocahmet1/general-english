// Isolated UI fixture: no Firebase requests and no changes to real user progress.
import React, { useCallback, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ListeningPractice } from '../src/components/ListeningPractice';
import { listeningTests } from '../src/data/listeningQuestions';
import type { ListeningAnswer, ListeningProgress, ListeningQuestionType, ListeningStats } from '../src/types';
import '../src/App.css';
import '../src/learning.css';

const records = new Map<string, ListeningProgress>();
const completions = new Set<string>();
const emptyStats: ListeningStats = { totalTestsCompleted: 0, totalQuestionsAnswered: 0, totalCorrect: 0, averageScore: 0, testsBySection: { conversation: 0, lecture: 0 }, testsByDifficulty: {}, questionTypePerformance: {} as ListeningStats['questionTypePerformance'] };
function Fixture() {
  const [stats, setStats] = useState(emptyStats);
  const [failSave, setFailSave] = useState(false);
  const getProgress = useCallback(async (id: string) => records.get(id) || null, []);
  return <><label><input type="checkbox" checked={failSave} onChange={e => setFailSave(e.target.checked)} />Simulate save failure</label>
    <ListeningPractice isOpen onClose={() => {}} tests={listeningTests} stats={stats} completedTestIds={[...completions]} getProgress={getProgress}
      onAnswerQuestion={async (id, questionId, selectedAnswer, isCorrect) => {
        if (failSave) throw new Error('Simulated save failure');
        const progress = records.get(id) || { testId: id, startedAt: new Date(), answers: new Map(), audioPlayCount: 0 };
        (progress.answers as Map<number, ListeningAnswer>).set(questionId, { questionId, selectedAnswer, isCorrect });
        records.set(id, progress);
      }}
      onCompleteTest={async (id, score, section, difficulty, questionTypeResults, audioPlayCount) => {
        if (failSave) throw new Error('Simulated completion failure');
        if (completions.has(id)) return;
        completions.add(id);
        const progress = records.get(id)!;
        progress.completedAt = new Date(); progress.score = score; progress.audioPlayCount = audioPlayCount;
        setStats(previous => {
          const next = structuredClone(previous);
          next.totalTestsCompleted++;
          next.testsBySection[section]++;
          next.testsByDifficulty[difficulty] = (next.testsByDifficulty[difficulty] || 0) + 1;
          for (const [type, result] of Object.entries(questionTypeResults)) {
            next.totalQuestionsAnswered += result.total; next.totalCorrect += result.correct;
            next.questionTypePerformance[type as ListeningQuestionType] = result;
          }
          next.averageScore = score;
          return next;
        });
      }}
      onResetProgress={async id => { records.delete(id); completions.delete(id); }} />
  </>;
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><BrowserRouter><Fixture /></BrowserRouter></React.StrictMode>);
