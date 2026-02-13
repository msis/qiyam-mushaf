import { distance } from "fastest-levenshtein";
import type { Word } from "$lib/types";
import {
  WINDOW_MULTIPLIER,
  LOOKAHEAD_PADDING,
  MAX_DISTANCE_RATIO,
  MIN_SUFFIX_RATIO,
  MIN_SUFFIX_TOKENS,
} from "./constants";

/**
 * Match a spoken phrase against the global word list using expanding-prefix
 * Levenshtein matching. Returns the new cursor position (first unmatched index).
 *
 * The speech API can return transcripts that include already-matched text
 * (stale prefix) before the anchor — e.g. after an auto-restart or when Chrome
 * bundles a long utterance. To handle this:
 *
 * 1. Run expanding-prefix once on the full transcript → find bestCount
 *    (the stale prefix adds roughly uniform edit cost to all reference prefixes,
 *    so the optimal bestCount is stable regardless of stale tokens).
 * 2. If the quality gate rejects, trim spoken tokens from the front one at a
 *    time, re-checking only the quality gate against the fixed reference prefix.
 *    This is O(W + N) Levenshtein calls instead of O(N × W).
 */
export function matchWords(
  transcript: string,
  words: Word[],
  anchor: number,
): number {
  const spokenTokens = transcript
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0);
  if (spokenTokens.length === 0) return anchor;

  const clampedAnchor = Math.max(0, Math.min(anchor, words.length));

  const normalizedTokens = spokenTokens.map(normalizeArabicWord);
  const fullPhrase = normalizedTokens.join(" ");
  if (fullPhrase.length === 0) return clampedAnchor;

  // --- Step 1: Expanding-prefix search on the full transcript ---
  const windowSize = Math.min(
    normalizedTokens.length * WINDOW_MULTIPLIER + LOOKAHEAD_PADDING,
    words.length - clampedAnchor,
  );
  if (windowSize <= 0) return clampedAnchor;

  let minDistance = Infinity;
  let bestCount = 0;
  let referencePhrase = "";

  for (let i = 0; i < windowSize; i++) {
    if (i > 0) referencePhrase += " ";
    referencePhrase += words[clampedAnchor + i].normalizedSimple;

    const d = distance(fullPhrase, referencePhrase);
    if (d < minDistance) {
      minDistance = d;
      bestCount = i + 1;
    }
  }

  // Fast path: full transcript passes quality gate.
  if (minDistance <= fullPhrase.length * MAX_DISTANCE_RATIO) {
    return clampedAnchor + bestCount;
  }

  if (bestCount === 0) return clampedAnchor;

  // --- Step 2: Trim stale prefix, re-check quality gate against fixed ref ---
  // Build the fixed reference phrase (bestCount words from anchor).
  let fixedRef = "";
  for (let i = 0; i < bestCount; i++) {
    if (i > 0) fixedRef += " ";
    fixedRef += words[clampedAnchor + i].normalizedSimple;
  }

  // Only trust a trimmed suffix if it retains enough length relative to the
  // fixedRef. Prevents a single coincidental token (e.g. "من") from matching.
  const minSuffixLength = fixedRef.length * MIN_SUFFIX_RATIO;

  for (let skip = 1; skip < normalizedTokens.length; skip++) {
    const suffix = normalizedTokens.slice(skip).join(" ");
    if (
      normalizedTokens.length - skip < MIN_SUFFIX_TOKENS ||
      suffix.length < minSuffixLength
    )
      break;

    const d = distance(suffix, fixedRef);
    if (d <= suffix.length * MAX_DISTANCE_RATIO) {
      return clampedAnchor + bestCount;
    }
  }

  return clampedAnchor;
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
