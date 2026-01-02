import { useState, useEffect, useRef, useCallback } from 'react';
import { QuranDataService } from './services/QuranDataService';
import { SpeechRecognitionService } from './services/SpeechRecognitionService';
import { ScrollManager } from './services/ScrollManager';
import { NavigationModal } from './components/NavigationModal';
import { matchSpokenWords, type HighlightedWords as HighlightedWordsType } from './utils/wordMatcher';

export function App() {
  const [surahs, setSurahs] = useState<any[]>([]);
  const [selectedSurah, setSelectedSurah] = useState(1);
  const [selectedVerse, setSelectedVerse] = useState(1);
  const [currentSurah, setCurrentSurah] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recognitionStatus, setRecognitionStatus] = useState<any>('idle');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [highlightedWords, setHighlightedWords] = useState<HighlightedWordsType>({});
  
  const quranService = QuranDataService.getInstance();
  const speechService = SpeechRecognitionService.getInstance();
  const quranDisplayRef = useRef<HTMLDivElement>(null);
  const currentVerseRef = useRef<HTMLDivElement>(null);
  const scrollManagerRef = useRef<ScrollManager | null>(null);
  const recognizedTranscriptRef = useRef('');

  const initializeScrollManager = useCallback(() => {
    if (!currentSurah || !quranDisplayRef.current) {
      return;
    }

    scrollManagerRef.current = new ScrollManager({
      container: quranDisplayRef.current,
      verseCount: currentSurah.verseCount,
      onVerseChange: (verseNumber) => {
        handleAutoAdvance(verseNumber);
      }
    });

    scrollManagerRef.current.setCurrentVerse(selectedVerse);
  }, [currentSurah, selectedVerse]);

  const handleAutoAdvance = useCallback((verseNumber: number) => {
    setSelectedVerse(verseNumber);
    scrollManagerRef.current?.setCurrentVerse(verseNumber);
  }, []);

  const handleManualVerseChange = useCallback((verseNumber: number) => {
    setSelectedVerse(verseNumber);
    setHighlightedWords({});
    recognizedTranscriptRef.current = '';
    scrollManagerRef.current?.setCurrentVerse(verseNumber);
    
    if (recognitionStatus === 'listening') {
      handleStop();
    }
  }, [recognitionStatus]);

  useEffect(() => {
    initializeScrollManager();
  }, [initializeScrollManager]);

  useEffect(() => {
    if (scrollManagerRef.current) {
      scrollManagerRef.current.setCurrentVerse(selectedVerse);
      scrollManagerRef.current.updateConfig({
        verseCount: currentSurah?.verseCount || 0
      });
    }
  }, [selectedVerse, currentSurah]);

  useEffect(() => {
    async function loadSurahs() {
      try {
        const allSurahs = await quranService.getAllSurahs();
        setSurahs(allSurahs);
        
        await loadSurah(1);
        setLoading(false);
      } catch (err) {
        setError('Failed to load Quran data');
        setLoading(false);
      }
    }

    loadSurahs();
  }, []);

  useEffect(() => {
    speechService.on({
      onResult: (result: any) => {
        if (result.transcript && result.transcript.trim().length > 0) {
          const transcript = result.transcript.trim();
          
          const currentVerseIndex = selectedVerse - 1;
          
          if (currentSurah && scrollManagerRef.current) {
            const newMatches = matchSpokenWords(
              transcript,
              currentSurah.verses,
              currentVerseIndex
            );
            
            setHighlightedWords(newMatches);

            if (scrollManagerRef.current.checkShouldAdvance(currentSurah.verses, newMatches)) {
              setTimeout(() => {
                scrollManagerRef.current?.advanceToNextVerse(currentSurah.verses, newMatches);
              }, 500);
            }
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
      }
    });
  }, [speechService, selectedVerse, currentSurah]);

  useEffect(() => {
    if (currentVerseRef.current && quranDisplayRef.current) {
      currentVerseRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [selectedVerse, currentSurah]);

  async function loadSurah(surahNumber: number) {
    try {
      const surah = await quranService.getSurah(surahNumber);
      if (surah) {
        setCurrentSurah(surah);
        setHighlightedWords({});
        scrollManagerRef.current?.updateConfig({ verseCount: surah.verseCount });
      }
    } catch (err) {
      console.error('Failed to load surah:', err);
    }
  }

  function handleSurahChange(surahNumber: number) {
    setSelectedSurah(surahNumber);
    setSelectedVerse(1);
    loadSurah(surahNumber);
  }

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center font-arabic">
        <div className="text-amber-100 text-xl">Loading Quran data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center font-arabic">
        <div className="bg-red-900 bg-opacity-50 border border-red-600 rounded-lg p-6 text-red-100 max-w-md mx-4">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
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

      <div className="flex-1 overflow-hidden">
        <div
          ref={quranDisplayRef}
          className="h-full overflow-y-auto px-4 py-20"
        >
          <div className="max-w-3xl mx-auto space-y-4">
            {currentSurah && (
              <>
                <div className="text-center mb-8">
                  <h1 className="text-4xl font-bold text-amber-100 mb-2 font-arabic">
                    سورة {currentSurah.name}
                  </h1>
                  <p className="text-amber-200 text-lg">{currentSurah.nameEn}</p>
                </div>

                {currentSurah.verses.map((verse: any, index: number) => {
                  const isCurrentVerse = verse.number === selectedVerse;
                  const verseHighlights = highlightedWords[index];
                  
                  return (
                    <div
                      key={verse.number}
                      ref={isCurrentVerse ? currentVerseRef : null}
                      data-verse-number={verse.number}
                      className={`text-right p-6 rounded-lg transition-all duration-300 ${
                        isCurrentVerse
                          ? 'bg-amber-100 text-gray-900 scale-105 shadow-xl'
                          : 'text-gray-500'
                      }`}
                    >
                      <div className="flex gap-4 items-start">
                        <span className={`text-sm font-bold flex-shrink-0 pt-2 ${
                          isCurrentVerse ? 'text-amber-700' : 'text-gray-600'
                        }`}>
                          ({verse.number})
                        </span>
                        <p className={`text-2xl leading-relaxed font-arabic ${
                          isCurrentVerse ? 'text-gray-900' : ''
                        }`}>
                          {verse.words.map((word: any, wordIndex: number) => {
                            const isHighlighted = verseHighlights?.has(wordIndex);
                            
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
                })}
              </>
            )}
          </div>
        </div>
      </div>

      <NavigationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        surahs={surahs}
        selectedSurah={selectedSurah}
        selectedVerse={selectedVerse}
        onSurahChange={handleSurahChange}
        onVerseChange={handleManualVerseChange}
      />
    </div>
  );
}

export default App;
