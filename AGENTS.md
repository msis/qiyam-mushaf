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

Quran Teleprompter - A SvelteKit 5 web app that displays Quran text and uses speech recognition to highlight words as the user reads aloud. Auto-advances verses when all words are matched.

## Commands

```bash
bun install          # Install dependencies
bun dev              # Start dev server with HMR (hot reloading)
bun run build        # Build for production to dist/
bun start            # Run production server
bun test             # Run all tests
bun test <file>      # Run specific test file (e.g., bun test tests/wordMatcher.test.ts)
```

## Architecture

### Dual-Text Data System

The app uses two parallel Quran text sources:

- `quran-uthmani-list.json` - Full Uthmani script with diacritics (tashkeel) for **display**
- `quran-simple-clean-list.json` - Simplified Arabic without diacritics for **speech matching**

Both are 2D arrays: `[surahIndex][verseIndex] = verseText`. The `dataProcessor.ts` merges them into a unified structure where each word has both `uthmani` and `simple` variants.

### Key Services (Singletons)

**QuranDataService** (`src/lib/services/QuranDataService.ts`)

- Fetches and caches Quran data in IndexedDB
- Provides `getSurah()`, `getVerse()`, `getAllSurahs()`

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
2. `+page.svelte` passes transcript to `matchSpokenWords()` with current verse
3. Matched word indices stored in `highlightedWords` state (GlobalVerseKey → Set of wordIndices)
4. When all words matched, ScrollStore triggers `advanceToNextVerse()`

## Type Definitions

All types in `src/lib/types/index.ts`:

- `Surah`, `Verse`, `Word` - Core data structures
- `SpeechRecognitionResult`, `SpeechRecognitionCallbacks` - Speech API types
- `GlobalHighlightedWords` - Map of GlobalVerseKey to Set of highlighted word indices
- `RenderableItem`, `LookupMaps` - Virtual scrolling support types

## Constants

`src/lib/utils/constants.ts` contains:

- `SURAH_NAMES` - Array of all 114 surahs with Arabic/English names and verse counts
- `LANGUAGE_CODE` - Arabic locale for speech recognition (`ar-SA`)
- `DB_NAME`, `DB_VERSION`, `STORE_NAME`, `CACHE_KEY` - IndexedDB configuration
