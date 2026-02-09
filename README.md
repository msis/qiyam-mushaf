# Quran Teleprompter Web App

A minimalist, modern web application that helps users read the Quran by automatically scrolling and highlighting words as they read aloud using speech recognition.

## Features

- **Complete Quran Display**: All 114 Surahs with all verses
- **Surah and Verse Selection**: Navigate through Surahs and verses via modal menu
- **Real-time Speech Recognition**: Uses Web Speech API to recognize spoken words
- **Microphone Control**: Easy toggle button to start/stop recording
- **Current Verse Highlighting**: Current verse is clearly highlighted, others grayed out
- **Auto-scrolling**: Automatically scrolls to current verse
- **Offline Support**: Quran data is embedded and cached in the browser
- **Minimalist Design**: Clean, modern interface optimized for reading Arabic text (RTL)
- **Responsive**: Works on desktop and mobile devices
- **Virtual Scrolling**: Smooth scrolling through 6000+ items using [virtua](https://github.com/inokawa/virtua)
- **PWA**: Installable with manifest, standalone mode, portrait orientation

## Technical Stack

- **Framework**: SvelteKit 2 + Svelte 5 (runes)
- **Styling**: Tailwind CSS v4
- **Speech Recognition**: Web Speech API (built-in browser API)
- **Language**: TypeScript
- **Runtime**: Bun
- **Build**: Vite 6, adapter-static (SPA fallback)

## Project Structure

```
src/
├── routes/
│   ├── +page.ts                  # Load function: fetches data, builds lookup maps
│   ├── +page.svelte              # Main UI: speech matching, navigation, effects
│   ├── +layout.svelte            # Root layout (imports app.css)
│   └── +error.svelte             # Error page (404, 500)
├── lib/
│   ├── components/
│   │   ├── QuranVirtualList.svelte  # Virtual scroll container (virtua)
│   │   ├── VerseRow.svelte          # Single verse with word highlighting
│   │   ├── SurahHeader.svelte       # Surah title display
│   │   ├── Bismillah.svelte         # Bismillah separator
│   │   └── NavigationModal.svelte   # Surah/verse picker modal
│   ├── services/
│   │   ├── QuranDataService.ts      # Fetch + IndexedDB cache (singleton)
│   │   └── SpeechRecognitionService.ts  # Web Speech API wrapper (singleton)
│   ├── stores/
│   │   ├── app.svelte.ts            # Position, highlights, modal state
│   │   └── speech.svelte.ts         # Reactive wrapper for speech service
│   ├── types/
│   │   └── index.ts                 # All TypeScript interfaces
│   └── utils/
│       ├── wordMatcher.ts           # Arabic normalization + Levenshtein matching
│       ├── dataProcessor.ts         # Merge uthmani/simple into Word[] structs
│       ├── globalAddressing.ts      # Flat index ↔ GlobalVerseKey maps
│       └── constants.ts             # Surah names, DB config, thresholds
├── service-worker.ts             # Cache-first for assets, network-first for dynamic
├── app.css                       # Tailwind v4 config, Amiri font, custom utilities
└── app.html                      # HTML shell (RTL, meta tags, manifest link)

static/
├── data/
│   ├── quran-uthmani-list.json   # Display text (with tashkeel)
│   └── quran-simple-clean-list.json  # Speech matching text (no tashkeel)
├── manifest.json                 # PWA manifest
├── favicon.png
└── icons/                        # PWA icons (192, 512, maskable)
```

## Data Structure

### Quran JSON Format

Both `quran-uthmani-list.json` and `quran-simple-clean-list.json` are arrays of 114 elements (one per Surah):

```json
[
  [
    "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ",
    "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ"
  ],
  ["ٱلْم", "ذَٰلِكَ ٱلْكِتَـٰبُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ"]
]
```

- **quran-uthmani-list.json**: Contains Uthmani text with full diacritics (tashkeel) for display
- **quran-simple-clean-list.json**: Contains simplified Arabic without diacritics for speech recognition

### Internal Data Structure

```typescript
interface Word {
  simple: string;            // simple-script word (for matching)
  normalizedSimple: string;  // pre-normalized for Levenshtein comparison
  uthmaniIndex: number;      // index into verse.uthmani.split(/\s+/)
}

interface Verse {
  number: number;
  uthmani: string;           // full uthmani text (display source)
  words: Word[];             // one per simple word, maps to uthmani tokens
}

interface Surah {
  number: number;
  name: string;
  nameEn: string;
  verses: Verse[];
  verseCount: number;
}
```

The mapping from simple words to uthmani tokens is many-to-one:
- **Vocative merges** (e.g. يَـٰٓأَيُّهَا = يا + أيها): two `Word` entries share the same `uthmaniIndex`
- **Tajweed marks** (e.g. ۖ ۗ ۞): uthmani tokens with no `Word` pointing to them
- Display iterates `uthmani.split(/\s+/)`, highlighting converts simple indices → uthmani indices

## Architecture

### Data Layer

**QuranDataService**

- Loads both JSON files from `static/data/`
- Caches data in `IndexedDB` for offline use
- Provides methods to get Surah/Verse data

**Data Processing** (`dataProcessor.ts`)

- Builds a many-to-one mapping from simple words → uthmani token indices
- Handles tajweed marks (9 codepoints, skipped) and vocative/demonstrative merges (split into 2 simple words sharing one uthmani index)
- Pre-computes `normalizedSimple` on each word to avoid per-speech-event normalization

### Speech Recognition Layer

**SpeechRecognitionService**

- Wraps Web Speech API
- Handles Arabic language (`ar-SA`)
- Emits events for:
  - `onResult`: When speech is recognized
  - `onError`: When recognition fails
  - `onEnd`: When recognition stops

### UI Layer

**Components**

- `NavigationModal`: Modal with Surah and Verse dropdowns
- `+page.svelte`: Main application with Quran display and controls

**Controls**

- Burger menu (top-right) - Opens navigation modal
- Microphone button (bottom-center) - Starts/stops speech recognition

**Styling**

- Tailwind CSS for utility classes
- RTL (Right-to-Left) text direction
- Arabic font (Amiri)
- Dark theme optimized for reading
- Current verse highlighted in amber color
- Other verses grayed out

### Scroll Management

- Current verse automatically scrolls into view (centered)
- Smooth scrolling animation

## Getting Started

### Prerequisites

- Bun (latest version)

### Installation

```bash
# Install dependencies
bun install
```

### Running the App

```bash
# Start development server
bun dev

# Build for production
bun run build

# Preview production build
bun preview
```

### Browser Requirements

The Web Speech API requires:

- **Chrome/Edge**: Full support (recommended)
- **Safari**: Limited support, may require user permission
- **Firefox**: No support for Web Speech API

**Note**: Speech recognition requires microphone access and HTTPS (or localhost).

## Usage

1. **Open Navigation**: Click the burger menu (☰) in the top-right corner
2. **Select Surah**: Choose from 114 Surahs in the dropdown
3. **Select Verse**: Choose the starting verse
4. **Close Modal**: Click "Go to Verse" or the × button
5. **Start Reading**: Click the microphone button at the bottom to begin speech recognition
6. **Read Aloud**: Read the Quran aloud; the current verse is highlighted
7. **Stop**: Click the microphone button again to pause recognition
8. **Navigate**: Open the modal to jump to another surah/verse

## UI Features

- **Complete Surah Display**: All verses of the selected Surah are shown
- **Verse Highlighting**: Current verse is displayed in amber color with larger scale
- **Grayed Verses**: Other verses are displayed in gray color
- **Auto-scroll**: Current verse automatically scrolls into view
- **Responsive Design**: Adapts to mobile and desktop screens
- **Minimalist Controls**: Clean interface with easy-to-reach buttons

## Known Limitations

- **Browser Support**: Web Speech API not supported in Firefox
- **Accuracy**: Speech recognition accuracy varies based on pronunciation and microphone quality
- **Partial Matches**: The app handles partial matches but may miss some words
- **Offline**: Works offline after initial data load (cached in IndexedDB)

## Testing

```bash
# Run tests
bun test

# Type check
bun run check
```

## Contributing

This is a personal project, but contributions are welcome:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

[Add your license here]

## Credits

- Quran text: [Tanzil Project](https://tanzil.net/)
- Styling: Tailwind CSS
- Icons: SVG icons

## Future Enhancements

- [x] Word-by-word highlighting while reading
- [ ] Add multiple recitations (audio playback)
- [ ] Translation display
- [ ] Reading speed adjustment
- [ ] Bookmarking capabilities
- [ ] Dark/Light mode toggle
- [ ] Support for more browsers (using Web Speech API polyfills)
