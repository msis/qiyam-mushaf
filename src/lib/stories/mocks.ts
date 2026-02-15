import type { Surah, Verse, RenderableItem, QuranRawData } from '$lib/types';
import { SURAH_NAMES } from '$lib/utils/constants';
import { processQuranData } from '$lib/utils/dataProcessor';
import uthmaniData from '$lib/../data/quran-uthmani-list.json?raw';
import simpleData from '$lib/../data/quran-simple-clean-list.json?raw';

// Process real Quran data once
const rawData: QuranRawData = {
  uthmani: JSON.parse(uthmaniData) as string[][],
  simple: JSON.parse(simpleData) as string[][],
};

const quranData = processQuranData(rawData);

// Export surahs array
export const mockSurahs: Surah[] = quranData.surahs.slice(0, 3);

// Export specific surahs
export const mockAlFatihah: Surah = quranData.surahs[0];
export const mockAlBaqara: Surah = quranData.surahs[1];
export const mockYaSin: Surah = quranData.surahs[35];

// Export specific verses from Al-Fatiha
export const mockVerseAlFatihah1: Verse = quranData.surahs[0].verses[0];
export const mockVerseAlFatihah2: Verse = quranData.surahs[0].verses[1];

// Export a longer verse (Al-Kahf 18:17 - verse index 16 in surah 17)
export const mockVerseAlKahf17: Verse = quranData.surahs[17].verses[16];

// Export renderable items for virtual list stories
export const mockRenderableItems: RenderableItem[] = [
  { index: 0, surahNumber: 1, type: 'surah-header', surahData: mockAlFatihah },
  { index: 1, surahNumber: 1, type: 'bismillah' },
  { index: 2, surahNumber: 1, type: 'verse', verse: mockVerseAlFatihah1, verseKey: '1:1' },
  { index: 3, surahNumber: 1, type: 'verse', verse: mockVerseAlFatihah2, verseKey: '1:2' },
];
