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

## Technical Stack

- **Frontend Framework**: React
- **Styling**: Tailwind CSS (via CDN)
- **Speech Recognition**: Web Speech API (built-in browser API)
- **Language**: TypeScript
- **Runtime**: Bun

## Project Structure

```
taraweeh-mushaf/
├── public/
│   └── data/
│       ├── quran-uthmani-list.json          # Quran text with tashkeel (for display)
│       └── quran-simple-clean-list.json     # Quran text without tashkeel (for speech recognition)
├── src/
│   ├── components/
│   │   └── NavigationModal.tsx             # Modal for surah/verse selection
│   ├── services/
│   │   ├── QuranDataService.ts             # Load and cache Quran data
│   │   └── SpeechRecognitionService.ts      # Handle speech recognition
│   ├── utils/
│   │   ├── dataProcessor.ts                 # Prepare data structure
│   │   └── constants.ts                     # Surah names, verses counts, etc.
│   ├── types/
│   │   └── index.ts                         # TypeScript type definitions
│   ├── App.tsx                              # Main application component
│   ├── index.tsx                            # Entry point
│   └── index.css                            # Global styles
├── tests/                                    # Test files
├── package.json
├── bun.lock
├── tsconfig.json
└── README.md
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
  [
    "ٱلْم",
    "ذَٰلِكَ ٱلْكِتَـٰبُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ"
  ]
]
```

- **quran-uthmani-list.json**: Contains Uthmani text with full diacritics (tashkeel) for display
- **quran-simple-clean-list.json**: Contains simplified Arabic without diacritics for speech recognition

### Internal Data Structure

```typescript
interface Verse {
  number: number;
  uthmani: string;
  simple: string;
  words: Word[];
}

interface Word {
  uthmani: string;
  simple: string;
  highlighted: boolean;
}

interface Surah {
  number: number;
  name: string;
  nameEn: string;
  verses: Verse[];
  verseCount: number;
}
```

## Architecture

### Data Layer

**QuranDataService**
- Loads both JSON files from `public/data/`
- Caches data in `localStorage` for offline use
- Provides methods to get Surah/Verse data

**Data Processing**
- Merges Uthmani and simple text into unified structure
- Splits verses into words for word-by-word highlighting
- Creates mapping between display and recognition words

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
- `App`: Main application with Quran display and controls

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
bun start
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
- **Offline**: Works offline after initial data load (cached in localStorage)

## Testing

```bash
# Run tests
bun test

# Run linter
bun run lint

# Type check
bun run type-check
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

- [ ] Word-by-word highlighting while reading
- [ ] Add multiple recitations (audio playback)
- [ ] Translation display
- [ ] Reading speed adjustment
- [ ] Bookmarking capabilities
- [ ] Dark/Light mode toggle
- [ ] Support for more browsers (using Web Speech API polyfills)
