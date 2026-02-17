# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Svelte MCP Tools

You have access to the Svelte MCP server with comprehensive Svelte 5 and SvelteKit documentation:

1. **list-sections** — Use FIRST to discover available documentation sections. Analyze `use_cases` fields to find relevant sections.
2. **get-documentation** — Fetch full documentation for sections found via list-sections. Fetch ALL relevant sections at once.
3. **svelte-autofixer** — MUST use whenever writing Svelte code. Keep calling until no issues remain.
4. **playground-link** — Ask user before generating. NEVER use if code was written to project files.

## Project Overview

Qiyam Mushaf — A SvelteKit 5 PWA that displays the full Quran and uses speech recognition to highlight words as the user reads aloud. Deploys to GitHub Pages via adapter-static.

## Commands

```bash
bun install            # Install dependencies
bun dev                # Dev server with HMR (serves over HTTPS via basicSsl plugin)
bun run build          # Production build to build/
bun preview            # Preview production build
bun test               # Run all vitest tests
bun test <file>        # Single test (e.g., bun test src/lib/utils/wordMatcher.test.ts)
bun run check          # svelte-check type checking
bun run check:watch    # svelte-check in watch mode
bun storybook          # Storybook dev server on port 6006
bun run build-storybook # Build static Storybook
```

## Architecture

### Tech Stack

- **SvelteKit 2 + Svelte 5** (runes: `$state`, `$derived`, `$effect`, `$inspect`)
- **Tailwind CSS v4** via `@tailwindcss/vite`
- **Bun** runtime, **Vite 6** bundler, **adapter-static** (SPA fallback: `index.html`)
- **mdsvex** preprocessor configured for `.md`/`.mdx` extensions (currently unused)
- **virtua** for virtual scrolling (~6000+ renderable items)
- **fastest-levenshtein** for Arabic text matching
- **@fontsource/amiri** for Arabic font (bundled by Vite, same-origin for service worker)

### Dual-Text Data System

Two parallel Quran text sources in `static/data/`:

- `quran-uthmani-list.json` — Full Uthmani script with diacritics (tashkeel) for **display**
- `quran-simple-clean-list.json` — Simplified Arabic without diacritics for **speech matching**

Both are 2D arrays: `[surahIndex][verseIndex] = verseText`. `dataProcessor.ts` builds a many-to-one mapping: each simple word gets a `uthmaniIndex` pointing into `verse.uthmani.split(/\s+/)`. Tajweed marks (9 codepoints in `TAJWEED_MARKS`) are skipped; vocative merges produce two Words sharing the same uthmani index.

### Data Loading Pipeline

```
+page.ts (ssr=false) → QuranDataService.loadData()
  → IndexedDB cache hit? return cached
  → else: fetch both JSONs → processQuranData() → cache result
  → buildRenderableItems() → buildLookupMaps()
  → returns { surahs, allWords, renderableItems, lookupMaps }
```

### State Layer (Svelte 5 Runes)

**appState** (`stores/app.svelte.ts`) — Mutable singleton with dual-cursor model:
- `finalCursor` — Stable anchor, only advances on committed (final) speech
- `nextWordIndex` — Visual cursor, updated by both final and interim results
- `isNavigationModalOpen`, `isSettingsModalOpen`, `isAcknowledgmentsOpen`

**SpeechStore** (`stores/speech.svelte.ts`) — Reactive wrapper around SpeechRecognitionService. Exposes `finalTranscript`, `interimTranscript`, `status`, `errorMessage`. Singleton via `getSpeechStore()`.

**speechMatcher** (`stores/speechMatcher.svelte.ts`) — Created in component context via `createSpeechMatcher()`. Two `$effect` blocks react to `finalTranscript` and `interimTranscript` independently, calling `matchWords()` and advancing the dual cursors.

**BookmarkStore** (`stores/bookmarks.svelte.ts`) — Wraps `BookmarkService` for bookmarks and "continue reading" position. Persists to IndexedDB.

**SettingsStore** (`stores/settings.svelte.ts`) — `verseFontSize` persisted to localStorage.

### Word Matching Algorithm

`src/lib/utils/wordMatcher.ts` — Expanding-prefix Levenshtein matching:

1. **Normalize** Arabic (remove diacritics, standardize hamza/alif/ta-marbuta)
2. **Expanding-prefix search**: compare full spoken phrase against growing prefixes of reference words from `anchor`. The prefix with minimum edit distance wins (`bestCount` words matched).
3. **Quality gate**: reject if `editDistance > spokenPhrase.length * MAX_DISTANCE_RATIO` (0.6)
4. **Suffix-skipping**: if quality gate rejects, trim leading stale tokens one-by-one and re-check. Handles speech API returning already-matched text after auto-restart.

Key constants in `constants.ts`: `WINDOW_MULTIPLIER` (1.1), `LOOKAHEAD_PADDING` (8), `MAX_DISTANCE_RATIO` (0.6), `MIN_SUFFIX_RATIO` (0.8), `MIN_SUFFIX_TOKENS` (3).

### Data Flow (Speech → Highlight)

1. User speaks → `SpeechRecognitionService` emits `onResult(finalTranscript, interimTranscript)`
2. `SpeechStore` updates reactive state → `speechMatcher` `$effect` triggers
3. `matchWords(transcript, allWords, finalCursor)` returns new cursor position
4. `appState.nextWordIndex` updates → `+page.svelte` derives `currentVerseKey` via `allWords[idx].verseKey` (O(1))
5. `VerseRow` computes `highlightedCount = nextWordIndex - verse.words[0].globalIndex`
6. `VerseRow` converts simple word count → uthmani highlight set via `word.uthmaniIndex`
7. Auto-scroll via `$effect` watching `nextWordIndex` → `virtualListRef.scrollToIndex()`

### Services (Singletons)

- **QuranDataService** (`services/QuranDataService.ts`) — Fetch + IndexedDB cache + `processQuranData()`
- **SpeechRecognitionService** (`services/SpeechRecognitionService.ts`) — Web Speech API wrapper (`ar-SA`), auto-restart via `shouldContinue` flag on `onend`
- **BookmarkService** (`services/BookmarkService.ts`) — IndexedDB persistence for bookmarks and continue position
- **db.ts** (`services/db.ts`) — Shared `openDatabase()` with versioned schema (4 object stores: `cache`, `bookmarks`, `continue`, `settings`)

### Virtual Scrolling

`globalAddressing.ts` builds a flat `RenderableItem[]` array containing surah-headers, bismillahs, and verses. `LookupMaps.keyToIndex` provides O(1) `GlobalVerseKey → flat index` for scroll-to-verse.

### Storybook

Stories are co-located as `*.stories.svelte` files next to components. Mock data in `src/lib/stories/mocks.ts`.

## Type Definitions

All types in `src/lib/types/index.ts`:

- `Word` `{simple, normalizedSimple, uthmaniIndex, globalIndex, verseKey}` — Self-describing word
- `Verse` `{number, uthmani, words}` — Verse text and word mappings
- `Surah` — Surah metadata and verses
- `QuranData` `{surahs, allWords}` — Processed data with flat word sequence
- `GlobalVerseKey` — Template literal type `"surah:verse"` (e.g., `"2:255"`)
- `RenderableItem` — Discriminated union: `surah-header | bismillah | verse`
- `LookupMaps` — `keyToIndex: Map<GlobalVerseKey, number>` for virtual scroll
- `RecognitionStatus` — `'idle' | 'listening' | 'stopped' | 'error'`

## Gotchas

- **Tailwind v4 dynamic classes**: Cannot detect `pb-{VAR}` — use inline `style` for dynamic values
- **`ssr = false`** in `+page.ts` — App uses browser APIs (IndexedDB, Web Speech API, service worker)
- **Dev server uses HTTPS** via `@vitejs/plugin-basic-ssl` (required for Web Speech API)
- **DB_VERSION** in `constants.ts` — Must be bumped when adding/changing IndexedDB object stores
- **Service worker** caches same-origin only — `@fontsource` fonts are bundled by Vite so they're same-origin
- **NavigationModal** has pre-existing `state_referenced_locally` Svelte warnings (intentional — component mounts fresh)
- **SpeechRecognition auto-restart**: `shouldContinue` flag causes restart on `onend` for seamless listening; transcripts may contain stale prefix text from previous sessions
- **`BASE_PATH`** env var configures deployment path for GitHub Pages subdirectory hosting
