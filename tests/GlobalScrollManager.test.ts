import { describe, test, expect, mock } from 'bun:test';
import { GlobalScrollManager } from '../src/services/GlobalScrollManager';
import { buildRenderableItems, buildLookupMaps, toGlobalKey } from '../src/utils/globalAddressing';
import type { Surah, Verse, Word, GlobalHighlightedWords } from '../src/types';

// Helper to create mock surah data
function createMockSurah(number: number, verseCount: number, wordsPerVerse: number = 3): Surah {
  const verses: Verse[] = [];
  for (let i = 1; i <= verseCount; i++) {
    const words: Word[] = [];
    for (let w = 0; w < wordsPerVerse; w++) {
      words.push({ uthmani: `word${w}`, simple: `word${w}`, highlighted: false });
    }
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

describe('GlobalScrollManager', () => {
  test('initializes with default position', () => {
    const manager = new GlobalScrollManager();
    expect(manager.getCurrentPosition()).toEqual({ surah: 1, verse: 1 });
    expect(manager.getCurrentVerseKey()).toBe('1:1');
  });

  test('setCurrentPosition updates position', () => {
    const manager = new GlobalScrollManager();
    manager.setCurrentPosition(2, 255);
    expect(manager.getCurrentPosition()).toEqual({ surah: 2, verse: 255 });
    expect(manager.getCurrentVerseKey()).toBe('2:255');
  });

  test('checkShouldAdvance returns false when not all words highlighted', () => {
    const surahs = [createMockSurah(1, 7, 4)]; // 4 words per verse
    const manager = new GlobalScrollManager();
    manager.setSurahs(surahs);
    manager.setCurrentPosition(1, 1);

    // Only 2 of 4 words highlighted
    const highlights: GlobalHighlightedWords = {
      '1:1': new Set([0, 1]),
    };

    expect(manager.checkShouldAdvance(highlights)).toBe(false);
  });

  test('checkShouldAdvance returns true when all words highlighted', () => {
    const surahs = [createMockSurah(1, 7, 4)]; // 4 words per verse
    const manager = new GlobalScrollManager();
    manager.setSurahs(surahs);
    manager.setCurrentPosition(1, 1);

    // All 4 words highlighted
    const highlights: GlobalHighlightedWords = {
      '1:1': new Set([0, 1, 2, 3]),
    };

    expect(manager.checkShouldAdvance(highlights)).toBe(true);
  });

  test('checkShouldAdvance returns false when autoAdvance is disabled', () => {
    const surahs = [createMockSurah(1, 7, 2)];
    const manager = new GlobalScrollManager({ autoAdvance: false });
    manager.setSurahs(surahs);
    manager.setCurrentPosition(1, 1);

    const highlights: GlobalHighlightedWords = {
      '1:1': new Set([0, 1]),
    };

    expect(manager.checkShouldAdvance(highlights)).toBe(false);
  });

  test('advanceToNextVerse moves to next verse within surah', () => {
    const surahs = [createMockSurah(1, 7, 2)];
    const items = buildRenderableItems(surahs);
    const lookupMaps = buildLookupMaps(items);

    const onVerseChange = mock(() => {});
    const manager = new GlobalScrollManager({ onVerseChange });
    manager.setSurahs(surahs);
    manager.setLookupMaps(lookupMaps);
    manager.setCurrentPosition(1, 1);

    const highlights: GlobalHighlightedWords = {
      '1:1': new Set([0, 1]),
    };

    manager.advanceToNextVerse(highlights);

    expect(manager.getCurrentPosition()).toEqual({ surah: 1, verse: 2 });
    expect(onVerseChange).toHaveBeenCalledWith(1, 2);
  });

  test('advanceToNextVerse crosses surah boundary', () => {
    const surahs = [createMockSurah(1, 7, 2), createMockSurah(2, 5, 2)];
    const items = buildRenderableItems(surahs);
    const lookupMaps = buildLookupMaps(items);

    const onVerseChange = mock(() => {});
    const manager = new GlobalScrollManager({ onVerseChange });
    manager.setSurahs(surahs);
    manager.setLookupMaps(lookupMaps);
    manager.setCurrentPosition(1, 7); // Last verse of surah 1

    const highlights: GlobalHighlightedWords = {
      '1:7': new Set([0, 1]),
    };

    manager.advanceToNextVerse(highlights);

    expect(manager.getCurrentPosition()).toEqual({ surah: 2, verse: 1 });
    expect(onVerseChange).toHaveBeenCalledWith(2, 1);
  });

  test('advanceToNextVerse does nothing at end of Quran', () => {
    const surahs = Array.from({ length: 114 }, (_, i) => createMockSurah(i + 1, 6, 2));
    const items = buildRenderableItems(surahs);
    const lookupMaps = buildLookupMaps(items);

    const onVerseChange = mock(() => {});
    const manager = new GlobalScrollManager({ onVerseChange });
    manager.setSurahs(surahs);
    manager.setLookupMaps(lookupMaps);
    manager.setCurrentPosition(114, 6); // Last verse of last surah

    const highlights: GlobalHighlightedWords = {
      '114:6': new Set([0, 1]),
    };

    manager.advanceToNextVerse(highlights);

    // Should stay at the same position
    expect(manager.getCurrentPosition()).toEqual({ surah: 114, verse: 6 });
    expect(onVerseChange).not.toHaveBeenCalled();
  });

  test('scrollToCurrentVerse calls onScrollToIndex with correct index', () => {
    const surahs = [createMockSurah(1, 7, 2), createMockSurah(2, 5, 2)];
    const items = buildRenderableItems(surahs);
    const lookupMaps = buildLookupMaps(items);

    const onScrollToIndex = mock(() => {});
    const manager = new GlobalScrollManager({ onScrollToIndex });
    manager.setSurahs(surahs);
    manager.setLookupMaps(lookupMaps);
    manager.setCurrentPosition(2, 1);

    manager.scrollToCurrentVerse();

    // Surah 1: header (0) + 7 verses (1-7) = indices 0-7
    // Surah 2: header (8) + bismillah (9) + verse 1 (10)
    expect(onScrollToIndex).toHaveBeenCalledWith(10);
  });
});
