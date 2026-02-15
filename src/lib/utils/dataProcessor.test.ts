import { describe, expect, it } from 'vitest';
import { processQuranData } from './dataProcessor';
import type { QuranRawData } from '$lib/types';
import uthmani from '../../../static/data/quran-uthmani-list.json';
import simple from '../../../static/data/quran-simple-clean-list.json';

const rawData: QuranRawData = { uthmani, simple };
const data = processQuranData(rawData);

describe('processQuranData', () => {
	it('produces 114 surahs', () => {
		expect(data.surahs).toHaveLength(114);
	});

	it('produces 6236 total verses', () => {
		const total = data.surahs.reduce((sum, s) => sum + s.verses.length, 0);
		expect(total).toBe(6236);
	});
});

describe('word mapping', () => {
	it('every verse has words.length === simple word count', () => {
		for (let i = 0; i < data.surahs.length; i++) {
			for (let j = 0; j < data.surahs[i].verses.length; j++) {
				const verse = data.surahs[i].verses[j];
				const expected = simple[i][j].trim().split(/\s+/).length;
				expect(verse.words.length, `${data.surahs[i].number}:${verse.number}`).toBe(expected);
			}
		}
	});

	it('every uthmaniIndex is within bounds', () => {
		for (const surah of data.surahs) {
			for (const verse of surah.verses) {
				const uthmaniLen = verse.uthmani.trim().split(/\s+/).length;
				for (const word of verse.words) {
					expect(word.uthmaniIndex, `${surah.number}:${verse.number}`).toBeGreaterThanOrEqual(0);
					expect(word.uthmaniIndex, `${surah.number}:${verse.number}`).toBeLessThan(uthmaniLen);
				}
			}
		}
	});

	it('globalIndex is contiguous, allWords matches, and verseKey is correct', () => {
		let expectedIdx = 0;
		for (const surah of data.surahs) {
			for (const verse of surah.verses) {
				const expectedKey = `${surah.number}:${verse.number}`;
				for (const word of verse.words) {
					expect(word.globalIndex, expectedKey).toBe(expectedIdx);
					expect(word.verseKey, expectedKey).toBe(expectedKey);
					expect(data.allWords[expectedIdx]).toBe(word);
					expectedIdx++;
				}
			}
		}
		expect(data.allWords).toHaveLength(expectedIdx);
	});

	it('every word has a non-empty normalizedSimple', () => {
		for (const surah of data.surahs) {
			for (const verse of surah.verses) {
				for (const word of verse.words) {
					if (word.simple) {
						expect(word.normalizedSimple, `${surah.number}:${verse.number}`).not.toBe('');
					}
				}
			}
		}
	});

	it('6234 verses have exact alignment, only 20:94 and 72:16 have a deficit', () => {
		// Recount expected simple words per uthmani token using the same rules as dataProcessor
		const MARKS = new Set(['\u06D6','\u06D7','\u06D8','\u06D9','\u06DA','\u06DB','\u06DC','\u06DE','\u06E9']);
		function expectedSimple(token: string): number {
			if ([...token].every((ch) => MARKS.has(ch))) return 0;
			if (/^يَـٰٓ?ـ?َ?ٔ?.+/.test(token)) return 2;
			if (/^وَيَـٰٓ?ـ?َ?ٔ?.+/.test(token)) return 2;
			if (token.startsWith('هَـٰٓأَ') || token.startsWith('هَـٰٓأُ')) return 2;
			return 1;
		}

		const deficitVerses: string[] = [];
		for (let i = 0; i < data.surahs.length; i++) {
			for (let j = 0; j < data.surahs[i].verses.length; j++) {
				const verse = data.surahs[i].verses[j];
				const uTokens = verse.uthmani.trim().split(/\s+/);
				const predicted = uTokens.reduce((sum, t) => sum + expectedSimple(t), 0);
				const actual = simple[i][j].trim().split(/\s+/).length;
				if (predicted !== actual) deficitVerses.push(`${data.surahs[i].number}:${verse.number}`);
			}
		}
		expect(deficitVerses).toEqual(['20:94', '72:16']);
	});
});
