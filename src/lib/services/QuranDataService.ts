import type { QuranData, QuranRawData } from '$lib/types';
import { processQuranData } from '$lib/utils/dataProcessor';
import { CACHE_KEY, CACHE_STORE } from '$lib/utils/constants';
import { getDB } from '$lib/services/db';

export class QuranDataService {
	private static instance: QuranDataService | undefined;
	private data: QuranData | null = null;
	private loadingPromise: Promise<QuranData> | null = null;

	private constructor() {}

	static getInstance(): QuranDataService {
		if (!QuranDataService.instance) {
			QuranDataService.instance = new QuranDataService();
		}
		return QuranDataService.instance;
	}

	static resetInstance(): void {
		QuranDataService.instance = undefined;
	}

	async loadData(): Promise<QuranData> {
		if (this.data) {
			return this.data;
		}

		if (this.loadingPromise) {
			return this.loadingPromise;
		}

		this.loadingPromise = this.loadDataInternal();

		try {
			this.data = await this.loadingPromise;
			return this.data;
		} finally {
			this.loadingPromise = null;
		}
	}

	private async loadDataInternal(): Promise<QuranData> {
		try {
			const cached = await this.loadFromCache();
			if (cached) {
				return cached;
			}
		} catch (error) {
			console.warn('Failed to load from cache, fetching from files:', error);
		}

		const data = await this.fetchAndProcessData();
		this.saveToCache(data);
		return data;
	}

	private async fetchAndProcessData(): Promise<QuranData> {
		const [uthmaniResponse, simpleResponse] = await Promise.all([
			fetch('/data/quran-uthmani-list.json'),
			fetch('/data/quran-simple-clean-list.json')
		]);

		if (!uthmaniResponse.ok || !simpleResponse.ok) {
			throw new Error('Failed to load Quran data files');
		}

		const rawData: QuranRawData = {
			uthmani: await uthmaniResponse.json(),
			simple: await simpleResponse.json()
		};

		return processQuranData(rawData);
	}

	private async loadFromCache(): Promise<QuranData | null> {
		const db = await getDB();
		return (await db.get(CACHE_STORE, CACHE_KEY)) ?? null;
	}

	private async saveToCache(data: QuranData): Promise<void> {
		try {
			const db = await getDB();
			await db.put(CACHE_STORE, data, CACHE_KEY);
		} catch (error) {
			console.error('Error saving to cache:', error);
		}
	}

	async clearCache(): Promise<void> {
		try {
			const db = await getDB();
			await db.delete(CACHE_STORE, CACHE_KEY);
			this.data = null;
		} catch (error) {
			console.error('Error clearing cache:', error);
		}
	}
}
