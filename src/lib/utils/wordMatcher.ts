import type { Verse } from "$lib/types";
import { SIMILARITY_THRESHOLD } from "./constants";

export interface MatchedWords {
  [verseIndex: number]: Set<number>;
}

export function matchSpokenWords(
  transcript: string,
  verses: Verse[],
  currentVerseIndex: number,
): MatchedWords {
  const matches: MatchedWords = {};

  const spokenWords = transcript
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0);

  const currentVerse = verses[currentVerseIndex];
  if (!currentVerse) {
    return matches;
  }

  const verseMatches = new Set<number>();

  for (const spokenWord of spokenWords) {
    const cleanedSpokenWord = normalizeArabicWord(spokenWord);
    let matched = false;

    for (
      let wordIndex = 0;
      wordIndex < currentVerse.words.length;
      wordIndex++
    ) {
      if (verseMatches.has(wordIndex)) {
        continue;
      }

      // Use precomputed normalized form instead of normalizing on every call
      const cleanedQuranWord = currentVerse.words[wordIndex].normalizedSimple;

      if (wordsMatch(cleanedSpokenWord, cleanedQuranWord)) {
        verseMatches.add(wordIndex);
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

export function normalizeArabicWord(word: string): string {
  return word
    .replace(/[أإآ]/g, "ا")
    .replace(/[ؤ]/g, "و")
    .replace(/[ئ]/g, "ي")
    .replace(/[ة]/g, "ه")
    .replace(/[\u064B-\u065F]/g, "")
    .replace(/[\u06D6-\u06ED]/g, "")
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

  return calculateSimilarity(spoken, quran) > SIMILARITY_THRESHOLD;
}

function calculateSimilarity(word1: string, word2: string): number {
  if (word1 === word2) return 1;
  if (word1.length === 0 || word2.length === 0) return 0;

  const len1 = word1.length;
  const len2 = word2.length;

  // Two-row Levenshtein: O(min(n,m)) memory instead of O(n*m)
  let prev = new Array<number>(len2 + 1);
  let curr = new Array<number>(len2 + 1);

  for (let j = 0; j <= len2; j++) prev[j] = j;

  for (let i = 1; i <= len1; i++) {
    curr[0] = i;
    for (let j = 1; j <= len2; j++) {
      if (word1[i - 1] === word2[j - 1]) {
        curr[j] = prev[j - 1];
      } else {
        curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + 1);
      }
    }
    [prev, curr] = [curr, prev];
  }

  const distance = prev[len2];
  const maxLength = Math.max(len1, len2);

  return 1 - distance / maxLength;
}
