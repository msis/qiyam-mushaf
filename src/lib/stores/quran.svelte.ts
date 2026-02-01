import { QuranDataService } from '$lib/services/QuranDataService';
import type { Surah, Verse } from '$lib/types';

/**
 * Reactive wrapper around QuranDataService.
 * Provides loading/error state that can be bound to UI components.
 */
class QuranStore {
	private service: QuranDataService;

	// Reactive state for UI
	loading = $state(false);
	error = $state<string | null>(null);

	constructor(service?: QuranDataService) {
		this.service = service ?? QuranDataService.getInstance();
	}

	async loadAllSurahs(): Promise<Surah[]> {
		this.loading = true;
		this.error = null;

		try {
			const surahs = await this.service.getAllSurahs();
			return surahs;
		} catch (err) {
			this.error = err instanceof Error ? err.message : 'Failed to load Quran data';
			throw err;
		} finally {
			this.loading = false;
		}
	}

	async getSurah(surahNumber: number): Promise<Surah | undefined> {
		return this.service.getSurah(surahNumber);
	}

	async getVerse(surahNumber: number, verseNumber: number): Promise<Verse | undefined> {
		return this.service.getVerse(surahNumber, verseNumber);
	}

	async clearCache(): Promise<void> {
		return this.service.clearCache();
	}
}

// Singleton instance
let quranStoreInstance: QuranStore | null = null;

export function getQuranStore(): QuranStore {
	if (!quranStoreInstance) {
		quranStoreInstance = new QuranStore();
	}
	return quranStoreInstance;
}

// Factory function for testing (creates fresh instances with optional mock service)
export function createQuranStore(service?: QuranDataService): QuranStore {
	return new QuranStore(service);
}
