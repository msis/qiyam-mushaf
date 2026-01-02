import type { Verse, HighlightedWords } from '../types';

export interface ScrollManagerConfig {
  container?: HTMLElement;
  verseCount: number;
  onVerseChange?: (verseNumber: number) => void;
  autoAdvance?: boolean;
  verseOffset?: number;
}

export class ScrollManager {
  private config: ScrollManagerConfig;
  private currentVerse: number = 1;
  private currentVerseElement: HTMLElement | null = null;

  constructor(config: ScrollManagerConfig) {
    this.config = {
      autoAdvance: true,
      verseOffset: 1,
      ...config
    };
  }

  setCurrentVerse(verseNumber: number): void {
    this.currentVerse = verseNumber;
  }

  checkShouldAdvance(
    verses: Verse[],
    highlightedWords: HighlightedWords
  ): boolean {
    if (!this.config.autoAdvance) {
      return false;
    }

    const currentVerseIndex = this.currentVerse - 1;
    if (currentVerseIndex < 0 || currentVerseIndex >= verses.length) {
      return false;
    }

    const currentVerse = verses[currentVerseIndex];
    const verseHighlights = highlightedWords[currentVerseIndex];

    if (!currentVerse || !verseHighlights) {
      return false;
    }

    const totalWords = currentVerse.words.length;
    const highlightedCount = verseHighlights.size;
    
    return highlightedCount >= totalWords;
  }

  advanceToNextVerse(
    verses: Verse[],
    highlightedWords: HighlightedWords
  ): void {
    if (!this.checkShouldAdvance(verses, highlightedWords)) {
      return;
    }

    const nextVerse = this.currentVerse + this.config.verseOffset;
    
    if (nextVerse > this.config.verseCount) {
      return;
    }

    this.scrollToVerse(nextVerse);
    this.config.onVerseChange?.(nextVerse);
  }

  scrollToVerse(verseNumber: number): void {
    const container = this.config.container;
    if (!container) {
      return;
    }

    const verseIndex = verseNumber - 1;
    const verseElements = container.querySelectorAll('[data-verse-number]');
    
    const targetElement = Array.from(verseElements).find(
      (el) => parseInt(el.getAttribute('data-verse-number') || '', 10) === verseNumber
    );

    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }

  scrollToCurrentVerse(): void {
    this.scrollToVerse(this.currentVerse);
  }

  updateConfig(config: Partial<ScrollManagerConfig>): void {
    this.config = { ...this.config, ...config };
  }
}
