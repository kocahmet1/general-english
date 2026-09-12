import { useEffect, useId, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { GripVertical, Keyboard, MousePointer2 } from 'lucide-react';
import '../sentence-word-board.css';

interface Word { id: number; text: string }
interface SentenceWordBoardProps {
  words: Word[];
  answer: string[];
  usedWordIds: number[];
  disabled: boolean;
  placeholder: string;
  onInsert: (wordId: number, position: number) => void;
  onMove: (from: number, to: number) => void;
  onRemove: (position: number) => void;
  textValue?: string;
  onTextChange?: (text: string) => void;
}
type DropTarget = { zone: 'answer' | 'bank'; position: number };
type Drag = { source: 'answer' | 'bank'; index: number; text: string; pointerId: number; startX: number; startY: number; x: number; y: number; active: boolean };

/** Pointer capture gives mouse, pen, and touch the same insertion/reordering flow.
 * The controlled answer is changed only after a valid drop, never during hover. */
export function SentenceWordBoard({ words, answer, usedWordIds, disabled, placeholder, onInsert, onMove, onRemove, textValue, onTextChange }: SentenceWordBoardProps) {
  const root = useRef<HTMLDivElement>(null);
  const textarea = useRef<HTMLTextAreaElement>(null);
  const dragRef = useRef<Drag | null>(null);
  const suppressClick = useRef(false);
  const [drag, setDrag] = useState<Drag | null>(null);
  const [target, setTarget] = useState<DropTarget | null>(null);
  const [typing, setTyping] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const instructionId = useId();
  const keyboardId = useId();

  const locateTarget = (x: number, y: number): DropTarget | null => {
    const hit = document.elementFromPoint(x, y)?.closest<HTMLElement>('[data-word-zone]');
    if (!hit || !root.current?.contains(hit)) return null;
    if (hit.dataset.wordZone === 'bank') return { zone: 'bank', position: 0 };
    const tiles = Array.from(hit.querySelectorAll<HTMLElement>('[data-answer-position]'));
    if (!tiles.length) return { zone: 'answer', position: answer.length };
    const bounds = tiles.map(tile => tile.getBoundingClientRect());
    // Pick the closest visual row first, then the insertion point in that row.
    const nearest = bounds.reduce((best, box, index) => {
      const distance = Math.abs(y - (box.top + box.height / 2));
      return distance < best.distance ? { index, distance } : best;
    }, { index: 0, distance: Infinity });
    const row = bounds.map((box, index) => ({ box, index })).filter(({ box }) => Math.abs(box.top - bounds[nearest.index].top) < 5);
    if (y > bounds[bounds.length - 1].bottom + 8) return { zone: 'answer', position: answer.length };
    if (y < bounds[0].top - 8) return { zone: 'answer', position: 0 };
    const next = row.find(({ box }) => x < box.left + box.width / 2);
    return { zone: 'answer', position: next ? next.index : row[row.length - 1].index + 1 };
  };

  const updateTarget = (next: DropTarget | null) => setTarget(previous => (
    previous?.zone === next?.zone && previous?.position === next?.position ? previous : next
  ));
  const cancelDrag = () => {
    if (dragRef.current?.active) suppressClick.current = true;
    dragRef.current = null;
    setDrag(null);
    setTarget(null);
  };

  useEffect(() => {
    if (disabled) cancelDrag();
  }, [disabled]);

  useEffect(() => {
    if (!drag?.active) return;
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        cancelDrag();
        setAnnouncement('Drag cancelled.');
      }
    };
    let frame = 0;
    const scroll = () => {
      const current = dragRef.current;
      if (!current?.active) return;
      const distance = current.y < 90 ? current.y - 90 : current.y > innerHeight - 70 ? current.y - (innerHeight - 70) : 0;
      if (distance) {
        window.scrollBy({ top: Math.max(-12, Math.min(12, distance / 5)), behavior: 'instant' });
        updateTarget(locateTarget(current.x, current.y));
      }
      frame = requestAnimationFrame(scroll);
    };
    frame = requestAnimationFrame(scroll);
    document.addEventListener('keydown', onEscape);
    return () => { cancelAnimationFrame(frame); document.removeEventListener('keydown', onEscape); };
  }, [drag?.active]);

  const startDrag = (event: ReactPointerEvent<HTMLButtonElement>, source: Drag['source'], index: number, text: string) => {
    if (disabled || event.button !== 0 || !event.isPrimary) return;
    suppressClick.current = false;
    dragRef.current = { source, index, text, pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, x: event.clientX, y: event.clientY, active: false };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const moveDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const current = dragRef.current;
    if (!current || current.pointerId !== event.pointerId || disabled) return;
    const active = current.active || Math.hypot(event.clientX - current.startX, event.clientY - current.startY) > 7;
    const next = { ...current, active, x: event.clientX, y: event.clientY };
    dragRef.current = next;
    if (!active) return;
    event.preventDefault();
    setDrag(next);
    updateTarget(locateTarget(next.x, next.y));
  };

  const insertWord = (id: number, position: number) => {
    const word = words.find(item => item.id === id);
    if (!word || disabled || usedWordIds.includes(id)) return;
    if (typing && onTextChange && textarea.current) {
      const field = textarea.current;
      const before = (textValue || '').slice(0, field.selectionStart);
      const after = (textValue || '').slice(field.selectionEnd);
      const insertion = `${before && !/\s$/.test(before) ? ' ' : ''}${word.text}${after && !/^\s/.test(after) ? ' ' : ''}`;
      onTextChange(before + insertion + after);
      const caret = before.length + insertion.length;
      requestAnimationFrame(() => {
        field.focus({ preventScroll: true });
        field.setSelectionRange(caret, caret);
      });
    } else {
      onInsert(id, position);
    }
    setAnnouncement(`${word.text} added to the sentence.`);
  };

  const finishDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const current = dragRef.current;
    if (!current || current.pointerId !== event.pointerId) return;
    if (current.active && !disabled) {
      const drop = locateTarget(event.clientX, event.clientY);
      if (drop?.zone === 'answer') {
        if (current.source === 'bank') insertWord(current.index, drop.position);
        else {
          const position = drop.position - (current.index < drop.position ? 1 : 0);
          onMove(current.index, position);
          setAnnouncement(`${current.text} moved to position ${position + 1}.`);
        }
      } else if (drop?.zone === 'bank' && current.source === 'answer') {
        onRemove(current.index);
        setAnnouncement(`${current.text} removed from the sentence.`);
      }
    }
    cancelDrag();
  };

  const clickTile = (action: () => void) => {
    if (suppressClick.current) { suppressClick.current = false; return; }
    if (!disabled) action();
  };

  return (
    <div className={`sentence-word-board ${drag?.active ? 'is-dragging' : ''}`} ref={root}
      onPointerMove={moveDrag} onPointerUp={finishDrag} onPointerCancel={cancelDrag} onLostPointerCapture={cancelDrag}
      onKeyDownCapture={event => {
        // A drop can disable the source before its synthetic click arrives.
        // Keyboard activation must still work immediately after that drop.
        if (event.key === 'Enter' || event.key === ' ') suppressClick.current = false;
      }}>
      <div className="word-board-toolbar">
        <p id={instructionId}>Drag words into the sentence. Tap to add or remove.</p>
        {onTextChange && <button type="button" className="word-board-mode" disabled={disabled} onClick={() => {
          setTyping(!typing);
          if (!typing) requestAnimationFrame(() => {
            textarea.current?.focus({ preventScroll: true });
            textarea.current?.setSelectionRange(textValue?.length || 0, textValue?.length || 0);
          });
        }}>
          {typing ? <MousePointer2 size={15} /> : <Keyboard size={15} />}
          {typing ? 'Use word tiles' : 'Type instead'}
        </button>}
      </div>
      <p id={keyboardId} className="word-board-sr">Drag to reorder, or focus a word and use Alt + Left or Right arrow. Press Enter to remove a word.</p>
      <div className={`word-board-answer ${target?.zone === 'answer' ? 'is-drop-target' : ''}`} data-word-zone="answer" role="group" aria-label="Your sentence" aria-describedby={instructionId}>
        {typing ? <textarea ref={textarea} className="sentence-lab-textarea" value={textValue} onChange={event => onTextChange?.(event.target.value)} placeholder={placeholder} aria-label="Write the English sentence here." disabled={disabled} /> : (
          <div className="word-board-answer-tiles">
            {answer.map((word, index) => <button key={index} type="button"
              className={`word-board-tile answer-tile ${drag?.source === 'answer' && drag.index === index ? 'is-drag-source' : ''} ${target?.zone === 'answer' && target.position === index ? 'insert-before' : ''}`}
              data-answer-position={index} disabled={disabled} aria-describedby={keyboardId} aria-keyshortcuts="Alt+ArrowLeft Alt+ArrowRight"
              onPointerDown={event => startDrag(event, 'answer', index, word)}
              onClick={() => clickTile(() => { onRemove(index); setAnnouncement(`${word} removed from the sentence.`); })}
              onKeyDown={event => {
                if (!event.altKey || !['ArrowLeft', 'ArrowRight'].includes(event.key) || disabled) return;
                event.preventDefault();
                const position = index + (event.key === 'ArrowLeft' ? -1 : 1);
                if (position < 0 || position >= answer.length) return;
                onMove(index, position);
                setAnnouncement(`${word} moved to position ${position + 1}.`);
                requestAnimationFrame(() => root.current?.querySelector<HTMLButtonElement>(`[data-answer-position="${position}"]`)?.focus());
              }}>
              <GripVertical size={14} aria-hidden="true" /><span>{word}</span>
            </button>)}
            {answer.length === 0 && <p className="sentence-lab-placeholder">{placeholder}</p>}
            {target?.zone === 'answer' && target.position === answer.length && answer.length > 0 && <span className="word-board-insert-end" aria-hidden="true" />}
          </div>
        )}
      </div>
      <div className={`word-board-bank ${target?.zone === 'bank' && drag?.source === 'answer' ? 'is-drop-target' : ''}`} data-word-zone="bank" role="group" aria-label="Word bank">
        {words.map(word => <button key={word.id} type="button"
          className={`word-board-tile bank-tile ${usedWordIds.includes(word.id) ? 'is-used' : ''} ${drag?.source === 'bank' && drag.index === word.id ? 'is-drag-source' : ''}`}
          disabled={disabled || usedWordIds.includes(word.id)} aria-describedby={instructionId}
          onPointerDown={event => startDrag(event, 'bank', word.id, word.text)} onClick={() => clickTile(() => insertWord(word.id, answer.length))}>
          <GripVertical size={14} aria-hidden="true" /><span>{word.text}</span>
        </button>)}
      </div>
      <div className="word-board-sr" role="status" aria-live="polite" aria-atomic="true">{announcement}</div>
      {drag?.active && <div className="word-board-drag-preview" aria-hidden="true" style={{
        ...(drag.x > innerWidth / 2 ? { right: Math.max(8, innerWidth - drag.x + 14) } : { left: Math.max(8, drag.x + 14) }),
        top: Math.max(8, Math.min(drag.y - 22, innerHeight - 100)),
        maxWidth: Math.min(250, innerWidth / 2 - 24),
      }}><GripVertical size={15} />{drag.text}</div>}
    </div>
  );
}
