import type { Verse, GlobalVerseKey } from '../types';

interface VerseRowProps {
  verse: Verse;
  verseKey: GlobalVerseKey;
  surahNumber: number;
  isCurrentVerse: boolean;
  highlightedWordIndices?: Set<number>;
}

export function VerseRow({
  verse,
  verseKey,
  surahNumber,
  isCurrentVerse,
  highlightedWordIndices,
}: VerseRowProps) {
  return (
    <div
      data-verse-key={verseKey}
      className={`text-right p-6 rounded-lg transition-all duration-300 ${
        isCurrentVerse
          ? 'bg-amber-100 text-gray-900 scale-105 shadow-xl'
          : 'text-gray-500'
      }`}
    >
      <div className="flex gap-4 items-start">
        <span
          className={`text-sm font-bold flex-shrink-0 pt-2 ${
            isCurrentVerse ? 'text-amber-700' : 'text-gray-600'
          }`}
        >
          ({surahNumber}:{verse.number})
        </span>
        <p
          className={`text-2xl leading-relaxed font-arabic ${
            isCurrentVerse ? 'text-gray-900' : ''
          }`}
        >
          {verse.words.map((word, wordIndex) => {
            const isHighlighted = highlightedWordIndices?.has(wordIndex);

            return (
              <span
                key={wordIndex}
                className={`inline-block px-1 mx-0.5 rounded transition-all ${
                  isHighlighted
                    ? 'bg-amber-500 text-white font-bold scale-110'
                    : 'transition-colors'
                }`}
              >
                {word.uthmani}
              </span>
            );
          })}
        </p>
      </div>
    </div>
  );
}
