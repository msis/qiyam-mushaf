import type { Surah, GlobalVerseKey, RenderableItem, LookupMaps } from '$lib/types';

/**
 * Convert surah and verse numbers to a global key string
 */
export function toGlobalKey(surah: number, verse: number): GlobalVerseKey {
	return `${surah}:${verse}` as GlobalVerseKey;
}

/**
 * Parse a global key string back to surah and verse numbers
 */
export function fromGlobalKey(key: GlobalVerseKey): { surah: number; verse: number } {
	const parts = key.split(':').map(Number);
	return { surah: parts[0] ?? 0, verse: parts[1] ?? 0 };
}

/**
 * Build a flat array of renderable items from all surahs.
 * Items include surah headers, bismillahs (except surahs 1 and 9), and verses.
 * This structure is optimized for virtual scrolling.
 */
export function buildRenderableItems(surahs: Surah[]): RenderableItem[] {
	const items: RenderableItem[] = [];
	let flatIndex = 0;

	for (const surah of surahs) {
		// Add surah header
		items.push({
			type: 'surah-header',
			index: flatIndex++,
			surahNumber: surah.number,
			surahData: surah
		});

		// Add bismillah for all surahs except Al-Fatiha (1) and At-Tawbah (9)
		// Al-Fatiha's bismillah is part of verse 1, At-Tawbah has no bismillah
		if (surah.number !== 1 && surah.number !== 9) {
			items.push({
				type: 'bismillah',
				index: flatIndex++,
				surahNumber: surah.number
			});
		}

		// Add all verses
		for (const verse of surah.verses) {
			items.push({
				type: 'verse',
				index: flatIndex++,
				surahNumber: surah.number,
				verse: verse,
				verseKey: toGlobalKey(surah.number, verse.number)
			});
		}
	}

	return items;
}

/**
 * Build O(1) lookup maps for fast conversion between global keys and flat indices.
 * - keyToIndex: "2:255" → flat index number
 * - indexToKey: flat index → { surah, verse } (only for verse items)
 */
export function buildLookupMaps(items: RenderableItem[]): LookupMaps {
	const keyToIndex = new Map<GlobalVerseKey, number>();
	const indexToKey = new Map<number, { surah: number; verse: number }>();

	for (const item of items) {
		if (item.type === 'verse') {
			keyToIndex.set(item.verseKey, item.index);
			indexToKey.set(item.index, {
				surah: item.surahNumber,
				verse: item.verse.number
			});
		}
	}

	return { keyToIndex, indexToKey };
}


