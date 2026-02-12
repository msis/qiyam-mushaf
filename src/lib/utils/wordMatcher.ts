import { distance } from "fastest-levenshtein";
import type { Word } from "$lib/types";
import { SIMILARITY_THRESHOLD } from "./constants";

/**
 * Match spoken words sequentially against the global word list starting from `anchor`.
 * Returns the new cursor position (first unmatched global index).
 *
 * The transcript is re-matched from the anchor on every call, so interim speech
 * revisions are handled correctly — the cursor can advance or regress within a session.
 */
export function matchWords(
  transcript: string,
  words: Word[],
  anchor: number,
): number {
  const spokenWords = transcript
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0);

  let cursor = Math.max(0, Math.min(anchor, words.length));

  for (const spoken of spokenWords) {
    if (cursor >= words.length) break;
    const normalized = normalizeArabicWord(spoken);
    if (wordsMatch(normalized, words[cursor].normalizedSimple)) {
      cursor++;
    } else {
      break;
    }
  }

  return cursor;
}

export function normalizeArabicWord(word: string): string {
  return word
    .replace(/[أإآ]/g, "ا")
    .replace(/[ؤ]/g, "و")
    .replace(/[ئ]/g, "ي")
    .replace(/[ة]/g, "ه")
    .replace(/[\u064B-\u065F]/g, "")
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
  if (word1.length === 0 || word2.length === 0) return 0;
  return 1 - distance(word1, word2) / Math.max(word1.length, word2.length);
}
