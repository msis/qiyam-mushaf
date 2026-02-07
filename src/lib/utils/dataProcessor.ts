import type { QuranRawData, QuranData, Surah, Verse, Word } from '$lib/types';
import { SURAH_NAMES } from './constants';
import { normalizeArabicWord } from './wordMatcher';

export function processQuranData(rawData: QuranRawData): QuranData {
	const surahs: Surah[] = [];

	for (let i = 0; i < rawData.uthmani.length; i++) {
		const surahInfo = SURAH_NAMES[i];
		const uthmaniVerses = rawData.uthmani[i];
		const simpleVerses = rawData.simple[i];

		const verses: Verse[] = uthmaniVerses.map((uthmaniText, verseIndex) => {
			const simpleText = simpleVerses[verseIndex];
			const words = splitIntoWords(uthmaniText, simpleText);

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

function splitIntoWords(uthmaniText: string, simpleText: string): Word[] {
	const uthmaniWords = uthmaniText.trim().split(/\s+/);
	const simpleWords = simpleText.trim().split(/\s+/);

	const words: Word[] = [];
	const maxLength = Math.max(uthmaniWords.length, simpleWords.length);

	for (let i = 0; i < maxLength; i++) {
		const simple = simpleWords[i] || '';
		words.push({
			uthmani: uthmaniWords[i] || '',
			simple,
			normalizedSimple: normalizeArabicWord(simple)
		});
	}

	return words;
}
