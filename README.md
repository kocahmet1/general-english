# English Master

English learning app focused on IELTS and TOEFL practice. The app is built with React, TypeScript, Vite, and a small Node/Express server used for secure OpenAI API access in production.

## What changed for deployment

- OpenAI calls now go through the server, so `OPENAI_API_KEY` is never exposed in the browser.
- Render can run the whole app as one web service.
- `render.yaml` is included for blueprint-based deployment.
- `/api/health` and `/api/config` are available for Render and runtime checks.

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Copy the environment file:

```bash
copy .env.example .env
```

3. Set your variables in `.env`:

```env
OPENAI_API_KEY=sk-your-openai-api-key
PORT=3001
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

Notes:
- `OPENAI_API_KEY` is server-only. Do not prefix it with `VITE_`.
- Firebase config values are safe to expose to the client, but they still need to match your Firebase project.

## Development

Run client and server together:

```bash
npm run dev
```

- Vite runs on `http://localhost:5173`
- The Express API runs on `http://localhost:3001`
- Vite proxies `/api` to the local server

## IELTS-style listening tests

`/listening` opens three full IELTS-format listening tests (`src/data/ieltsListeningTests.ts`): four parts and 40 questions each, with the real exam's question types (form, note, table and flow-chart completion, multiple choice, "Choose TWO", map/plan labelling, matching), rubrics and word limits. They are original and deliberately easier than a real paper, for a student moving from band 4.5–5 towards 6.5: slower recordings (about 140 words per minute in Test 1, 150 in Test 2 and 155–160 in Test 3, against roughly 160–180 in real conversations), everyday vocabulary, fewer distractors and clearer signposting. Test 1 (Kolay) is the easiest; Test 2 (Orta) uses more paraphrase and distractors; Test 3 (Orta–İleri) has a distractor in almost every question, mentions every multiple-choice option in the recording and is spoken a little faster.

- **Practice mode** (recommended first): pause, rewind 5 s, seek, 0.85× speed, skip the reading time; each part is marked as soon as it is submitted, with Turkish explanations, a strategy tip per question group, the transcript with the answer lines marked, and "Cevabı dinle" to replay exactly where each answer is heard.
- **Exam mode**: parts in order, each recording plays once without seeking, marking and explanations only after all four parts.
- Results: raw score out of 40, the IELTS listening band conversion, distance to band 6.5 (26/40), scores per part and per question type, and every wrong answer. The page notes that these tests run slightly easier than the real exam.
- Typed answers are marked like the exam: word limits, accepted alternatives (`9.30`/`9:30`, `£54`/`54`), case and a leading article ignored; plural and spelling slips are wrong but explained.
- Progress is saved per test in `users/{uid}/listeningProgress/{testId}` (with `format: 'ielts'`), unsubmitted answers are also kept in the browser, and each submitted part is written to the activity log, so the admin student report shows the attempt, the band and each answer.

Recordings are in `public/audio/ielts/` with cue timings in `src/data/ieltsListeningAudioManifest.ts`. They are made with Kokoro, a free text-to-speech model that runs on your own computer (no API key, no cost); announcer lines, reading time and checking time follow the real recording layout. To re-render after editing a script:

```bash
npm install --no-save kokoro-js
node scripts/generate-ielts-listening-audio.mjs            # add --test <id> --part <n> to render one part
```

It needs ffmpeg like the TOEFL script, downloads the model (~330 MB) into `.tools/kokoro-models` on first run and reuses unchanged lines from `.tools/ielts-listening-audio-cache/`.

Run `node --test tests/ielts-listening-content.test.mjs` after editing a test: it checks numbering, that every evidence quote is copied exactly from the script, that typed answers are heard in the recording and fit the word limit, that multiple-choice keys are not concentrated on one letter, and that every script line has a cue in the recording. `/tests/ielts-listening-qa.html` is an isolated UI fixture with in-memory progress (no Firebase writes).

## TOEFL-style listening practice

The TOEFL practice moved to `/listening/toefl` (old `/listening?test=toefl-…` links redirect there); the IELTS/TOEFL switch sits at the top of both pages.


The listening library contains two original campus conversations (five questions each) and four academic lectures (six questions each), with 34 questions in total. Topics include research planning, a library exhibit, urban heat, retrieval practice, archaeological trade evidence, and exoplanets.

These are extended conversation/lecture practice sets, not a simulation of the current adaptive TOEFL test. Question skills follow the conversation and lecture practice described in [ETS listening practice](https://www.ets.org/s/toefl/free-practice/listening.html); all scripts, questions, and explanations here are original.

Recordings are bundled under `public/audio/toefl/` and work without an API call during playback. Each conversation assigns a different synthetic voice to each speaker (OpenAI `nova` and `onyx`). The content source is `src/data/listeningContent.ts`; transcripts, audio, and replay excerpts use the same speaker turns. `src/data/listeningAudioManifest.ts` contains the generated timing metadata.

To regenerate recordings after editing a passage, explicitly run `node --env-file=.env scripts/generate-listening-audio.mjs`. This uses the configured OpenAI API key and incurs speech-generation usage. It requires ffmpeg on PATH, `FFMPEG_PATH`, or Python's `imageio_ffmpeg` package. Unchanged turns are reused from the ignored `.tools/listening-audio-cache/` directory.

Run `node --test tests/listening-content.test.mjs` to validate the library and recordings. During development, `/tests/listening-qa.html` provides an isolated UI fixture with in-memory progress and simulated save failures; it never writes to Firebase and is excluded from the production build. Completed TOEFL attempts use the `toefl-listening` stats document; previous IELTS progress is retained separately.

## IELTS-style reading

The reading library starts with five IELTS Academic-style passages (`src/data/ieltsReadingPassages.ts`), pitched at roughly band 5.5–6.5. Besides multiple choice, reading questions can be TRUE/FALSE/NOT GIVEN, YES/NO/NOT GIVEN (the writer's views), matching headings, matching information (which paragraph), matching features (people), sentence completion, note completion, short-answer questions, and summary completion either typed from the passage or chosen from a word list. Questions are grouped with the exam rubric, a short Turkish strategy tip, and an optional shared list or summary. Typed answers are checked against the word limit, accept listed alternatives (e.g. `60`/`sixty`), and treat a leading article as optional; plural slips and near-miss spellings are marked wrong with their own explanation. After each answer the supporting sentence (`evidence`) is highlighted in the passage.

Run `node --test tests/reading-content.test.mjs` after editing a passage: it checks that every evidence quote appears word for word, every typed answer comes from the passage and fits its word limit, and every choice answer exists. `/tests/reading-qa.html` is an isolated UI fixture with in-memory progress (no Firebase writes).

## Production build

```bash
npm run build
npm start
```

The server serves the built frontend from `dist/` and exposes the API under `/api`.

## GitHub prep

Before pushing:
- Confirm `.env` is not committed.
- Commit `package-lock.json`, `render.yaml`, `server/`, and the frontend changes.
- Push the repo to GitHub.

## Deploy to Render

### Option 1: Blueprint deploy

1. Push this repo to GitHub.
2. In Render, choose `New +` -> `Blueprint`.
3. Select the repository.
4. Render will read [`render.yaml`](/C:/Users/Test1/english-learning-app/render.yaml).
5. Fill in the environment variables, especially `OPENAI_API_KEY`.

### Option 2: Manual web service

Use these settings:

- Runtime: `Node`
- Build Command: `npm install && npm run build`
- Start Command: `npm start`
- Health Check Path: `/api/health`

Set these environment variables in Render:

- `OPENAI_API_KEY`
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

## Important security note

Do not put `OPENAI_API_KEY` in frontend code or in any `VITE_*` variable. Vite variables are bundled into the client and become public.
