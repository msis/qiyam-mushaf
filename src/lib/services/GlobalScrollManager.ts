import type { Surah, GlobalHighlightedWords, GlobalVerseKey, LookupMaps } from '$lib/types';
import { toGlobalKey, getNextVerse, findVerseIndex } from '$lib/utils/globalAddressing';

export interface GlobalScrollManagerConfig {
	autoAdvance?: boolean;
	onVerseChange?: (surah: number, verse: number) => void;
	onScrollToIndex?: (index: number) => void;
}

export class GlobalScrollManager {
	private config: GlobalScrollManagerConfig;
	private currentSurah: number = 1;
	private currentVerse: number = 1;
	private allSurahs: Surah[] = [];
	private lookupMaps: LookupMaps | null = null;

	constructor(config: GlobalScrollManagerConfig = {}) {
		this.config = {
			autoAdvance: true,
			...config
		};
	}

	setSurahs(surahs: Surah[]): void {
		this.allSurahs = surahs;
	}

	setLookupMaps(maps: LookupMaps): void {
		this.lookupMaps = maps;
	}

	setCurrentPosition(surah: number, verse: number): void {
		this.currentSurah = surah;
		this.currentVerse = verse;
	}

	getCurrentPosition(): { surah: number; verse: number } {
		return { surah: this.currentSurah, verse: this.currentVerse };
	}

	getCurrentVerseKey(): GlobalVerseKey {
		return toGlobalKey(this.currentSurah, this.currentVerse);
	}

	/**
	 * Check if all words in the current verse have been highlighted.
	 */
	checkShouldAdvance(highlightedWords: GlobalHighlightedWords): boolean {
		if (!this.config.autoAdvance) {
			return false;
		}

		const currentKey = this.getCurrentVerseKey();
		const verseHighlights = highlightedWords[currentKey];

		if (!verseHighlights) {
			return false;
		}

		// Get the current verse's word count
		const surahIndex = this.currentSurah - 1;
		const surah = this.allSurahs[surahIndex];
		if (!surah) {
			return false;
		}

		const verseIndex = this.currentVerse - 1;
		const verse = surah.verses[verseIndex];
		if (!verse) {
			return false;
		}

		const totalWords = verse.words.filter((w) => w.simple.length > 0).length;
		const highlightedCount = verseHighlights.size;

		return highlightedCount >= totalWords;
	}

	/**
	 * Advance to the next verse if conditions are met.
	 * Handles cross-surah boundaries automatically.
	 */
	advanceToNextVerse(highlightedWords: GlobalHighlightedWords): void {
		if (!this.checkShouldAdvance(highlightedWords)) {
			return;
		}

		const next = getNextVerse(this.allSurahs, this.currentSurah, this.currentVerse);

		if (!next) {
			// End of Quran reached
			return;
		}

		this.currentSurah = next.surah;
		this.currentVerse = next.verse;

		// Notify about the verse change
		this.config.onVerseChange?.(this.currentSurah, this.currentVerse);

		// Scroll to the new verse
		this.scrollToCurrentVerse();
	}

	/**
	 * Scroll to the current verse position.
	 */
	scrollToCurrentVerse(): void {
		if (!this.lookupMaps) {
			return;
		}

		const index = findVerseIndex(this.lookupMaps, this.currentSurah, this.currentVerse);
		if (index !== undefined) {
			this.config.onScrollToIndex?.(index);
		}
	}

	/**
	 * Navigate to a specific verse (e.g., from navigation modal).
	 */
	navigateTo(surah: number, verse: number): void {
		this.currentSurah = surah;
		this.currentVerse = verse;
		this.scrollToCurrentVerse();
	}

	updateConfig(config: Partial<GlobalScrollManagerConfig>): void {
		this.config = { ...this.config, ...config };
	}
}
