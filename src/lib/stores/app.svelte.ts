import type { GlobalHighlightedWords, GlobalVerseKey } from '$lib/types';
import { toGlobalKey } from '$lib/utils/globalAddressing';

/**
 * Mutable application state using Svelte 5 runes.
 * Immutable data (surahs, renderableItems, lookupMaps) lives in +page.ts load data.
 */
class AppState {
	// Position state
	currentSurahNum = $state(1);
	currentVerseNum = $state(1);

	// UI state
	isModalOpen = $state(false);
	highlightedWords = $state<GlobalHighlightedWords>({});

	get currentVerseKey(): GlobalVerseKey | null {
		if (this.currentSurahNum > 0 && this.currentVerseNum > 0) {
			return toGlobalKey(this.currentSurahNum, this.currentVerseNum);
		}
		return null;
	}

	setPosition(surah: number, verse: number): void {
		this.currentSurahNum = surah;
		this.currentVerseNum = verse;
		this.highlightedWords = {};
	}

	clearHighlights(): void {
		this.highlightedWords = {};
	}

	reset(): void {
		this.currentSurahNum = 1;
		this.currentVerseNum = 1;
		this.highlightedWords = {};
		this.isModalOpen = false;
	}
}

export const appState = new AppState();
