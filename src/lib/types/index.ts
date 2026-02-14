export interface Word {
	simple: string;
	normalizedSimple: string;
	uthmaniIndex: number; // index into verse.uthmani.split(/\s+/)
	globalIndex: number; // position in the full Quran word sequence
	verseKey: GlobalVerseKey; // which verse this word belongs to
}

export interface Verse {
	number: number;
	uthmani: string;
	words: Word[]; // one per simple word; uthmaniIndex points into uthmani.split(/\s+/)
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
	allWords: Word[]; // flat sequence of every word in the Quran, ordered by globalIndex
}

export interface QuranRawData {
	uthmani: string[][];
	simple: string[][];
}

export interface SpeechRecognitionConfig {
	language: string;
	continuous: boolean;
	interimResults: boolean;
}

export type RecognitionStatus = 'idle' | 'listening' | 'stopped' | 'error';

export interface SpeechRecognitionCallbacks {
	onResult?: (finalTranscript: string, interimTranscript: string) => void;
	onError?: (error: Error) => void;
	onEnd?: () => void;
	onStart?: () => void;
}

// Global addressing types for full Quran continuous scroll
export type GlobalVerseKey = `${number}:${number}`; // "surah:verse" e.g., "2:255"

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
}
