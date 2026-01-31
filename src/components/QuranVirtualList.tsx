import { forwardRef, useImperativeHandle, useRef, useCallback } from 'react';
import { Virtuoso, type VirtuosoHandle, type Components } from 'react-virtuoso';
import type { RenderableItem, GlobalVerseKey, GlobalHighlightedWords } from '../types';
import { SurahHeader } from './SurahHeader';
import { Bismillah } from './Bismillah';
import { VerseRow } from './VerseRow';

export interface QuranVirtualListHandle {
  scrollToIndex: (index: number, behavior?: 'auto' | 'smooth') => void;
}

interface QuranVirtualListProps {
  items: RenderableItem[];
  currentVerseKey: GlobalVerseKey | null;
  highlightedWords: GlobalHighlightedWords;
}

// Custom List component - defined outside to prevent recreation on each render
const ListContainer = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ style, children, ...props }, ref) => (
    <div
      ref={ref}
      style={style}
      className="max-w-3xl mx-auto px-4 py-20 space-y-4"
      {...props}
    >
      {children}
    </div>
  )
);
ListContainer.displayName = 'ListContainer';

const virtuosoComponents: Components = {
  List: ListContainer,
};

export const QuranVirtualList = forwardRef<QuranVirtualListHandle, QuranVirtualListProps>(
  function QuranVirtualList({ items, currentVerseKey, highlightedWords }, ref) {
    const virtuosoRef = useRef<VirtuosoHandle>(null);

    useImperativeHandle(ref, () => ({
      scrollToIndex: (index: number, behavior: 'auto' | 'smooth' = 'smooth') => {
        virtuosoRef.current?.scrollToIndex({
          index,
          align: 'center',
          behavior,
        });
      },
    }));

    const renderItem = useCallback(
      (index: number) => {
        const item = items[index];

        if (!item) {
          return null;
        }

        switch (item.type) {
          case 'surah-header':
            return item.surahData ? <SurahHeader surah={item.surahData} /> : null;

          case 'bismillah':
            return <Bismillah />;

          case 'verse':
            if (!item.verse || !item.verseKey) {
              return null;
            }
            return (
              <VerseRow
                verse={item.verse}
                verseKey={item.verseKey}
                surahNumber={item.surahNumber}
                isCurrentVerse={item.verseKey === currentVerseKey}
                highlightedWordIndices={highlightedWords[item.verseKey]}
              />
            );

          default:
            return null;
        }
      },
      [items, currentVerseKey, highlightedWords]
    );

    if (items.length === 0) {
      return null;
    }

    return (
      <Virtuoso
        ref={virtuosoRef}
        totalCount={items.length}
        itemContent={renderItem}
        style={{ height: '100%' }}
        overscan={200}
        components={virtuosoComponents}
      />
    );
  }
);
