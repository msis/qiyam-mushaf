import type { QuranRawData, QuranData, Surah, Verse, Word } from '$lib/types';
import { SURAH_NAMES } from './constants';
import { normalizeArabicWord } from './wordMatcher';

/** Standalone tajweed/juz mark codepoints in uthmani */
const TAJWEED_MARKS = new Set([
	'\u06D6', // ۖ
	'\u06D7', // ۗ
	'\u06D8', // ۘ
	'\u06D9', // ۙ
	'\u06DA', // ۚ
	'\u06DB', // ۛ
	'\u06DC', // ۜ
	'\u06DE', // ۞
	'\u06E9' // ۩
]);

function isMark(word: string): boolean {
	for (const ch of word) {
		if (!TAJWEED_MARKS.has(ch)) return false;
	}
	return true;
}

/** How many simple words a single uthmani token maps to: 0 (mark), 1, or 2 (merge). */
function simpleWordsPerToken(token: string): number {
	if (isMark(token)) return 0;
	if (/^يَـٰٓ?ـ?َ?ٔ?.+/.test(token)) return 2; // يَـٰ vocative merge
	if (/^وَيَـٰٓ?ـ?َ?ٔ?.+/.test(token)) return 2; // وَيَـٰ conjunction+vocative
	if (token.startsWith('هَـٰٓأَ') || token.startsWith('هَـٰٓأُ')) return 2; // هَـٰٓأ demonstrative (not هَـٰٓؤ)
	return 1;
}

export function processQuranData(rawData: QuranRawData): QuranData {
	const surahs: Surah[] = [];

	for (let i = 0; i < rawData.uthmani.length; i++) {
		const surahInfo = SURAH_NAMES[i];
		const uthmaniVerses = rawData.uthmani[i];
		const simpleVerses = rawData.simple[i];

		const verses: Verse[] = uthmaniVerses.map((uthmaniText, verseIndex) => {
			const simpleText = simpleVerses[verseIndex];
			const uthmaniWords = uthmaniText.trim().split(/\s+/);
			const words = buildWordMapping(uthmaniWords, simpleText);

			return {
				number: verseIndex + 1,
				uthmani: uthmaniText,
				simple: simpleText,
				words,
				simpleWordCount: words.filter((w) => w.simple.length > 0).length
			};
		});

		surahs.push({
			number: surahInfo.number,
			name: surahInfo.name,
			nameEn: surahInfo.nameEn,
			verses,
			verseCount: verses.length
		});
	}

	return { surahs };
}

/** Map each simple word to its uthmani token index. */
function buildWordMapping(uthmaniWords: string[], simpleText: string): Word[] {
	const simpleWords = simpleText.trim().split(/\s+/);
	const words: Word[] = [];
	let simpleIdx = 0;

	for (let uIdx = 0; uIdx < uthmaniWords.length; uIdx++) {
		const count = simpleWordsPerToken(uthmaniWords[uIdx]);

		for (let j = 0; j < count; j++) {
			const simple = simpleWords[simpleIdx] ?? '';
			words.push({
				simple,
				normalizedSimple: normalizeArabicWord(simple),
				uthmaniIndex: uIdx
			});
			simpleIdx++;
		}
	}

	// 20:94 يَبْنَؤُمَّ and 72:16 وَأَلَّوِ — highlighting shifted, completion correct
	const lastUIdx = uthmaniWords.length - 1;
	while (simpleIdx < simpleWords.length) {
		const simple = simpleWords[simpleIdx];
		words.push({
			simple,
			normalizedSimple: normalizeArabicWord(simple),
			uthmaniIndex: lastUIdx
		});
		simpleIdx++;
	}

	return words;
}
