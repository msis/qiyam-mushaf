import { describe, test, expect } from 'bun:test';
import {
  toGlobalKey,
  fromGlobalKey,
  buildRenderableItems,
  buildLookupMaps,
  getNextVerse,
} from '../src/utils/globalAddressing';
import type { Surah, Verse, Word } from '../src/types';

// Helper to create mock surah data
function createMockSurah(number: number, verseCount: number): Surah {
  const verses: Verse[] = [];
  for (let i = 1; i <= verseCount; i++) {
    const words: Word[] = [
      { uthmani: `word${i}`, simple: `word${i}`, highlighted: false },
    ];
    verses.push({
      number: i,
      uthmani: `verse${i}`,
      simple: `verse${i}`,
      words,
    });
  }
  return {
    number,
    name: `Surah${number}`,
    nameEn: `Surah ${number}`,
    verses,
    verseCount,
  };
}

describe('toGlobalKey', () => {
  test('creates correct key format', () => {
    expect(toGlobalKey(2, 255)).toBe('2:255');
    expect(toGlobalKey(1, 1)).toBe('1:1');
    expect(toGlobalKey(114, 6)).toBe('114:6');
  });
});

describe('fromGlobalKey', () => {
  test('parses key correctly', () => {
    expect(fromGlobalKey('2:255')).toEqual({ surah: 2, verse: 255 });
    expect(fromGlobalKey('1:1')).toEqual({ surah: 1, verse: 1 });
    expect(fromGlobalKey('114:6')).toEqual({ surah: 114, verse: 6 });
  });
});

describe('buildRenderableItems', () => {
  test('creates correct structure for single surah', () => {
    const surahs = [createMockSurah(1, 7)]; // Al-Fatiha has 7 verses, no bismillah (it's verse 1)
    const items = buildRenderableItems(surahs);

    // Surah 1: header + 7 verses (no separate bismillah)
    expect(items.length).toBe(8);
    expect(items[0].type).toBe('surah-header');
    expect(items[0].surahNumber).toBe(1);
    expect(items[1].type).toBe('verse');
    expect(items[1].verseKey).toBe('1:1');
    expect(items[7].verseKey).toBe('1:7');
  });

  test('adds bismillah for surahs except 1 and 9', () => {
    const surahs = [
      createMockSurah(1, 7),  // No bismillah
      createMockSurah(2, 3),  // Has bismillah
      createMockSurah(9, 2),  // No bismillah (At-Tawbah)
    ];
    const items = buildRenderableItems(surahs);

    // Surah 1: header + 7 verses = 8
    // Surah 2: header + bismillah + 3 verses = 5
    // Surah 9: header + 2 verses = 3
    expect(items.length).toBe(16);

    // Check surah 2 has bismillah
    const surah2HeaderIdx = 8; // After surah 1's 8 items
    expect(items[surah2HeaderIdx].type).toBe('surah-header');
    expect(items[surah2HeaderIdx].surahNumber).toBe(2);
    expect(items[surah2HeaderIdx + 1].type).toBe('bismillah');
    expect(items[surah2HeaderIdx + 2].type).toBe('verse');

    // Check surah 9 has no bismillah
    const surah9HeaderIdx = 13; // After surah 1 (8) + surah 2 (5) items
    expect(items[surah9HeaderIdx].type).toBe('surah-header');
    expect(items[surah9HeaderIdx].surahNumber).toBe(9);
    expect(items[surah9HeaderIdx + 1].type).toBe('verse');
  });

  test('assigns sequential flat indices', () => {
    const surahs = [createMockSurah(1, 3), createMockSurah(2, 2)];
    const items = buildRenderableItems(surahs);

    for (let i = 0; i < items.length; i++) {
      expect(items[i].index).toBe(i);
    }
  });
});

describe('buildLookupMaps', () => {
  test('creates bidirectional mapping for verses only', () => {
    const surahs = [createMockSurah(1, 3), createMockSurah(2, 2)];
    const items = buildRenderableItems(surahs);
    const maps = buildLookupMaps(items);

    // Check keyToIndex
    expect(maps.keyToIndex.get('1:1')).toBe(1); // index 0 is header
    expect(maps.keyToIndex.get('1:3')).toBe(3);
    expect(maps.keyToIndex.get('2:1')).toBe(6); // header at 4, bismillah at 5
    expect(maps.keyToIndex.get('2:2')).toBe(7);

    // Check indexToKey
    expect(maps.indexToKey.get(1)).toEqual({ surah: 1, verse: 1 });
    expect(maps.indexToKey.get(6)).toEqual({ surah: 2, verse: 1 });

    // Headers and bismillahs should not be in indexToKey
    expect(maps.indexToKey.get(0)).toBeUndefined(); // header
    expect(maps.indexToKey.get(5)).toBeUndefined(); // bismillah
  });
});

describe('getNextVerse', () => {
  const surahs = [
    createMockSurah(1, 7),
    createMockSurah(2, 286),
  ];

  test('returns next verse within same surah', () => {
    expect(getNextVerse(surahs, 1, 1)).toEqual({ surah: 1, verse: 2 });
    expect(getNextVerse(surahs, 1, 6)).toEqual({ surah: 1, verse: 7 });
    expect(getNextVerse(surahs, 2, 100)).toEqual({ surah: 2, verse: 101 });
  });

  test('crosses to next surah at end of current surah', () => {
    expect(getNextVerse(surahs, 1, 7)).toEqual({ surah: 2, verse: 1 });
  });

  test('returns null at end of Quran', () => {
    const fullSurahs = Array.from({ length: 114 }, (_, i) => createMockSurah(i + 1, 6));
    expect(getNextVerse(fullSurahs, 114, 6)).toBeNull();
  });

  test('returns null for invalid surah', () => {
    expect(getNextVerse(surahs, 999, 1)).toBeNull();
  });
});
