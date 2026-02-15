import type { Surah, Verse, Word, RenderableItem } from '$lib/types';
import { SURAH_NAMES } from '$lib/utils/constants';

export const mockSurahs: Surah[] = SURAH_NAMES.slice(0, 3).map((s) => ({
  ...s,
  verses: [],
}));

export const mockAlFatihah: Surah = {
  number: 1,
  name: 'الفاتحة',
  nameEn: 'Al-Fatiha',
  verseCount: 7,
  verses: [],
};

export const mockVerseAlFatihah1: Verse = {
  number: 1,
  uthmani: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
  words: [
    { simple: 'بسم', normalizedSimple: 'بسم', uthmaniIndex: 0, globalIndex: 0, verseKey: '1:1' },
    { simple: 'الله', normalizedSimple: 'الله', uthmaniIndex: 1, globalIndex: 1, verseKey: '1:1' },
    { simple: 'الرحمن', normalizedSimple: 'الرحمن', uthmaniIndex: 2, globalIndex: 2, verseKey: '1:1' },
    { simple: 'الرحيم', normalizedSimple: 'الرحيم', uthmaniIndex: 3, globalIndex: 3, verseKey: '1:1' },
  ],
};

export const mockVerseAlFatihah2: Verse = {
  number: 2,
  uthmani: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
  words: [
    { simple: 'الحمد', normalizedSimple: 'الحمد', uthmaniIndex: 0, globalIndex: 4, verseKey: '1:2' },
    { simple: 'لله', normalizedSimple: 'لله', uthmaniIndex: 1, globalIndex: 5, verseKey: '1:2' },
    { simple: 'رب', normalizedSimple: 'رب', uthmaniIndex: 2, globalIndex: 6, verseKey: '1:2' },
    { simple: 'العالمين', normalizedSimple: 'العالمين', uthmaniIndex: 3, globalIndex: 7, verseKey: '1:2' },
  ],
};

export const mockVerseAlKahf17: Verse = {
  number: 17,
  uthmani: 'وَتَرَى الشَّمْسَ إِذَا طَلَعَت تَّزَاوَرُ عَن كَهْفِهِمْ ذَاتَ الْيَمِينِ وَإِذَا غَرَبَت تَّقْرِضُهُمْ ذَاتَ الشِّمَالِ وَهُمْ فِي فَجْوَةٍ مِّنْهُ ۚ ذَٰلِكَ مِنْ آيَاتِ اللَّهِ ۗ مَن يَهْدِ اللَّهَ فَهُوَ الْمُهْتَدِ ۖ وَمَن يُضْلِلْ فَلَن تَجِدَ لَهُ وَلِيًّا مُّرْشِدًا',
  words: Array.from({ length: 30 }, (_, i) => ({
    simple: `word${i}`,
    normalizedSimple: `word${i}`,
    uthmaniIndex: i,
    globalIndex: 1000 + i,
    verseKey: '18:17',
  })),
};

export function createMockSurah(num: number, name: string, nameEn: string, verseCount: number): Surah {
  return {
    number: num,
    name,
    nameEn,
    verseCount,
    verses: Array.from({ length: verseCount }, (_, i) => ({
      number: i + 1,
      uthmani: `بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ${nameEn} verse ${i + 1}`,
      words: [
        { simple: 'بسم', normalizedSimple: 'بسم', uthmaniIndex: 0, globalIndex: i * 10, verseKey: `${num}:${i + 1}` },
        { simple: 'الله', normalizedSimple: 'الله', uthmaniIndex: 1, globalIndex: i * 10 + 1, verseKey: `${num}:${i + 1}` },
      ],
    })),
  };
}

export const mockRenderableItems: RenderableItem[] = [
  { index: 0, surahNumber: 1, type: 'surah-header', surahData: mockAlFatihah },
  { index: 1, surahNumber: 1, type: 'bismillah' },
  { index: 2, surahNumber: 1, type: 'verse', verse: mockVerseAlFatihah1, verseKey: '1:1' },
  { index: 3, surahNumber: 1, type: 'verse', verse: mockVerseAlFatihah2, verseKey: '1:2' },
];
