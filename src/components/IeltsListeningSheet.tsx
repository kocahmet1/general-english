import { Fragment, type ReactNode } from 'react';
import { Check, Lightbulb, Pause, Volume2, X } from 'lucide-react';
import type { IeltsBlock, IeltsGapFillGroup, IeltsListeningPart, IeltsListeningQuestion, IeltsQuestionGroup } from '../types/ieltsListening';
import { expectedLabel, givenLabel, groupRange, type IeltsMark } from '../services/ieltsListeningScoring';

interface SheetProps {
  part: IeltsListeningPart;
  responses: Record<number, string>;
  onChange: (number: number, value: string) => void;
  /** Answers can no longer be changed (part submitted). */
  locked: boolean;
  /** Marks, keys and explanations are visible. */
  showFeedback: boolean;
  marks: Map<number, IeltsMark>;
  showTips: boolean;
  /** Plays the recording where an answer is heard; omitted when listening again is not allowed. */
  onPlayEvidence?: (lineId: string, label: string) => void;
  playingExcerpt: string | null;
  figureBase: string;
}

const ISSUE_TEXT: Record<string, string> = {
  empty: 'Boş bıraktınız. Emin olmasanız da bir tahmin yazın: yanlış cevap puan götürmez.',
  word_limit: 'Kelime sınırını aştınız. Sınırı aşan cevap, doğru kelimeleri içerse bile yanlış sayılır.',
  plural: 'Kelime doğru ama tekil/çoğul biçimi yanlış. IELTS’te bu da yanlış sayılır; boşluğa uyan biçimi yazın.',
  spelling: 'Çok yaklaştınız ama yazım hatası var. IELTS’te yanlış yazılan kelime yanlış sayılır.',
};

/** Rubric with the capitalised parts (ONE WORD ONLY, TWO, A–H…) in bold, as on the exam paper. */
function Rubric({ text }: { text: string }) {
  return (
    <div className="il-rubric" lang="en">
      {text.split('\n').map((line, i) => (
        <p key={i}>
          {line.split(/(\b[A-Z]{2,}[A-Z/]*(?:\s+(?:A\s+)?[A-Z]{2,}[A-Z/]*)*\b|[A-Z]–[A-Z]\b)/g).map((piece, j) =>
            j % 2 === 1 ? <strong key={j}>{piece}</strong> : <Fragment key={j}>{piece}</Fragment>,
          )}
        </p>
      ))}
    </div>
  );
}

export function IeltsListeningSheet(props: SheetProps) {
  const { part } = props;
  return (
    <div className="il-sheet" lang="en">
      {part.questionGroups.map(group => (
        <QuestionGroup key={group.id} group={group} {...props} />
      ))}
    </div>
  );
}

function QuestionGroup({ group, ...p }: SheetProps & { group: IeltsQuestionGroup }) {
  const [first, last] = groupRange(group);
  return (
    <section className="il-group" aria-labelledby={`${group.id}-range`}>
      <header className="il-group-head">
        <h4 id={`${group.id}-range`} className="il-group-range">Questions {first}–{last}</h4>
        <Rubric text={group.instructions} />
        {p.showTips && group.tip && (
          <div className="il-tip" lang="tr"><Lightbulb size={16} aria-hidden="true" /><p><span className="il-tip-label">İpucu:</span> {group.tip}</p></div>
        )}
      </header>
      {group.type === 'gap_fill' && <GapFill group={group} {...p} />}
      {group.type === 'mcq_single' && group.questions.map(q => <SingleChoice key={q.number} group={group} question={q} {...p} />)}
      {group.type === 'mcq_multi' && <MultiChoice group={group} {...p} />}
      {group.type === 'matching' && <Matching group={group} {...p} />}
      {p.showFeedback && <Review group={group} {...p} />}
    </section>
  );
}

/* ───────────── gap fill ───────────── */

function GapFill({ group, ...p }: SheetProps & { group: IeltsGapFillGroup }) {
  const withGaps = (text: string): ReactNode =>
    text.split(/\{\{(\d+)\}\}/g).map((piece, i) =>
      i % 2 === 1 ? <Gap key={i} number={Number(piece)} group={group} {...p} /> : <Fragment key={i}>{piece}</Fragment>,
    );

  return (
    <div className={`il-paper il-${group.layout}`}>
      {group.boxOptions && (
        <div className="il-optbox" aria-label="Seçenekler">
          {group.boxOptions.map(o => <span key={o.key}><b>{o.key}</b> {o.text}</span>)}
        </div>
      )}
      {group.title && <h5 className="il-paper-title">{group.title}</h5>}
      {group.layout === 'form' && (
        <dl className="il-form-rows">
          {group.blocks?.map((b, i) => b.kind === 'field' && (
            <div key={i} className={b.example ? 'is-example' : undefined}>
              <dt>{b.example && <span className="il-example-tag">Example</span>}{b.label}</dt>
              <dd>{b.example ? <span className="il-example-answer">{b.value}</span> : withGaps(b.value)}</dd>
            </div>
          ))}
        </dl>
      )}
      {(group.layout === 'notes' || group.layout === 'sentences') && <NotesBlocks blocks={group.blocks ?? []} render={withGaps} />}
      {group.layout === 'flowchart' && (
        <ol className="il-flow">
          {group.blocks?.map((b, i) => 'text' in b && <li key={i}>{withGaps(b.text)}</li>)}
        </ol>
      )}
      {group.layout === 'table' && group.table && (
        <div className="il-table-wrap">
          <table className="il-table">
            <thead><tr>{group.table.columns.map(c => <th key={c} scope="col">{c}</th>)}</tr></thead>
            <tbody>{group.table.rows.map((row, r) => <tr key={r}>{row.map((cell, c) => <td key={c}>{withGaps(cell)}</td>)}</tr>)}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function NotesBlocks({ blocks, render }: { blocks: IeltsBlock[]; render: (text: string) => ReactNode }) {
  // Consecutive bullets become one list.
  const out: ReactNode[] = [];
  let bullets: ReactNode[] = [];
  const flush = () => {
    if (bullets.length) out.push(<ul key={`ul-${out.length}`}>{bullets}</ul>);
    bullets = [];
  };
  blocks.forEach((b, i) => {
    if (b.kind === 'bullet') bullets.push(<li key={i} className={b.level ? 'is-sub' : undefined}>{render(b.text)}</li>);
    else {
      flush();
      if (b.kind === 'heading') out.push(<h6 key={i}>{b.text}</h6>);
      else if (b.kind === 'example') out.push(<p key={i} className="il-example-line"><span className="il-example-tag">Example</span>{b.text.replace(/^Example:\s*/, '')}</p>);
      else if ('text' in b) out.push(<p key={i}>{render(b.text)}</p>);
    }
  });
  flush();
  return <>{out}</>;
}

function Gap({ number, group, responses, onChange, locked, showFeedback, marks }: SheetProps & { number: number; group: IeltsGapFillGroup }) {
  const mark = marks.get(number);
  const value = responses[number] ?? '';
  const state = showFeedback && mark ? (mark.isCorrect ? 'is-correct' : 'is-wrong') : '';
  const question = group.questions.find(q => q.number === number);
  return (
    <span className={`il-gap ${state}`}>
      <span className="il-gap-num" aria-hidden="true">{number}</span>
      {group.boxOptions ? (
        <select aria-label={`Soru ${number}`} value={value} disabled={locked} onChange={e => onChange(number, e.target.value)}>
          <option value="">–</option>
          {group.boxOptions.map(o => <option key={o.key} value={o.key}>{o.key}</option>)}
        </select>
      ) : (
        <input
          type="text"
          aria-label={`Soru ${number}`}
          value={value}
          disabled={locked}
          onChange={e => onChange(number, e.target.value)}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          maxLength={40}
        />
      )}
      {showFeedback && mark && (mark.isCorrect ? <Check size={15} className="il-gap-icon" aria-label="doğru" /> : <X size={15} className="il-gap-icon" aria-label="yanlış" />)}
      {showFeedback && mark && !mark.isCorrect && question && <span className="il-gap-key">{expectedLabel(group, question)}</span>}
    </span>
  );
}

/* ───────────── choices ───────────── */

function choiceState(showFeedback: boolean, selected: boolean, correct: boolean) {
  if (!showFeedback) return selected ? 'is-selected' : '';
  if (correct) return selected ? 'is-correct is-selected' : 'is-correct';
  return selected ? 'is-wrong is-selected' : '';
}

function SingleChoice({ group, question, responses, onChange, locked, showFeedback }: SheetProps & { group: IeltsQuestionGroup; question: IeltsListeningQuestion }) {
  const value = responses[question.number] ?? '';
  const key = question.answer?.kind === 'choice' ? question.answer.key : '';
  return (
    <div className="il-mcq" data-group={group.id}>
      <p className="il-q" id={`q${question.number}-prompt`}><span className="il-qnum">{question.number}</span>{question.prompt}</p>
      <div className="il-choices" role="radiogroup" aria-labelledby={`q${question.number}-prompt`}>
        {question.options?.map(o => (
          <button
            key={o.key}
            type="button"
            role="radio"
            aria-checked={value === o.key}
            disabled={locked}
            className={`il-choice ${choiceState(showFeedback, value === o.key, o.key === key)}`}
            onClick={() => onChange(question.number, value === o.key ? '' : o.key)}
          >
            <span className="il-letter">{o.key}</span><span>{o.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function MultiChoice({ group, responses, onChange, locked, showFeedback }: SheetProps & { group: Extract<IeltsQuestionGroup, { type: 'mcq_multi' }> }) {
  const numbers = group.questions.map(q => q.number);
  const selected = numbers.map(n => responses[n]).filter(Boolean);
  const toggle = (letter: string) => {
    const next = selected.includes(letter) ? selected.filter(l => l !== letter) : selected.length < numbers.length ? [...selected, letter] : selected;
    numbers.forEach((n, i) => onChange(n, next[i] ?? ''));
  };
  return (
    <div className="il-mcq">
      <p className="il-q" id={`${group.id}-prompt`}><span className="il-qnum">{numbers[0]}–{numbers[numbers.length - 1]}</span>{group.prompt}</p>
      <div className="il-choices" role="group" aria-labelledby={`${group.id}-prompt`}>
        {group.options.map(o => (
          <button
            key={o.key}
            type="button"
            aria-pressed={selected.includes(o.key)}
            disabled={locked || (!selected.includes(o.key) && selected.length >= numbers.length)}
            className={`il-choice is-check ${choiceState(showFeedback, selected.includes(o.key), group.answerKeys.includes(o.key))}`}
            onClick={() => toggle(o.key)}
          >
            <span className="il-letter">{o.key}</span><span>{o.text}</span>
          </button>
        ))}
      </div>
      {!locked && <p className="il-multi-count" lang="tr">{selected.length} / {numbers.length} seçildi</p>}
    </div>
  );
}

function Matching({ group, responses, onChange, locked, showFeedback, figureBase }: SheetProps & { group: Extract<IeltsQuestionGroup, { type: 'matching' }> }) {
  return (
    <div className="il-paper il-matching">
      {group.title && <h5 className="il-paper-title">{group.title}</h5>}
      {group.figure && (
        <figure className="il-figure">
          <img src={`${figureBase}${group.figure.src}`} alt={group.figure.alt} width={group.figure.width} height={group.figure.height} />
        </figure>
      )}
      {group.variant === 'list' && (
        <div className="il-optbox is-list">
          {group.optionsTitle && <p className="il-optbox-title">{group.optionsTitle}</p>}
          {group.options.map(o => <span key={o.key}><b>{o.key}</b> {o.text}</span>)}
        </div>
      )}
      <div className="il-match-rows">
        {group.questions.map(q => {
          const value = responses[q.number] ?? '';
          const key = q.answer?.kind === 'choice' ? q.answer.key : '';
          return (
            <div key={q.number} className="il-match-row">
              <span className="il-qnum">{q.number}</span>
              <span className="il-match-prompt" id={`q${q.number}-prompt`}>{q.prompt}</span>
              <div className="il-letters" role="radiogroup" aria-labelledby={`q${q.number}-prompt`}>
                {group.options.map(o => (
                  <button
                    key={o.key}
                    type="button"
                    role="radio"
                    aria-checked={value === o.key}
                    aria-label={`${q.prompt}: ${o.key}${group.variant === 'list' ? ` (${o.text})` : ''}`}
                    disabled={locked}
                    className={`il-letter-btn ${choiceState(showFeedback, value === o.key, o.key === key)}`}
                    onClick={() => onChange(q.number, value === o.key ? '' : o.key)}
                  >
                    {o.key}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ───────────── review after marking ───────────── */

function ListenButton({ lines, label, onPlayEvidence, playingExcerpt }: { lines: string[]; label: string; onPlayEvidence?: SheetProps['onPlayEvidence']; playingExcerpt: string | null }) {
  if (!onPlayEvidence || !lines.length) return null;
  const unique = [...new Set(lines)];
  return (
    <span className="il-listen-group" lang="tr">
      {unique.map((line, i) => {
        const id = `${label}-${i}`;
        const playing = playingExcerpt === id;
        return (
          <button key={line} type="button" className={`il-listen ${playing ? 'is-playing' : ''}`} onClick={() => onPlayEvidence(line, id)}>
            {playing ? <Pause size={14} /> : <Volume2 size={14} />}
            {playing ? 'Çalıyor…' : unique.length > 1 ? `Dinle ${i + 1}` : 'Cevabı dinle'}
          </button>
        );
      })}
    </span>
  );
}

function Review({ group, responses, marks, onPlayEvidence, playingExcerpt }: SheetProps & { group: IeltsQuestionGroup }) {
  if (group.type === 'mcq_multi') {
    const groupMarks = group.questions.map(q => marks.get(q.number));
    const correct = groupMarks.filter(m => m?.isCorrect).length;
    const given = group.questions.map(q => responses[q.number]).filter(Boolean).join(', ') || '—';
    return (
      <ul className="il-review" lang="tr">
        <li className={correct === group.questions.length ? 'is-correct' : 'is-wrong'}>
          <div className="il-review-head">
            <span className="il-qnum">{group.questions[0].number}–{group.questions[group.questions.length - 1].number}</span>
            <span className="il-review-score">{correct}/{group.questions.length}</span>
            <span className="il-review-key" lang="en">{group.answerKeys.join(', ')}</span>
            {correct < group.questions.length && <span className="il-review-given">Cevabınız: <span lang="en">{given}</span></span>}
            <ListenButton lines={group.evidence.map(e => e.line)} label={`q${group.questions[0].number}`} onPlayEvidence={onPlayEvidence} playingExcerpt={playingExcerpt} />
          </div>
          <p className="il-explain">{group.explanation}</p>
        </li>
      </ul>
    );
  }
  return (
    <ul className="il-review" lang="tr">
      {group.questions.map(q => {
        const mark = marks.get(q.number);
        const ok = Boolean(mark?.isCorrect);
        return (
          <li key={q.number} className={ok ? 'is-correct' : 'is-wrong'}>
            <div className="il-review-head">
              <span className="il-qnum">{q.number}</span>
              {ok ? <Check size={16} className="il-review-icon" aria-label="doğru" /> : <X size={16} className="il-review-icon" aria-label="yanlış" />}
              <span className="il-review-key" lang="en">{expectedLabel(group, q)}</span>
              {!ok && <span className="il-review-given">Cevabınız: <span lang="en">{givenLabel(group, q, responses[q.number])}</span></span>}
              <ListenButton lines={(q.evidence ?? []).map(e => e.line)} label={`q${q.number}`} onPlayEvidence={onPlayEvidence} playingExcerpt={playingExcerpt} />
            </div>
            {!ok && mark?.issue && <p className="il-issue">{ISSUE_TEXT[mark.issue]}</p>}
            {q.explanation && <p className="il-explain">{q.explanation}</p>}
          </li>
        );
      })}
    </ul>
  );
}
