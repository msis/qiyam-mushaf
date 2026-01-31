import type { Surah } from "../types";

interface SurahHeaderProps {
  surah: Surah;
}

export function SurahHeader({ surah }: SurahHeaderProps) {
  return (
    <div className="text-center py-8 mb-4">
      <h1 className="text-4xl font-bold text-amber-100 mb-2 font-arabic">
        سورة {surah.name}
      </h1>
      <p className="text-amber-200 text-lg">{surah.nameEn}</p>
      <p className="text-gray-400 text-sm mt-1">{surah.verseCount} verses</p>
    </div>
  );
}
