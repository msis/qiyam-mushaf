export interface Word {
	uthmani: string;
	simple: string;
	normalizedSimple: string;
}

export interface Verse {
	number: number;
	uthmani: string;
	simple: string;
	words: Word[];
	simpleWordCount: number;
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

interface RenderableBase {
	index: number;
	surahNumber: number;
}

export type RenderableItem =
	| (RenderableBase & { type: 'surah-header'; surahData: Surah })
	| (RenderableBase & { type: 'bismillah' })
	| (RenderableBase & { type: 'verse'; verse: Verse; verseKey: GlobalVerseKey });

export interface LookupMaps {
	keyToIndex: Map<GlobalVerseKey, number>;
	indexToKey: Map<number, { surah: number; verse: number }>;
}
