import type { CSSProperties, ReactNode } from 'react';
import { GrammarTopic } from '../types/grammarLesson';
import '../grammar-topic-icons.css';

// A small, consistent set of illustrations, independent of platform emoji fonts.
const palettes: Record<GrammarTopic, [string, string, string]> = {
    [GrammarTopic.PresentTenses]: ['#6651b8', '#f0eaff', '#b39ae9'],
    [GrammarTopic.PastTenses]: ['#a85b40', '#fff0e6', '#edaa83'],
    [GrammarTopic.FutureForms]: ['#3974ac', '#e8f3fd', '#85bbee'],
    [GrammarTopic.ModalVerbs]: ['#946b21', '#fff4d6', '#eac36c'],
    [GrammarTopic.Conditionals]: ['#3f7d66', '#e8f5ed', '#91c8ac'],
    [GrammarTopic.Prepositions]: ['#ad5276', '#ffebf2', '#efa5bb'],
    [GrammarTopic.Articles]: ['#5968b2', '#eef0ff', '#a3afef'],
    [GrammarTopic.Comparatives]: ['#377f85', '#e2f5f2', '#81c6c2'],
    [GrammarTopic.PassiveVoice]: ['#745d9d', '#f2ecfa', '#bd9fdf'],
    [GrammarTopic.ReportedSpeech]: ['#af6259', '#fff0ec', '#eda99b'],
    [GrammarTopic.QuestionFormation]: ['#397baa', '#e8f5fe', '#8fc9e9'],
    [GrammarTopic.PhrasalVerbs]: ['#648042', '#f1f5e2', '#b5cb8c'],
};

const ink = 'var(--topic-ink)';
const accent = 'var(--topic-accent)';
const drawings: Record<GrammarTopic, ReactNode> = {
    [GrammarTopic.PresentTenses]: <>
        <path d="M27 63l-4 6m34-6 4 6" />
        <rect x="32" y="15" width="20" height="8" rx="4" fill={accent} />
        <circle cx="42" cy="44" r="24" fill="white" />
        <circle cx="42" cy="44" r="18" stroke={accent} strokeDasharray="1 8.4" />
        <path d="M42 30v14l10 6" strokeWidth="3" />
        <circle cx="42" cy="44" r="2" fill={ink} stroke="none" />
        <path d="M61 18l3 4m-46-2-3 4" />
    </>,
    [GrammarTopic.PastTenses]: <>
        <rect x="20" y="20" width="45" height="46" rx="8" fill="white" transform="rotate(-5 42 43)" />
        <path d="M19 34l45-4" stroke={accent} strokeWidth="7" />
        <path d="M30 16v10m23-12v10" strokeWidth="3" />
        <path d="M34 44a11 11 0 1 1-1 12m0-19v8h8" />
        <path d="M45 45v7l5 3" stroke={accent} />
    </>,
    [GrammarTopic.FutureForms]: <>
        <path d="M20 59c-6 8 8 15 14 6s-6-12-12-8" stroke={accent} strokeDasharray="3 5" />
        <path d="M18 33l51-16-15 49-13-19z" fill="white" />
        <path d="M18 33l23 14 28-30-37 22z" fill={accent} />
        <path d="M41 47l-4 13 10-5" fill="white" />
        <path d="M69 55v7m-3.5-3.5h7" stroke={accent} />
    </>,
    [GrammarTopic.ModalVerbs]: <>
        <circle cx="33" cy="32" r="16" fill="white" />
        <circle cx="30" cy="29" r="5" fill={accent} stroke="none" />
        <path d="M44 42l23 23-7 7-7-7 4-4-6-6-4 4-11-12" fill={accent} />
        <path d="M48 44l15 15" stroke="white" />
        <path d="M61 28v10m-5-5h10M20 56v6m-3-3h6" stroke={accent} />
    </>,
    [GrammarTopic.Conditionals]: <>
        <path d="M44 65V43m0 2c0-14-21-7-21-24m21 24c0-14 21-7 21-24" strokeWidth="3" />
        <circle cx="44" cy="65" r="7" fill="white" />
        <rect x="15" y="15" width="16" height="16" rx="5" fill="white" />
        <path d="M65 12l11 11-11 11-11-11z" fill={accent} />
        <circle cx="44" cy="43" r="4" fill={accent} stroke="none" />
        <path d="M21 58l4 4m-4 0 4-4" stroke={accent} />
    </>,
    [GrammarTopic.Prepositions]: <>
        <path d="M16 59l28-10 28 10-28 12z" fill="white" />
        <path d="M17 66l27 10 27-10" stroke={accent} />
        <path d="M61 31c0 13-17 28-17 28S27 44 27 31a17 17 0 0 1 34 0z" fill={accent} />
        <circle cx="44" cy="31" r="7" fill="white" />
        <path d="M44 59v5" strokeDasharray="1 3" />
    </>,
    [GrammarTopic.Articles]: <>
        <rect x="17" y="19" width="34" height="44" rx="6" fill={accent} transform="rotate(-12 34 41)" />
        <rect x="34" y="28" width="34" height="44" rx="6" fill="white" transform="rotate(8 51 50)" />
        <text x="29" y="40" fill={ink} stroke="none" fontSize="21" fontWeight="650" fontFamily="Georgia, serif" transform="rotate(-12 34 41)">a</text>
        <text x="51" y="54" textAnchor="middle" fill={ink} stroke="none" fontSize="15" fontWeight="650" fontFamily="Georgia, serif" transform="rotate(8 51 50)">the</text>
        <path d="M41 62l17 2" stroke={accent} />
    </>,
    [GrammarTopic.Comparatives]: <>
        <rect x="17" y="49" width="14" height="20" rx="4" fill="white" />
        <rect x="37" y="38" width="14" height="31" rx="4" fill={accent} />
        <rect x="57" y="28" width="14" height="41" rx="4" fill="white" />
        <path d="M64 10l2.6 5.4 6 .9-4.3 4.2 1 6-5.3-2.9-5.3 2.9 1-6-4.3-4.2 6-.9z" fill={accent} stroke="none" />
        <path d="M18 35l16-10 12 1" strokeDasharray="3 5" stroke={accent} />
    </>,
    [GrammarTopic.PassiveVoice]: <>
        <rect x="14" y="29" width="27" height="30" rx="7" fill="white" />
        <rect x="47" y="29" width="27" height="30" rx="7" fill={accent} />
        <path d="M24 39h8m-8 8h6M56 39h9m-9 8h6" />
        <path d="M25 21c8-10 28-10 37 0m-1-8 2 9-9-1M62 67c-8 10-28 10-37 0m1 8-2-9 9 1" />
    </>,
    [GrammarTopic.ReportedSpeech]: <>
        <path d="M44 34h23a7 7 0 0 1 7 7v15a7 7 0 0 1-7 7h-4v10l-11-10h-8a7 7 0 0 1-7-7V41a7 7 0 0 1 7-7z" fill={accent} />
        <path d="M21 18h27a7 7 0 0 1 7 7v17a7 7 0 0 1-7 7H35L23 59V49h-2a7 7 0 0 1-7-7V25a7 7 0 0 1 7-7z" fill="white" />
        <path d="M25 28h8v7c0 4-2 7-7 8v-3c3-1 4-3 4-5h-5zM38 28h8v7c0 4-2 7-7 8v-3c3-1 4-3 4-5h-5z" fill={ink} stroke="none" />
        <path d="M57 47h8m-16 7h16" stroke="white" />
    </>,
    [GrammarTopic.QuestionFormation]: <>
        <path d="M44 15c16 0 27 10 27 24S60 63 44 63h-8L23 73l2-16c-6-4-9-10-9-18 0-14 12-24 28-24z" fill="white" />
        <path d="M35 31c0-10 18-10 18 0 0 7-9 7-9 14" strokeWidth="4" />
        <circle cx="44" cy="53" r="2.5" fill={ink} stroke="none" />
        <path d="M21 20l-5-4m54 43 5 4" stroke={accent} />
    </>,
    [GrammarTopic.PhrasalVerbs]: <>
        <g transform="rotate(-9 44 44)">
            <path d="M20 25h25v11c8-5 14-1 14 5s-6 10-14 5v16H20a5 5 0 0 1-5-5V30a5 5 0 0 1 5-5z" fill="white" />
            <path d="M45 25h24a5 5 0 0 1 5 5v27a5 5 0 0 1-5 5H45V46c8 5 14 1 14-5s-6-10-14-5z" fill={accent} />
            <path d="M24 37h11m-11 8h7M64 38v9" />
        </g>
        <path d="M27 71h10m17-54h9" stroke={accent} />
    </>,
};

export function GrammarTopicIcon({ topic, compact = false }: { topic: GrammarTopic; compact?: boolean }) {
    const [color, tint, detail] = palettes[topic];
    return <span className={`grammar-topic-art${compact ? ' is-compact' : ''}`} data-topic-icon={topic}
        style={{ '--topic-ink': color, '--topic-tint': tint, '--topic-accent': detail } as CSSProperties} aria-hidden="true">
        <svg viewBox="0 0 88 88" fill="none" focusable="false">
            <path d="M26 7C45 2 73 9 78 28c9 23-6 49-25 52C30 88 8 73 7 51 3 29 10 13 26 7Z" fill="var(--topic-tint)" />
            <circle cx="76" cy="12" r="3" fill={accent} />
            <circle cx="9" cy="68" r="2" fill={accent} />
            <g stroke={ink} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">{drawings[topic]}</g>
        </svg>
    </span>;
}
