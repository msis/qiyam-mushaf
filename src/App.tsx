import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { QuranDataService } from './services/QuranDataService';
import { SpeechRecognitionService } from './services/SpeechRecognitionService';
import { GlobalScrollManager } from './services/GlobalScrollManager';
import { NavigationModal } from './components/NavigationModal';
import { QuranVirtualList, type QuranVirtualListHandle } from './components/QuranVirtualList';
import { matchSpokenWords } from './utils/wordMatcher';
import { buildRenderableItems, buildLookupMaps, toGlobalKey } from './utils/globalAddressing';
import type { Surah, RenderableItem, LookupMaps, GlobalHighlightedWords, GlobalVerseKey } from './types';

export function App() {
  // Data state
  const [allSurahs, setAllSurahs] = useState<Surah[]>([]);
  const [renderableItems, setRenderableItems] = useState<RenderableItem[]>([]);
  const [lookupMaps, setLookupMaps] = useState<LookupMaps | null>(null);

  // Position state
  const [currentSurahNum, setCurrentSurahNum] = useState(1);
  const [currentVerseNum, setCurrentVerseNum] = useState(1);

  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recognitionStatus, setRecognitionStatus] = useState<'idle' | 'listening' | 'stopped'>('idle');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [highlightedWords, setHighlightedWords] = useState<GlobalHighlightedWords>({});

  // Services (singletons)
  const quranService = QuranDataService.getInstance();
  const speechService = SpeechRecognitionService.getInstance();

  // Refs
  const virtualListRef = useRef<QuranVirtualListHandle>(null);
  const scrollManagerRef = useRef<GlobalScrollManager | null>(null);

  // Derived state
  const currentVerseKey = useMemo<GlobalVerseKey | null>(() => {
    if (currentSurahNum > 0 && currentVerseNum > 0) {
      return toGlobalKey(currentSurahNum, currentVerseNum);
    }
    return null;
  }, [currentSurahNum, currentVerseNum]);

  const currentSurah = useMemo(() => {
    return allSurahs[currentSurahNum - 1] || null;
  }, [allSurahs, currentSurahNum]);

  // Initialize GlobalScrollManager once
  useEffect(() => {
    scrollManagerRef.current = new GlobalScrollManager({
      autoAdvance: true,
      onVerseChange: (surah, verse) => {
        setCurrentSurahNum(surah);
        setCurrentVerseNum(verse);
        setHighlightedWords({});
      },
      onScrollToIndex: (index) => {
        virtualListRef.current?.scrollToIndex(index, 'smooth');
      },
    });
  }, []);

  // Keep scroll manager in sync with data
  useEffect(() => {
    if (scrollManagerRef.current && allSurahs.length > 0) {
      scrollManagerRef.current.setSurahs(allSurahs);
    }
  }, [allSurahs]);

  useEffect(() => {
    if (scrollManagerRef.current && lookupMaps) {
      scrollManagerRef.current.setLookupMaps(lookupMaps);
    }
  }, [lookupMaps]);

  useEffect(() => {
    if (scrollManagerRef.current) {
      scrollManagerRef.current.setCurrentPosition(currentSurahNum, currentVerseNum);
    }
  }, [currentSurahNum, currentVerseNum]);

  // Load Quran data on mount
  useEffect(() => {
    async function loadData() {
      try {
        const surahs = await quranService.getAllSurahs();
        setAllSurahs(surahs);

        const items = buildRenderableItems(surahs);
        setRenderableItems(items);

        const maps = buildLookupMaps(items);
        setLookupMaps(maps);

        setLoading(false);
      } catch (err) {
        console.error('Failed to load Quran data:', err);
        setError('Failed to load Quran data');
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Speech recognition
  useEffect(() => {
    speechService.on({
      onResult: (result: { transcript: string }) => {
        if (!result.transcript || result.transcript.trim().length === 0) {
          return;
        }

        const transcript = result.transcript.trim();
        const currentVerseIndex = currentVerseNum - 1;

        if (currentSurah && scrollManagerRef.current) {
          const localMatches = matchSpokenWords(
            transcript,
            currentSurah.verses,
            currentVerseIndex
          );

          // Convert local verse indices to global keys
          const globalMatches: GlobalHighlightedWords = {};
          for (const [verseIdx, wordSet] of Object.entries(localMatches)) {
            const verseNumber = Number(verseIdx) + 1;
            const key = toGlobalKey(currentSurahNum, verseNumber);
            globalMatches[key] = wordSet as Set<number>;
          }

          setHighlightedWords(globalMatches);

          if (scrollManagerRef.current.checkShouldAdvance(globalMatches)) {
            setTimeout(() => {
              scrollManagerRef.current?.advanceToNextVerse(globalMatches);
            }, 500);
          }
        }
      },
      onError: (err: Error) => {
        console.error('Speech error:', err);
      },
      onEnd: () => {
        setRecognitionStatus('idle');
      },
      onStart: () => {
        setRecognitionStatus('listening');
        setHighlightedWords({});
      },
    });
  }, [speechService, currentSurahNum, currentVerseNum, currentSurah]);

  // Navigation
  const navigateToVerse = useCallback(
    (surah: number, verse: number) => {
      if (!lookupMaps) return;

      const key = toGlobalKey(surah, verse);
      const flatIndex = lookupMaps.keyToIndex.get(key);

      if (flatIndex !== undefined) {
        virtualListRef.current?.scrollToIndex(flatIndex, 'smooth');
      }

      setCurrentSurahNum(surah);
      setCurrentVerseNum(verse);
      setHighlightedWords({});

      if (scrollManagerRef.current) {
        scrollManagerRef.current.setCurrentPosition(surah, verse);
      }
    },
    [lookupMaps]
  );

  const handleSurahChange = useCallback(
    (surahNumber: number) => {
      navigateToVerse(surahNumber, 1);
      if (recognitionStatus === 'listening') {
        handleStop();
      }
    },
    [navigateToVerse, recognitionStatus]
  );

  const handleVerseChange = useCallback(
    (verseNumber: number) => {
      navigateToVerse(currentSurahNum, verseNumber);
      if (recognitionStatus === 'listening') {
        handleStop();
      }
    },
    [currentSurahNum, navigateToVerse, recognitionStatus]
  );

  function handleStart() {
    try {
      speechService.start();
    } catch (err) {
      console.error('Failed to start recognition:', err);
    }
  }

  function handleStop() {
    try {
      speechService.stop();
      setRecognitionStatus('stopped');
    } catch (err) {
      console.error('Failed to stop recognition:', err);
    }
  }

  function toggleRecognition() {
    if (recognitionStatus === 'listening') {
      handleStop();
    } else {
      handleStart();
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="h-screen bg-gray-900 flex items-center justify-center font-arabic">
        <div className="text-amber-100 text-xl">Loading Quran data...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="h-screen bg-gray-900 flex items-center justify-center font-arabic">
        <div className="bg-red-900 bg-opacity-50 border border-red-600 rounded-lg p-6 text-red-100 max-w-md mx-4">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      {/* Navigation button - fixed position */}
      <div className="fixed top-4 right-4 z-40">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-amber-600 hover:bg-amber-700 text-white p-3 rounded-full shadow-lg transition-colors"
          title="Open navigation"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Current position indicator - fixed position */}
      <div className="fixed top-4 left-4 z-40 bg-gray-800 bg-opacity-90 px-3 py-2 rounded-lg">
        <span className="text-amber-100 text-sm font-medium">
          {currentSurah?.name} ({currentSurahNum}:{currentVerseNum})
        </span>
      </div>

      {/* Recording button - fixed position */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
        <button
          onClick={toggleRecognition}
          className={`p-4 rounded-full shadow-lg transition-all ${
            recognitionStatus === 'listening'
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-green-600 hover:bg-green-700'
          } text-white`}
          title={recognitionStatus === 'listening' ? 'Stop recording' : 'Start recording'}
        >
          {recognitionStatus === 'listening' ? (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="6" width="12" height="12" strokeWidth={2} />
            </svg>
          ) : (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          )}
        </button>
      </div>

      {/* Virtual scrolling Quran display - flex child with min-h-0 */}
      <div className="flex-1 min-h-0">
        <QuranVirtualList
          ref={virtualListRef}
          items={renderableItems}
          currentVerseKey={currentVerseKey}
          highlightedWords={highlightedWords}
        />
      </div>

      {/* Navigation modal */}
      <NavigationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        surahs={allSurahs}
        selectedSurah={currentSurahNum}
        selectedVerse={currentVerseNum}
        onSurahChange={handleSurahChange}
        onVerseChange={handleVerseChange}
      />
    </div>
  );
}

export default App;
