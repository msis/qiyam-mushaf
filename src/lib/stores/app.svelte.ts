import type {
	Surah,
	RenderableItem,
	LookupMaps,
	GlobalHighlightedWords,
	GlobalVerseKey,
	RecognitionStatus
} from '$lib/types';
import { toGlobalKey } from '$lib/utils/globalAddressing';

/**
 * Main application state using Svelte 5 runes.
 * This class holds all the reactive state that was previously in React's App.tsx useState hooks.
 */
class AppState {
	// Data state
	allSurahs = $state<Surah[]>([]);
	renderableItems = $state<RenderableItem[]>([]);
	lookupMaps = $state<LookupMaps | null>(null);

	// Position state
	currentSurahNum = $state(1);
	currentVerseNum = $state(1);

	// UI state
	loading = $state(true);
	error = $state<string | null>(null);
	recognitionStatus = $state<RecognitionStatus>('idle');
	isModalOpen = $state(false);
	highlightedWords = $state<GlobalHighlightedWords>({});

	// Derived state (replaces React useMemo)
	get currentVerseKey(): GlobalVerseKey | null {
		if (this.currentSurahNum > 0 && this.currentVerseNum > 0) {
			return toGlobalKey(this.currentSurahNum, this.currentVerseNum);
		}
		return null;
	}

	get currentSurah(): Surah | null {
		return this.allSurahs[this.currentSurahNum - 1] || null;
	}

	// Methods for state mutations
	setPosition(surah: number, verse: number): void {
		this.currentSurahNum = surah;
		this.currentVerseNum = verse;
		// Clear highlights when navigating to a new verse
		this.highlightedWords = {};
	}

	addHighlights(verseKey: GlobalVerseKey, wordIndices: Set<number>): void {
		this.highlightedWords = {
			...this.highlightedWords,
			[verseKey]: wordIndices
		};
	}

	clearHighlights(): void {
		this.highlightedWords = {};
	}

	reset(): void {
		this.currentSurahNum = 1;
		this.currentVerseNum = 1;
		this.highlightedWords = {};
		this.recognitionStatus = 'idle';
		this.isModalOpen = false;
	}
}

// Create a singleton instance for app-wide state
export const appState = new AppState();

// Factory function for testing (creates fresh instances)
export function createAppState(): AppState {
	return new AppState();
}
