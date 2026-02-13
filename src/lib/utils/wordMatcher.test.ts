import { describe, expect, it } from 'vitest';
import { matchWords, normalizeArabicWord } from './wordMatcher';
import type { Word } from '$lib/types';
import type { GlobalVerseKey } from '$lib/types';

/** Helper: build a minimal Word[] from simple Arabic strings. */
function makeWords(simples: string[], startIndex = 0): Word[] {
	return simples.map((simple, i) => ({
		simple,
		normalizedSimple: normalizeArabicWord(simple),
		uthmaniIndex: i,
		globalIndex: startIndex + i,
		verseKey: '1:1' as GlobalVerseKey
	}));
}

// Al-Fatiha verse 1 words (simple text)
const fatihaWords = makeWords([
	'بسم', 'الله', 'الرحمن', 'الرحيم'
]);

// A longer sequence for window/skip tests
const longerWords = makeWords([
	'بسم', 'الله', 'الرحمن', 'الرحيم',
	'الحمد', 'لله', 'رب', 'العالمين'
]);

describe('matchWords — expanding-prefix matcher', () => {
	it('exact match advances through all words', () => {
		const result = matchWords('بسم الله الرحمن الرحيم', fatihaWords, 0);
		expect(result).toBe(4);
	});

	it('partial match advances to best prefix', () => {
		const result = matchWords('بسم الله', fatihaWords, 0);
		expect(result).toBe(2);
	});

	it('single word match advances by one', () => {
		const result = matchWords('بسم', fatihaWords, 0);
		expect(result).toBe(1);
	});

	it('empty transcript returns anchor unchanged', () => {
		expect(matchWords('', fatihaWords, 0)).toBe(0);
		expect(matchWords('   ', fatihaWords, 3)).toBe(3);
	});

	it('respects anchor position — matches from anchor forward', () => {
		// Start at word 2 ("الرحمن"), speak "الرحمن الرحيم"
		const result = matchWords('الرحمن الرحيم', fatihaWords, 2);
		expect(result).toBe(4);
	});

	it('absorbs a single misrecognized word mid-phrase', () => {
		// "بسم GARBAGE الرحمن الرحيم" — one wrong word among three correct
		// The expanding prefix for 4 words should still win: distance between
		// "بسم GARBAGE الرحمن الرحيم" and "بسم الله الرحمن الرحيم" is small
		const result = matchWords('بسم خطأ الرحمن الرحيم', fatihaWords, 0);
		expect(result).toBe(4);
	});

	it('quality gate rejects completely unrelated speech', () => {
		// Random Latin text has huge edit distance — should not advance
		const result = matchWords('hello world foo bar', fatihaWords, 0);
		expect(result).toBe(0);
	});

	it('quality gate rejects garbage Arabic', () => {
		// Totally unrelated Arabic — distance should exceed 33% threshold
		const result = matchWords('ققققققققق ططططططططط', fatihaWords, 0);
		expect(result).toBe(0);
	});

	it('anchor at end of words returns anchor', () => {
		const result = matchWords('بسم', fatihaWords, 4);
		expect(result).toBe(4);
	});

	it('anchor beyond words length is clamped', () => {
		const result = matchWords('بسم', fatihaWords, 100);
		expect(result).toBe(fatihaWords.length);
	});

	it('negative anchor is clamped to 0', () => {
		const result = matchWords('بسم الله', fatihaWords, -5);
		expect(result).toBe(2);
	});

	it('crosses verse boundary in longer sequence', () => {
		// Speak across fatiha v1 into v2
		const result = matchWords(
			'بسم الله الرحمن الرحيم الحمد لله رب العالمين',
			longerWords,
			0
		);
		expect(result).toBe(8);
	});

	it('advances from mid-sequence with anchor', () => {
		// Anchor at "الحمد" (index 4), speak the rest
		const result = matchWords('الحمد لله رب العالمين', longerWords, 4);
		expect(result).toBe(8);
	});

	it('skips stale prefix — all stale tokens do not advance', () => {
		// Transcript covers words entirely BEFORE the anchor — nothing new to match.
		// Simulates speech API returning already-matched text after auto-restart.
		const words = makeWords([
			// anchor is at index 8 ("وادعوا"), spoken text covers indices 0-7
			'بناء', 'وأنزل', 'من', 'السماء', 'ماء', 'فأخرج', 'به', 'من',
			'وادعوا', 'شهداءكم', 'من', 'دون', 'الله', 'إن', 'كنتم', 'صادقين'
		]);
		const result = matchWords(
			'بناء وانزل من السماء ماء فاخرج به من',
			words,
			8
		);
		expect(result).toBe(8);
	});

	it('skips stale prefix — advances past stale tokens to match new ones', () => {
		// Transcript has 4 stale words then 8 new words starting at the anchor.
		// Simulates speech API including overlap text from before auto-restart.
		const words = makeWords([
			// indices 0-3 are before anchor (stale in transcript)
			'فأتوا', 'بسورة', 'من', 'مثله',
			// indices 4-11 are at/after anchor (new in transcript)
			'وادعوا', 'شهداءكم', 'من', 'دون', 'الله', 'إن', 'كنتم', 'صادقين'
		]);
		const result = matchWords(
			'فاتوا بصوره من مثله وادعوا شهداءكم من دون الله ان كنتم صادقين',
			words,
			4
		);
		expect(result).toBe(12);
	});
});

describe('normalizeArabicWord', () => {
	it('normalizes hamza variants to alef', () => {
		expect(normalizeArabicWord('أحمد')).toBe('احمد');
		expect(normalizeArabicWord('إسلام')).toBe('اسلام');
		expect(normalizeArabicWord('آمن')).toBe('امن');
	});

	it('normalizes taa marbuta to ha', () => {
		expect(normalizeArabicWord('رحمة')).toBe('رحمه');
	});

	it('strips diacritics', () => {
		expect(normalizeArabicWord('بِسْمِ')).toBe('بسم');
	});

	it('normalizes hamza-on-waw and hamza-on-ya', () => {
		expect(normalizeArabicWord('ؤ')).toBe('و');
		expect(normalizeArabicWord('ئ')).toBe('ي');
	});

	it('handles empty and whitespace input', () => {
		expect(normalizeArabicWord('')).toBe('');
		expect(normalizeArabicWord('  ')).toBe('');
	});
});
