import type { Verse } from '../types';

export interface MatchedWords {
  [verseIndex: number]: Set<number>;
}

export function matchSpokenWords(
  transcript: string,
  verses: Verse[],
  currentVerseIndex: number,
  previousMatches?: MatchedWords
): MatchedWords {
  const matches: MatchedWords = {};
  
  const spokenWords = transcript
    .trim()
    .split(/\s+/)
    .filter(word => word.length > 0);

  const currentVerse = verses[currentVerseIndex];
  if (!currentVerse) {
    return matches;
  }

  const verseMatches = new Set<number>();
  let matchedWordCount = 0;

  for (const spokenWord of spokenWords) {
    const cleanedSpokenWord = normalizeArabicWord(spokenWord);
    let matched = false;

    for (let wordIndex = 0; wordIndex < currentVerse.words.length; wordIndex++) {
      if (verseMatches.has(wordIndex)) {
        continue;
      }

      const quranWord = currentVerse.words[wordIndex];
      const cleanedQuranWord = normalizeArabicWord(quranWord.simple);

      if (wordsMatch(cleanedSpokenWord, cleanedQuranWord)) {
        verseMatches.add(wordIndex);
        matchedWordCount++;
        matched = true;
        break;
      }
    }

    if (!matched) {
      break;
    }
  }

  matches[currentVerseIndex] = verseMatches;
  
  return matches;
}

function normalizeArabicWord(word: string): string {
  return word
    .replace(/[أإآ]/g, 'ا')
    .replace(/[ؤ]/g, 'و')
    .replace(/[ئ]/g, 'ي')
    .replace(/[ة]/g, 'ه')
    .replace(/[ًٌٍَُُِْ]/g, '')
    .replace(/[\u064B-\u065F]/g, '')
    .toLowerCase()
    .trim();
}

function wordsMatch(spoken: string, quran: string): boolean {
  if (spoken === quran) {
    return true;
  }

  if (quran.includes(spoken) || spoken.includes(quran)) {
    return true;
  }

  const similarity = calculateSimilarity(spoken, quran);
  if (similarity > 0.7) {
    return true;
  }

  return false;
}

function calculateSimilarity(word1: string, word2: string): number {
  if (word1 === word2) return 1;
  if (word1.length === 0 || word2.length === 0) return 0;

  const matrix: number[][] = [];
  
  for (let i = 0; i <= word1.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= word2.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= word1.length; i++) {
    for (let j = 1; j <= word2.length; j++) {
      if (word1[i - 1] === word2[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + 1
        );
      }
    }
  }

  const distance = matrix[word1.length][word2.length];
  const maxLength = Math.max(word1.length, word2.length);
  
  return 1 - distance / maxLength;
}
