// Isolated UI fixture: no Firebase requests and no changes to real user progress.
// Open /tests/reading-qa.html (or ?passage=ielts_1) while `npm run dev` is running.
import React, { useCallback, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ReadingComprehension } from '../src/components/ReadingComprehension';
import { sampleReadingPassages } from '../src/data/readingPassages';
import type { ReadingAnswer, ReadingProgress, ReadingStats } from '../src/types';
import '../src/App.css';
import '../src/learning.css';

const records = new Map<string, ReadingProgress>();
const emptyStats: ReadingStats = { totalPassagesCompleted: 0, totalQuestionsAnswered: 0, totalCorrect: 0, averageScore: 0, passagesByDifficulty: {}, questionTypePerformance: {} as ReadingStats['questionTypePerformance'] };

function Fixture() {
  const [completed, setCompleted] = useState<string[]>([]);
  const [dark, setDark] = useState(false);
  const getProgress = useCallback(async (id: string) => records.get(id) || null, []);
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  return <div className="learning-app"><main className="learning-main">
    <label style={{ display: 'block', marginBottom: 12 }}><input type="checkbox" checked={dark} onChange={e => setDark(e.target.checked)} /> Dark theme</label>
    <ReadingComprehension isOpen onClose={() => {}} passages={sampleReadingPassages} completedPassageIds={completed} stats={emptyStats} getProgress={getProgress}
      onAnswerQuestion={async (id, questionId, selectedAnswer, isCorrect) => {
        const progress = records.get(id) || { passageId: id, startedAt: new Date(), answers: new Map() };
        (progress.answers as Map<number, ReadingAnswer>).set(questionId, { questionId, selectedAnswer, isCorrect });
        records.set(id, progress);
      }}
      onCompletePassage={async (id, score) => {
        const progress = records.get(id);
        if (progress) { progress.completedAt = new Date(); progress.score = score; }
        setCompleted(previous => [...new Set([...previous, id])]);
      }}
      onResetProgress={async id => { records.delete(id); setCompleted(previous => previous.filter(p => p !== id)); }} />
  </main></div>;
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><BrowserRouter><Fixture /></BrowserRouter></React.StrictMode>);
