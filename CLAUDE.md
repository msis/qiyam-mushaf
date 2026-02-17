# CLAUDE.md

You are able to use the Svelte MCP server, where you have access to comprehensive Svelte 5 and SvelteKit documentation. Here's how to use the available tools effectively:

## Available MCP Tools:

### 1. list-sections

Use this FIRST to discover all available documentation sections. Returns a structured list with titles, use_cases, and paths.
When asked about Svelte or SvelteKit topics, ALWAYS use this tool at the start of the chat to find relevant sections.

### 2. get-documentation

Retrieves full documentation content for specific sections. Accepts single or multiple sections.
After calling the list-sections tool, you MUST analyze the returned documentation sections (especially the use_cases field) and then use the get-documentation tool to fetch ALL documentation sections that are relevant for the user's task.

### 3. svelte-autofixer

Analyzes Svelte code and returns issues and suggestions.
You MUST use this tool whenever writing Svelte code before sending it to the user. Keep calling it until no issues or suggestions are returned.

### 4. playground-link

Generates a Svelte Playground link with the provided code.
After completing the code, ask the user if they want a playground link. Only call this tool after user confirmation and NEVER if code was written to files in their project.

## Project Overview

Qiyam Mushaf - A SvelteKit 5 web app that displays Quran text and uses speech recognition to highlight words as the user reads aloud. Auto-advances verses when all words are matched.

## Commands

```bash
bun install          # Install dependencies
bun dev              # Start dev server with HMR (hot reloading)
bun run build        # Build for production to build/
bun preview          # Preview production build
bun test             # Run all tests
bun test <file>      # Run specific test file (e.g., bun test tests/wordMatcher.test.ts)
```

## Architecture

### Dual-Text Data System

The app uses two parallel Quran text sources:

- `quran-uthmani-list.json` - Full Uthmani script with diacritics (tashkeel) for **display**
- `quran-simple-clean-list.json` - Simplified Arabic without diacritics for **speech matching**

Both are 2D arrays: `[surahIndex][verseIndex] = verseText`. The `dataProcessor.ts` builds a many-to-one mapping: each simple word gets an `uthmaniIndex` pointing into `verse.uthmani.split(/\s+/)`. Tajweed marks are skipped (no Word points to them); vocative merges produce two Words sharing the same uthmani index.

### Key Services (Singletons)

**QuranDataService** (`src/lib/services/QuranDataService.ts`)

- Fetches and caches Quran data in IndexedDB
- Provides `loadData()` and `clearCache()`

**SpeechRecognitionService** (`src/lib/services/SpeechRecognitionService.ts`)

- Wraps Web Speech API with Arabic language (`ar-SA`)
- Event-based callbacks: `onResult`, `onError`, `onEnd`, `onStart`
- Handles continuous recognition with interim results

### Word Matching Algorithm

`src/lib/utils/wordMatcher.ts` handles Arabic speech-to-text matching:

1. Normalizes Arabic text (removes diacritics, standardizes hamza/alif variants)
2. Uses Levenshtein distance with 70% similarity threshold (`SIMILARITY_THRESHOLD`)
3. Matches words sequentially; stops at first non-match to ensure order

### Data Flow

1. User speaks → SpeechRecognitionService emits transcript
2. `+page.svelte` passes transcript to `matchWords()` with `allWords` and a session anchor
3. `matchWords` returns a new `nextWordIndex` (first unmatched global word index)
4. `allWords[nextWordIndex].verseKey` gives O(1) current verse position
5. `VerseRow` computes `highlightedCount` from `nextWordIndex - verse.words[0].globalIndex`
6. `VerseRow` derives uthmani highlight set: converts contiguous simple count → uthmani indices via `word.uthmaniIndex`

## Type Definitions

All types in `src/lib/types/index.ts`:

- `Word` `{simple, normalizedSimple, uthmaniIndex, globalIndex, verseKey}` - Self-describing word with pointers to uthmani token, global position, and parent verse
- `Verse` `{number, uthmani, words}` - Verse text and word mappings
- `Surah` - Surah metadata and verses
- `QuranData` `{surahs, allWords}` - Processed data with flat word sequence for O(1) global index lookup
- `SpeechRecognitionResult`, `SpeechRecognitionCallbacks` - Speech API types
- `RenderableItem`, `LookupMaps` - Virtual scrolling support types

## Constants

`src/lib/utils/constants.ts` contains:

- `SURAH_NAMES` - Array of all 114 surahs with Arabic/English names and verse counts
- `LANGUAGE_CODE` - Arabic locale for speech recognition (`ar-SA`)
- `SIMILARITY_THRESHOLD` - Levenshtein match threshold (0.7)
- `DB_NAME`, `DB_VERSION`, `CACHE_KEY` - IndexedDB configuration
- `TAJWEED_MARKS` - Set of 9 standalone tajweed/juz mark codepoints in uthmani text
- `ERROR_DISMISS_DELAY` - UI timing constant (ms)
