import { GlobalScrollManager, type GlobalScrollManagerConfig } from '$lib/services/GlobalScrollManager';
import type { Surah, LookupMaps, GlobalHighlightedWords } from '$lib/types';

/**
 * Reactive wrapper around GlobalScrollManager.
 * Manages verse advancement and scroll position.
 */
class ScrollStore {
	private manager: GlobalScrollManager;

	// Reactive state for position tracking
	currentSurah = $state(1);
	currentVerse = $state(1);

	constructor(config?: GlobalScrollManagerConfig) {
		this.manager = new GlobalScrollManager({
			...config,
			onVerseChange: (surah, verse) => {
				this.currentSurah = surah;
				this.currentVerse = verse;
				config?.onVerseChange?.(surah, verse);
			}
		});
	}

	setSurahs(surahs: Surah[]): void {
		this.manager.setSurahs(surahs);
	}

	setLookupMaps(maps: LookupMaps): void {
		this.manager.setLookupMaps(maps);
	}

	setCurrentPosition(surah: number, verse: number): void {
		this.currentSurah = surah;
		this.currentVerse = verse;
		this.manager.setCurrentPosition(surah, verse);
	}

	getCurrentPosition(): { surah: number; verse: number } {
		return this.manager.getCurrentPosition();
	}

	checkShouldAdvance(highlightedWords: GlobalHighlightedWords): boolean {
		return this.manager.checkShouldAdvance(highlightedWords);
	}

	advanceToNextVerse(highlightedWords: GlobalHighlightedWords): void {
		this.manager.advanceToNextVerse(highlightedWords);
	}

	scrollToCurrentVerse(): void {
		this.manager.scrollToCurrentVerse();
	}

	navigateTo(surah: number, verse: number): void {
		this.currentSurah = surah;
		this.currentVerse = verse;
		this.manager.navigateTo(surah, verse);
	}

	updateConfig(config: Partial<GlobalScrollManagerConfig>): void {
		this.manager.updateConfig(config);
	}

	// Convenience method to set up scroll callback
	setScrollCallback(callback: (index: number) => void): void {
		this.manager.updateConfig({ onScrollToIndex: callback });
	}
}

// Factory function - creates instances with specific config
export function createScrollStore(config?: GlobalScrollManagerConfig): ScrollStore {
	return new ScrollStore(config);
}
