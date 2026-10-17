// Isolated UI fixture for the IELTS listening tests: in-memory progress, no Firebase.
// Open /tests/ielts-listening-qa.html during `npm run dev`. ?theme=dark switches theme, ?guest shows the logged-out state.
import React, { useCallback, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { IeltsListening } from '../src/components/IeltsListening';
import { ieltsListeningTests } from '../src/data/ieltsListeningTests';
import { ieltsListeningAudio } from '../src/data/ieltsListeningAudioManifest';
import type { IeltsListeningProgress } from '../src/types/ieltsListening';
import '../src/App.css';
import '../src/learning.css';

const query = new URLSearchParams(location.search);
document.documentElement.setAttribute('data-theme', query.get('theme') === 'dark' ? 'dark' : 'light');
const records = new Map<string, IeltsListeningProgress>();

function Fixture() {
  const [failSave, setFailSave] = useState(false);
  const loadProgress = useCallback(async (id: string) => {
    const saved = records.get(id);
    return saved ? structuredClone(saved) : null;
  }, []);
  return (
    <main className="learning-app learning-main">
      <label style={{ display: 'block', marginBottom: 12, fontSize: 13 }}>
        <input type="checkbox" checked={failSave} onChange={e => setFailSave(e.target.checked)} /> Simulate save failure
      </label>
      <IeltsListening
        tests={ieltsListeningTests}
        audio={ieltsListeningAudio}
        canSave={!query.has('guest')}
        draftKey="qa"
        loadProgress={loadProgress}
        saveProgress={async p => { if (failSave) throw new Error('Simulated save failure'); records.set(p.testId, structuredClone(p)); }}
        resetProgress={async id => { records.delete(id); }}
        onClose={() => {}}
      />
    </main>
  );
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><BrowserRouter><Fixture /></BrowserRouter></React.StrictMode>);
