export interface Word {
	uthmani: string;
	simple: string;
	highlighted: boolean;
}

export interface Verse {
	number: number;
	uthmani: string;
	simple: string;
	words: Word[];
}

export interface Surah {
	number: number;
	name: string;
	nameEn: string;
	verses: Verse[];
	verseCount: number;
}

export interface QuranData {
	surahs: Surah[];
}

export interface QuranRawData {
	uthmani: string[][];
	simple: string[][];
}

export interface SpeechRecognitionResult {
	transcript: string;
	confidence: number;
	isFinal: boolean;
}

export interface SpeechRecognitionConfig {
	language: string;
	continuous: boolean;
	interimResults: boolean;
}

export type RecognitionStatus = 'idle' | 'listening' | 'stopped' | 'error';

export interface SpeechRecognitionCallbacks {
	onResult?: (result: SpeechRecognitionResult) => void;
	onError?: (error: Error) => void;
	onEnd?: () => void;
	onStart?: () => void;
}

// Global addressing types for full Quran continuous scroll
export type GlobalVerseKey = `${number}:${number}`; // "surah:verse" e.g., "2:255"

export interface GlobalHighlightedWords {
	[verseKey: GlobalVerseKey]: Set<number>;
}

export type RenderableItemType = 'surah-header' | 'bismillah' | 'verse';

export interface RenderableItem {
	type: RenderableItemType;
	index: number; // flat index (0 to ~6400)
	surahNumber: number;
	// Only for type === 'verse' (speech recognition targets these only):
	verse?: Verse;
	verseKey?: GlobalVerseKey;
	// Only for type === 'surah-header' (display only, no speech):
	surahData?: Surah;
	// type === 'bismillah' has no extra fields (display only, no speech)
}

export interface LookupMaps {
	keyToIndex: Map<GlobalVerseKey, number>;
	indexToKey: Map<number, { surah: number; verse: number }>;
}
