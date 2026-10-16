import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  AlertTriangle, BookOpen, Check, ChevronDown, ChevronRight, Clock, FileText, Headphones,
  Languages, Loader2, Mic, PenLine, RefreshCw, Search, Target, Users, X, CalendarDays, Activity,
} from 'lucide-react';
import '../admin-student-report.css';
import { getStudentReport, listStudents, type AdminStudent, type StudentReport } from '../services/adminReportService';
import {
  ACTIVITY_TYPE_LABELS, ACTIVITY_TYPE_ORDER, type ActivityRecord, type ActivityType,
} from '../types/activity';
import { IDLE_CAP_MS } from '../services/activityTimer';

// ───────────────────────── helpers ─────────────────────────

type RangeKey = 'today' | 'yesterday' | '7d' | '30d' | 'custom';

const RANGE_OPTIONS: { key: RangeKey; label: string }[] = [
  { key: 'today', label: 'Bugün' },
  { key: 'yesterday', label: 'Dün' },
  { key: '7d', label: 'Son 7 gün' },
  { key: '30d', label: 'Son 30 gün' },
  { key: 'custom', label: 'Tarih seç' },
];

const TYPE_ICONS: Record<ActivityType, React.ReactNode> = {
  exam: <Target size={15} />,
  grammar: <BookOpen size={15} />,
  reading: <FileText size={15} />,
  listening: <Headphones size={15} />,
  writing: <PenLine size={15} />,
  speaking: <Mic size={15} />,
  sentenceLab: <Languages size={15} />,
};

const DAY_MS = 24 * 60 * 60 * 1000;
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const endOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const isoDay = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const parseIsoDay = (value: string | null): Date | null => {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [y, m, d] = value.split('-').map(Number);
  return new Date(y, m - 1, d);
};

function computeRange(key: RangeKey, fromParam: string | null, toParam: string | null): { from: Date; to: Date } {
  const now = new Date();
  switch (key) {
    case 'today': return { from: startOfDay(now), to: endOfDay(now) };
    case 'yesterday': return { from: startOfDay(addDays(now, -1)), to: endOfDay(addDays(now, -1)) };
    case '30d': return { from: startOfDay(addDays(now, -29)), to: endOfDay(now) };
    case 'custom': {
      const from = parseIsoDay(fromParam) || startOfDay(addDays(now, -6));
      const to = parseIsoDay(toParam) || now;
      return from <= to
        ? { from: startOfDay(from), to: endOfDay(to) }
        : { from: startOfDay(to), to: endOfDay(from) };
    }
    case '7d':
    default: return { from: startOfDay(addDays(now, -6)), to: endOfDay(now) };
  }
}

export function formatDuration(seconds: number | undefined): string {
  if (seconds == null) return '—';
  if (seconds < 60) return `${seconds} sn`;
  const totalMinutes = Math.floor(seconds / 60);
  if (totalMinutes < 60) {
    const rest = seconds % 60;
    return totalMinutes < 10 && rest > 0 ? `${totalMinutes} dk ${rest} sn` : `${totalMinutes} dk`;
  }
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return minutes > 0 ? `${hours} sa ${minutes} dk` : `${hours} sa`;
}

const formatTime = (d: Date) => d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
const formatDayHeading = (d: Date) => d.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
const formatShortDay = (d: Date) => d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', weekday: 'short' });

function formatLastSeen(date: Date | undefined): string {
  if (!date) return 'Son giriş bilinmiyor';
  const days = Math.round((startOfDay(new Date()).getTime() - startOfDay(date).getTime()) / DAY_MS);
  if (days <= 0) return `Bugün ${formatTime(date)}`;
  if (days === 1) return 'Dün';
  if (days < 30) return `${days} gün önce`;
  return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' });
}

const scoreTone = (value: number | undefined) =>
  value == null ? '' : value >= 80 ? 'sr-tone--good' : value >= 60 ? 'sr-tone--mid' : 'sr-tone--low';

const STALE_MS = 30 * 60 * 1000;

function statusOf(record: ActivityRecord): { label: string; className: string } {
  if (record.legacy && record.type === 'exam') return { label: 'Eski kayıt', className: 'sr-status--legacy' };
  if (record.status === 'completed') return { label: 'Tamamlandı', className: 'sr-status--done' };
  if (Date.now() - record.endedAt.getTime() < STALE_MS) return { label: 'Devam ediyor', className: 'sr-status--live' };
  return { label: 'Yarım bırakıldı', className: 'sr-status--partial' };
}

const LONG_DETAIL_LABELS = new Set(['Soru', 'Transkript', 'Not']);

// ───────────────────────── summaries ─────────────────────────

interface TypeSummary {
  type: ActivityType;
  count: number;
  completed: number;
  answered: number;
  correct: number;
  seconds: number;
  scoreSum: number;
  scoreCount: number;
  bandSum: number;
  bandCount: number;
}

function summarize(records: ActivityRecord[]) {
  const byType = new Map<ActivityType, TypeSummary>();
  let seconds = 0;
  let answered = 0;
  let correct = 0;
  let untimed = 0;
  const days = new Set<string>();

  records.forEach(r => {
    const t = byType.get(r.type) || {
      type: r.type, count: 0, completed: 0, answered: 0, correct: 0, seconds: 0,
      scoreSum: 0, scoreCount: 0, bandSum: 0, bandCount: 0,
    };
    t.count += 1;
    if (r.status === 'completed') t.completed += 1;
    if (r.answeredCount != null && r.correctCount != null) {
      t.answered += r.answeredCount;
      t.correct += r.correctCount;
      answered += r.answeredCount;
      correct += r.correctCount;
    }
    if (r.durationSeconds != null) {
      t.seconds += r.durationSeconds;
      seconds += r.durationSeconds;
    } else {
      untimed += 1;
    }
    if (r.type === 'writing' && r.scorePercent != null) { t.scoreSum += r.scorePercent; t.scoreCount += 1; }
    if (r.bandScore != null && r.bandScore > 0) { t.bandSum += r.bandScore; t.bandCount += 1; }
    byType.set(r.type, t);
    days.add(isoDay(r.endedAt));
  });

  const types = ACTIVITY_TYPE_ORDER.map(type => byType.get(type)).filter((t): t is TypeSummary => !!t);
  return { types, seconds, answered, correct, untimed, activeDays: days.size };
}

function typeScore(t: TypeSummary): { text: string; value?: number } {
  if (t.type === 'writing') {
    if (!t.scoreCount) return { text: '—' };
    const avg = Math.round(t.scoreSum / t.scoreCount);
    return { text: `${avg}/100 ort.`, value: avg };
  }
  if (t.type === 'speaking') {
    return t.bandCount ? { text: `Band ${(t.bandSum / t.bandCount).toFixed(1)} ort.` } : { text: '—' };
  }
  if (!t.answered) return { text: '—' };
  const value = Math.round((t.correct / t.answered) * 100);
  return { text: `%${value}`, value };
}

// ───────────────────────── sub-components ─────────────────────────

const Kpi: React.FC<{ icon: React.ReactNode; label: string; value: string; sub?: string }> = ({ icon, label, value, sub }) => (
  <div className="sr-kpi">
    <div className="sr-kpi__label">{icon}{label}</div>
    <div className="sr-kpi__value">{value}</div>
    {sub && <div className="sr-kpi__sub">{sub}</div>}
  </div>
);

const DailyChart: React.FC<{ from: Date; to: Date; records: ActivityRecord[] }> = ({ from, to, records }) => {
  const [hover, setHover] = useState<number | null>(null);
  const days = useMemo(() => {
    const list: { date: Date; seconds: number; count: number }[] = [];
    for (let d = startOfDay(from); d <= to; d = addDays(d, 1)) list.push({ date: d, seconds: 0, count: 0 });
    const index = new Map(list.map((item, i) => [isoDay(item.date), i]));
    records.forEach(r => {
      const i = index.get(isoDay(r.endedAt));
      if (i == null) return;
      list[i].count += 1;
      list[i].seconds += r.durationSeconds ?? 0;
    });
    return list;
  }, [from, to, records]);

  const maxMinutes = Math.max(...days.map(d => d.seconds / 60), 0);
  // Round the scale up to a friendly number so the top gridline reads cleanly.
  const scaleMax = maxMinutes <= 0 ? 10 : [10, 15, 20, 30, 45, 60, 90, 120, 180, 240, 360, 480].find(v => v >= maxMinutes) ?? Math.ceil(maxMinutes / 60) * 60;
  const labelEvery = days.length <= 14 ? 1 : days.length <= 31 ? 5 : 10;
  const hovered = hover != null ? days[hover] : null;

  return (
    <div className="sr-card sr-chart">
      <div className="sr-card__head">
        <h3>Günlük çalışma süresi</h3>
        <span className="sr-muted">dakika</span>
      </div>
      <div className="sr-chart__plot" onMouseLeave={() => setHover(null)}>
        <div className="sr-chart__grid">
          <span className="sr-chart__gridline" style={{ bottom: '100%' }}><em>{scaleMax}</em></span>
          <span className="sr-chart__gridline" style={{ bottom: '50%' }}><em>{scaleMax / 2}</em></span>
          <span className="sr-chart__gridline sr-chart__gridline--base" style={{ bottom: 0 }}><em>0</em></span>
        </div>
        <div className="sr-chart__bars" role="list">
          {days.map((d, i) => {
            const minutes = d.seconds / 60;
            const height = minutes > 0 ? Math.max(3, (minutes / scaleMax) * 100) : 0;
            return (
              <div
                key={isoDay(d.date)}
                role="listitem"
                className={`sr-chart__slot${hover === i ? ' is-hover' : ''}`}
                onMouseEnter={() => setHover(i)}
                onFocus={() => setHover(i)}
                onBlur={() => setHover(null)}
                tabIndex={0}
                aria-label={`${formatShortDay(d.date)}: ${formatDuration(d.seconds)}, ${d.count} etkinlik`}
              >
                <div className="sr-chart__bar" style={{ height: `${height}%` }} />
                {d.count > 0 && minutes === 0 && <div className="sr-chart__dot" title="Süresi bilinmeyen kayıt" />}
              </div>
            );
          })}
        </div>
        {hovered && hover != null && (
          <div
            className="sr-chart__tooltip"
            style={{ left: `${((hover + 0.5) / days.length) * 100}%` }}
          >
            <strong>{formatShortDay(hovered.date)}</strong>
            <span>{formatDuration(hovered.seconds)} · {hovered.count} etkinlik</span>
          </div>
        )}
      </div>
      <div className="sr-chart__labels">
        {days.map((d, i) => (
          <span key={isoDay(d.date)}>
            {i % labelEvery === 0 || i === days.length - 1
              ? (days.length <= 7 ? d.date.toLocaleDateString('tr-TR', { weekday: 'short' }) : d.date.getDate())
              : ''}
          </span>
        ))}
      </div>
    </div>
  );
};

const QuestionTable: React.FC<{ record: ActivityRecord }> = ({ record }) => {
  const [onlyWrong, setOnlyWrong] = useState(false);
  const questions = record.questions || [];
  const wrong = questions.filter(q => !q.isCorrect).length;
  const shown = onlyWrong ? questions.filter(q => !q.isCorrect) : questions;
  const hasScore = questions.some(q => q.score != null);
  if (questions.length === 0) return null;

  return (
    <div className="sr-questions">
      <div className="sr-questions__head">
        <h4>Soru soru sonuçlar</h4>
        {wrong > 0 && wrong < questions.length && (
          <label className="sr-toggle">
            <input type="checkbox" checked={onlyWrong} onChange={e => setOnlyWrong(e.target.checked)} />
            Sadece yanlışlar ({wrong})
          </label>
        )}
      </div>
      <div className="sr-table-wrap">
        <table className="sr-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Soru</th>
              <th>Öğrencinin cevabı</th>
              <th>Doğru cevap</th>
              <th>Sonuç</th>
            </tr>
          </thead>
          <tbody>
            {shown.map(q => {
              const index = questions.indexOf(q) + 1;
              return (
                <tr key={index} className={q.isCorrect ? '' : 'is-wrong'}>
                  <td className="sr-table__num">{index}</td>
                  <td>
                    <div className="sr-table__prompt">{q.prompt}</div>
                    {q.tag && <span className="sr-tag">{q.tag}</span>}
                  </td>
                  <td>{q.given || <span className="sr-muted">—</span>}</td>
                  <td>{q.expected || <span className="sr-muted">—</span>}</td>
                  <td>
                    <span className={`sr-result ${q.isCorrect ? 'sr-result--ok' : 'sr-result--bad'}`}>
                      {q.isCorrect ? <Check size={14} /> : <X size={14} />}
                      {q.isCorrect ? 'Doğru' : 'Yanlış'}
                    </span>
                    {hasScore && q.score != null && <div className="sr-muted sr-small">{q.score}/100</div>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const RecordDetail: React.FC<{ record: ActivityRecord; writingText?: string }> = ({ record, writingText }) => {
  const shortDetails = (record.details || []).filter(d => !LONG_DETAIL_LABELS.has(d.label));
  const longDetails = (record.details || []).filter(d => LONG_DETAIL_LABELS.has(d.label));
  const sameMoment = record.startedAt.getTime() === record.endedAt.getTime();

  return (
    <div className="sr-detail">
      <dl className="sr-facts">
        <div><dt>{sameMoment ? 'Zaman' : 'Başlangıç – bitiş'}</dt><dd>{sameMoment ? formatTime(record.endedAt) : `${formatTime(record.startedAt)} – ${formatTime(record.endedAt)}`}</dd></div>
        <div><dt>Aktif süre</dt><dd>{formatDuration(record.durationSeconds)}</dd></div>
        {record.totalQuestions != null && (
          <div><dt>Cevaplanan</dt><dd>{record.answeredCount ?? 0} / {record.totalQuestions}</dd></div>
        )}
        {record.correctCount != null && record.answeredCount != null && (
          <div><dt>Doğru / yanlış</dt><dd>{record.correctCount} / {record.answeredCount - record.correctCount}</dd></div>
        )}
        {record.scoreLabel && <div><dt>Puan</dt><dd>{record.scoreLabel}</dd></div>}
        {shortDetails.map(d => (
          <div key={d.label}><dt>{d.label}</dt><dd>{d.value}</dd></div>
        ))}
      </dl>

      {longDetails.map(d => (
        <div key={d.label} className={`sr-note${d.label === 'Not' ? ' sr-note--muted' : ''}`}>
          <span className="sr-note__label">{d.label}</span>
          <p>{d.value}</p>
        </div>
      ))}

      {record.feedbackSummary && (
        <div className="sr-note">
          <span className="sr-note__label">AI geri bildirimi</span>
          <p>{record.feedbackSummary}</p>
        </div>
      )}

      {writingText && (
        <details className="sr-essay">
          <summary>Öğrencinin yazısı ({writingText.trim().split(/\s+/).filter(Boolean).length} kelime)</summary>
          <p>{writingText}</p>
        </details>
      )}

      <QuestionTable record={record} />
    </div>
  );
};

const RecordRow: React.FC<{
  record: ActivityRecord;
  open: boolean;
  onToggle: () => void;
  writingText?: string;
}> = ({ record, open, onToggle, writingText }) => {
  const status = statusOf(record);
  const answered = record.answeredCount;
  const correct = record.correctCount;
  const wrongOnly = record.legacy && record.type === 'exam' ? record.questions?.length ?? 0 : null;

  let scoreMain = '—';
  if (record.scorePercent != null) scoreMain = `%${record.scorePercent}`;
  else if (record.bandScore != null && record.bandScore > 0) scoreMain = `Band ${record.bandScore}`;
  else if (wrongOnly != null) scoreMain = `${wrongOnly} yanlış`;

  let scoreSub = '';
  if (answered != null && correct != null) {
    scoreSub = `${correct}/${answered} doğru`;
    if (record.totalQuestions != null && answered < record.totalQuestions) scoreSub += ` · ${answered}/${record.totalQuestions} soru`;
  } else if (record.type === 'writing' && record.scorePercent != null) {
    scoreSub = 'AI puanı';
  }

  return (
    <li className={`sr-row${open ? ' is-open' : ''}`}>
      <button className="sr-row__main" onClick={onToggle} aria-expanded={open}>
        <span className="sr-row__time">{formatTime(record.endedAt)}</span>
        <span className={`sr-type sr-type--${record.type}`}>{TYPE_ICONS[record.type]}{ACTIVITY_TYPE_LABELS[record.type]}</span>
        <span className="sr-row__title">
          <strong>{record.title}</strong>
          <span className="sr-row__meta">
            <span className={`sr-status ${status.className}`}>{status.label}</span>
            {record.subtitle && <span>{record.subtitle}</span>}
            {record.legacy && record.type !== 'exam' && <span className="sr-legacy" title="Etkinlik takibinden önceki kayıt; süre bilgisi yok">eski kayıt</span>}
          </span>
        </span>
        <span className="sr-row__score">
          <strong className={record.scorePercent != null ? scoreTone(record.scorePercent) : ''}>{scoreMain}</strong>
          {scoreSub && <span>{scoreSub}</span>}
        </span>
        <span className="sr-row__duration"><Clock size={13} />{formatDuration(record.durationSeconds)}</span>
        <span className="sr-row__chevron">{open ? <ChevronDown size={18} /> : <ChevronRight size={18} />}</span>
      </button>
      {open && <RecordDetail record={record} writingText={writingText} />}
    </li>
  );
};

// ───────────────────────── main ─────────────────────────

export const StudentActivityReport: React.FC = () => {
  const [params, setParams] = useSearchParams();
  const selectedUid = params.get('user');
  const rangeKey = (RANGE_OPTIONS.some(o => o.key === params.get('range')) ? params.get('range') : '7d') as RangeKey;
  const fromParam = params.get('from');
  const toParam = params.get('to');

  const [students, setStudents] = useState<AdminStudent[]>([]);
  const [studentWarnings, setStudentWarnings] = useState<string[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [search, setSearch] = useState('');

  const [report, setReport] = useState<StudentReport | null>(null);
  const [loadingReport, setLoadingReport] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);
  const [typeFilter, setTypeFilter] = useState<ActivityType | 'all'>('all');
  const [openId, setOpenId] = useState<string | null>(null);

  const updateParams = (changes: Record<string, string | null>) => {
    setParams(prev => {
      const next = new URLSearchParams(prev);
      Object.entries(changes).forEach(([key, value]) => {
        if (value == null) next.delete(key); else next.set(key, value);
      });
      return next;
    }, { replace: true });
  };

  const loadStudents = async () => {
    setLoadingStudents(true);
    const result = await listStudents();
    setStudents(result.students);
    setStudentWarnings(result.warnings);
    setLoadingStudents(false);
  };

  useEffect(() => { void loadStudents(); }, []);

  // reloadToken re-reads "now" so Bugün/Son 7 gün stay current after a refresh.
  const range = useMemo(() => computeRange(rangeKey, fromParam, toParam), [rangeKey, fromParam, toParam, reloadToken]);

  useEffect(() => {
    if (!selectedUid) { setReport(null); return; }
    let cancelled = false;
    setLoadingReport(true);
    setReportError(null);
    setOpenId(null);
    getStudentReport(selectedUid, range.from, range.to)
      .then(result => { if (!cancelled) setReport(result); })
      .catch(error => { if (!cancelled) setReportError(error instanceof Error ? error.message : String(error)); })
      .finally(() => { if (!cancelled) setLoadingReport(false); });
    return () => { cancelled = true; };
  }, [selectedUid, range]);

  // Don't show the previous student's numbers while the next one loads.
  useEffect(() => { setTypeFilter('all'); setReport(null); }, [selectedUid]);

  const selectedStudent = students.find(s => s.uid === selectedUid);
  const filteredStudents = useMemo(() => {
    const term = search.trim().toLocaleLowerCase('tr-TR');
    if (!term) return students;
    return students.filter(s => (s.email || '').toLocaleLowerCase('tr-TR').includes(term) || s.uid.toLowerCase().includes(term));
  }, [students, search]);

  const records = report?.records || [];
  const summary = useMemo(() => summarize(records), [records]);
  const visibleRecords = typeFilter === 'all' ? records : records.filter(r => r.type === typeFilter);
  const dayGroups = useMemo(() => {
    const groups: { key: string; date: Date; items: ActivityRecord[]; seconds: number }[] = [];
    visibleRecords.forEach(r => {
      const key = isoDay(r.endedAt);
      let group = groups.find(g => g.key === key);
      if (!group) { group = { key, date: startOfDay(r.endedAt), items: [], seconds: 0 }; groups.push(group); }
      group.items.push(r);
      group.seconds += r.durationSeconds ?? 0;
    });
    return groups;
  }, [visibleRecords]);

  const rangeDays = Math.round((startOfDay(range.to).getTime() - startOfDay(range.from).getTime()) / DAY_MS) + 1;
  const maxTypeSeconds = Math.max(...summary.types.map(t => t.seconds), 1);
  const rangeText = rangeDays === 1
    ? range.from.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
    : `${range.from.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })} – ${range.to.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })}`;

  return (
    <div className="sr" lang="tr">
      {/* ── Student picker ── */}
      <aside className="sr-students" aria-label="Öğrenciler">
        <div className="sr-students__head">
          <span><Users size={16} /> Öğrenciler {!loadingStudents && <em>{students.length}</em>}</span>
          <button className="sr-icon-btn" onClick={() => void loadStudents()} title="Listeyi yenile" aria-label="Listeyi yenile">
            <RefreshCw size={15} />
          </button>
        </div>
        <label className="sr-search">
          <Search size={15} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="E-posta ara" />
        </label>
        {loadingStudents ? (
          <div className="sr-students__state"><Loader2 size={18} className="sr-spin" /> Yükleniyor…</div>
        ) : filteredStudents.length === 0 ? (
          <div className="sr-students__state">{students.length === 0 ? 'Henüz öğrenci bulunamadı.' : 'Eşleşen öğrenci yok.'}</div>
        ) : (
          <ul className="sr-students__list">
            {filteredStudents.map(s => (
              <li key={s.uid}>
                <button
                  className={`sr-student${s.uid === selectedUid ? ' is-active' : ''}`}
                  onClick={() => updateParams({ user: s.uid })}
                >
                  <span className="sr-student__avatar" aria-hidden="true">{(s.email || '?').charAt(0).toUpperCase()}</span>
                  <span className="sr-student__text">
                    <span className="sr-student__email">{s.email || 'E-posta bilinmiyor'}</span>
                    <span className="sr-student__meta">{s.email ? formatLastSeen(s.lastSeenAt) : `ID ${s.uid.slice(0, 8)}…`}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
        {studentWarnings.length > 0 && (
          <div className="sr-warning"><AlertTriangle size={14} /> {studentWarnings.join(' · ')}</div>
        )}
        <p className="sr-students__hint">
          Öğrenciler uygulamaya bir sonraki girişlerinde e-postalarıyla listeye eklenir.
        </p>
      </aside>

      {/* ── Report ── */}
      <section className="sr-main">
        {!selectedUid ? (
          <div className="sr-empty">
            <Users size={42} />
            <h2>Bir öğrenci seçin</h2>
            <p>Soldaki listeden bir öğrenci seçtiğinizde seçilen tarih aralığındaki tüm sınav, gramer, okuma, dinleme, yazma, konuşma ve Sentence Lab etkinlikleri burada görünür.</p>
          </div>
        ) : (
          <>
            <header className="sr-head">
              <div>
                <h2>{selectedStudent?.email || 'E-posta bilinmiyor'}</h2>
                <p className="sr-muted">
                  {rangeText}
                  {selectedStudent?.lastSeenAt && <> · son giriş {formatLastSeen(selectedStudent.lastSeenAt).toLocaleLowerCase('tr-TR')}</>}
                </p>
              </div>
              <div className="sr-range">
                <div className="sr-segment" role="group" aria-label="Tarih aralığı">
                  {RANGE_OPTIONS.map(option => (
                    <button
                      key={option.key}
                      className={option.key === rangeKey ? 'is-active' : ''}
                      onClick={() => updateParams(option.key === 'custom'
                        ? { range: 'custom', from: fromParam || isoDay(range.from), to: toParam || isoDay(range.to) }
                        : { range: option.key, from: null, to: null })}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                {rangeKey === 'custom' && (
                  <div className="sr-dates">
                    <CalendarDays size={15} />
                    <input type="date" value={isoDay(range.from)} max={isoDay(new Date())} onChange={e => e.target.value && updateParams({ from: e.target.value })} aria-label="Başlangıç tarihi" />
                    <span>–</span>
                    <input type="date" value={isoDay(range.to)} max={isoDay(new Date())} onChange={e => e.target.value && updateParams({ to: e.target.value })} aria-label="Bitiş tarihi" />
                  </div>
                )}
                <button className="sr-icon-btn" onClick={() => setReloadToken(t => t + 1)} title="Yenile" aria-label="Raporu yenile">
                  <RefreshCw size={15} className={loadingReport ? 'sr-spin' : ''} />
                </button>
              </div>
            </header>

            {reportError && <div className="sr-warning sr-warning--block"><AlertTriangle size={15} /> Rapor yüklenemedi: {reportError}</div>}
            {report && report.warnings.length > 0 && (
              <div className="sr-warning sr-warning--block">
                <AlertTriangle size={15} />
                <span>Bazı kayıtlar okunamadı: {report.warnings.join(' · ')}</span>
              </div>
            )}

            {loadingReport && !report ? (
              <div className="sr-loading"><Loader2 size={22} className="sr-spin" /> Etkinlikler yükleniyor…</div>
            ) : report && (
              <div className={loadingReport ? 'sr-body is-loading' : 'sr-body'}>
                <div className="sr-kpis">
                  <Kpi icon={<Clock size={15} />} label="Aktif çalışma" value={summary.seconds > 0 ? formatDuration(summary.seconds) : '—'}
                    sub={summary.untimed > 0
                      ? `${summary.untimed} eski kayıtta süre bilgisi yok`
                      : summary.seconds > 0 ? `aktif gün başına ${formatDuration(Math.round(summary.seconds / summary.activeDays))}` : undefined} />
                  <Kpi icon={<Activity size={15} />} label="Etkinlik" value={String(records.length)}
                    sub={`${records.filter(r => r.status === 'completed').length} tamamlandı`} />
                  <Kpi icon={<Target size={15} />} label="Doğruluk" value={summary.answered ? `%${Math.round((summary.correct / summary.answered) * 100)}` : '—'}
                    sub={summary.answered ? `${summary.correct}/${summary.answered} soru doğru` : 'Cevaplanan soru yok'} />
                  <Kpi icon={<CalendarDays size={15} />} label="Aktif gün" value={`${summary.activeDays}`}
                    sub={`${rangeDays} günlük aralıkta`} />
                </div>

                {records.length === 0 ? (
                  <div className="sr-empty sr-empty--inline">
                    <Clock size={32} />
                    <p>Bu aralıkta kayıtlı etkinlik yok.</p>
                  </div>
                ) : (
                  <>
                    <div className="sr-grid">
                      {rangeDays >= 2 && rangeDays <= 62 && summary.seconds > 0 && (
                        <DailyChart from={range.from} to={range.to} records={records} />
                      )}

                      <div className="sr-card sr-modules">
                        <div className="sr-card__head"><h3>Modüllere göre</h3></div>
                        <div className="sr-table-wrap">
                          <table className="sr-table sr-table--compact">
                            <thead>
                              <tr><th>Modül</th><th>Etkinlik</th><th>Soru</th><th>Başarı</th><th>Süre</th></tr>
                            </thead>
                            <tbody>
                              {summary.types.map(t => {
                                const score = typeScore(t);
                                return (
                                  <tr key={t.type}>
                                    <td><span className={`sr-type sr-type--${t.type}`}>{TYPE_ICONS[t.type]}{ACTIVITY_TYPE_LABELS[t.type]}</span></td>
                                    <td className="sr-nowrap">{t.count}<span className="sr-muted sr-small"> · {t.completed} bitti</span></td>
                                    <td>{t.answered ? `${t.correct}/${t.answered}` : '—'}</td>
                                    <td className="sr-nowrap"><strong className={scoreTone(score.value)}>{score.text}</strong></td>
                                    <td className="sr-nowrap">
                                      <div className="sr-share">
                                        <span>{t.seconds ? formatDuration(t.seconds) : '—'}</span>
                                        <i style={{ width: `${(t.seconds / maxTypeSeconds) * 100}%` }} />
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>

                    <div className="sr-filter" role="group" aria-label="Modül filtresi">
                      <button className={typeFilter === 'all' ? 'is-active' : ''} onClick={() => setTypeFilter('all')}>
                        Tümü <em>{records.length}</em>
                      </button>
                      {summary.types.map(t => (
                        <button key={t.type} className={typeFilter === t.type ? 'is-active' : ''} onClick={() => setTypeFilter(t.type)}>
                          {ACTIVITY_TYPE_LABELS[t.type]} <em>{t.count}</em>
                        </button>
                      ))}
                    </div>

                    <div className="sr-timeline">
                      {dayGroups.map(group => (
                        <section key={group.key} className="sr-day">
                          <h3 className="sr-day__head">
                            <span>{formatDayHeading(group.date)}</span>
                            <span className="sr-muted">{group.items.length} etkinlik{group.seconds > 0 && ` · ${formatDuration(group.seconds)}`}</span>
                          </h3>
                          <ul className="sr-rows">
                            {group.items.map(r => (
                              <RecordRow
                                key={r.id}
                                record={r}
                                open={openId === r.id}
                                onToggle={() => setOpenId(openId === r.id ? null : r.id)}
                                writingText={r.sourceId ? report.writingTexts[r.sourceId] : undefined}
                              />
                            ))}
                          </ul>
                        </section>
                      ))}
                    </div>

                    <p className="sr-footnote">
                      Aktif süre yalnızca sekme açıkken sayılır; {Math.round(IDLE_CAP_MS / 60000)} dakikadan uzun hareketsiz aralıklar {Math.round(IDLE_CAP_MS / 60000)} dakika olarak hesaplanır.
                      Gramer ve Sentence Lab etkinlikleri bu güncellemeden önce yalnızca öğrencinin tarayıcısında tutuluyordu, bu yüzden eski kayıtları burada görünmez.
                    </p>
                  </>
                )}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};
