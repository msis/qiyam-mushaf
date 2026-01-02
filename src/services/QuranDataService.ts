import type { QuranData, QuranRawData, Surah, Verse } from '../types';
import { processQuranData, findSurahByNumber, findVerseByNumber } from '../utils/dataProcessor';
import { STORAGE_KEY } from '../utils/constants';

export class QuranDataService {
  private static instance: QuranDataService;
  private data: QuranData | null = null;
  private loadingPromise: Promise<QuranData> | null = null;

  private constructor() {}

  static getInstance(): QuranDataService {
    if (!QuranDataService.instance) {
      QuranDataService.instance = new QuranDataService();
    }
    return QuranDataService.instance;
  }

  async loadData(): Promise<QuranData> {
    if (this.data) {
      return this.data;
    }

    if (this.loadingPromise) {
      return this.loadingPromise;
    }

    try {
      const cached = this.loadFromCache();
      if (cached) {
        this.data = cached;
        return cached;
      }
    } catch (error) {
      console.warn('Failed to load from cache, fetching from files:', error);
    }

    this.loadingPromise = this.fetchAndProcessData();
    
    try {
      this.data = await this.loadingPromise;
      this.saveToCache(this.data);
      return this.data;
    } finally {
      this.loadingPromise = null;
    }
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

  private loadFromCache(): QuranData | null {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (error) {
      console.error('Error loading from cache:', error);
    }
    return null;
  }

  private saveToCache(data: QuranData): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to cache:', error);
    }
  }

  async getSurah(surahNumber: number): Promise<Surah | undefined> {
    const data = await this.loadData();
    return findSurahByNumber(surahNumber, data);
  }

  async getVerse(surahNumber: number, verseNumber: number): Promise<Verse | undefined> {
    const surah = await this.getSurah(surahNumber);
    if (!surah) return undefined;
    return findVerseByNumber(surah, verseNumber);
  }

  async getAllSurahs(): Promise<Surah[]> {
    const data = await this.loadData();
    return data.surahs;
  }

  clearCache(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.data = null;
  }
}
