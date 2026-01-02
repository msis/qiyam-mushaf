import type { Surah } from '../types';

interface NavigationModalProps {
  isOpen: boolean;
  onClose: () => void;
  surahs: Surah[];
  selectedSurah: number;
  selectedVerse: number;
  onSurahChange: (surahNumber: number) => void;
  onVerseChange: (verseNumber: number) => void;
}

export function NavigationModal({ isOpen, onClose, surahs, selectedSurah, selectedVerse, onSurahChange, onVerseChange }: NavigationModalProps) {
  const selectedSurahData = surahs.find(s => s.number === selectedSurah);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm font-arabic">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-amber-100">Select Surah & Verse</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-amber-100 text-3xl leading-none"
          >
            &times;
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-amber-200 mb-2">Surah</label>
            <select
              value={selectedSurah}
              onChange={(e) => onSurahChange(Number(e.target.value))}
              className="w-full bg-gray-700 text-amber-100 border border-amber-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 font-arabic"
            >
              {surahs.map((surah) => (
                <option key={surah.number} value={surah.number}>
                  {surah.number}. {surah.name} ({surah.nameEn})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-amber-200 mb-2">Verse</label>
            <select
              value={selectedVerse}
              onChange={(e) => onVerseChange(Number(e.target.value))}
              className="w-full bg-gray-700 text-amber-100 border border-amber-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 font-arabic"
              disabled={!selectedSurahData}
            >
              {selectedSurahData?.verses.map((verse) => (
                <option key={verse.number} value={verse.number}>
                  {verse.number}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
          >
            Go to Verse
          </button>
        </div>
      </div>
    </div>
  );
}
