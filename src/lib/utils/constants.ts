export const SURAH_NAMES = [
  { number: 1, name: "الفاتحة", nameEn: "Al-Fatiha", verseCount: 7 },
  { number: 2, name: "البقرة", nameEn: "Al-Baqara", verseCount: 286 },
  { number: 3, name: "آل عمران", nameEn: "Aal-Imran", verseCount: 200 },
  { number: 4, name: "النساء", nameEn: "An-Nisa", verseCount: 176 },
  { number: 5, name: "المائدة", nameEn: "Al-Ma'ida", verseCount: 120 },
  { number: 6, name: "الأنعام", nameEn: "Al-An'am", verseCount: 165 },
  { number: 7, name: "الأعراف", nameEn: "Al-A'raf", verseCount: 206 },
  { number: 8, name: "الأنفال", nameEn: "Al-Anfal", verseCount: 75 },
  { number: 9, name: "التوبة", nameEn: "At-Tawba", verseCount: 129 },
  { number: 10, name: "يونس", nameEn: "Yunus", verseCount: 109 },
  { number: 11, name: "هود", nameEn: "Hud", verseCount: 123 },
  { number: 12, name: "يوسف", nameEn: "Yusuf", verseCount: 111 },
  { number: 13, name: "الرعد", nameEn: "Ar-Ra'd", verseCount: 43 },
  { number: 14, name: "إبراهيم", nameEn: "Ibrahim", verseCount: 52 },
  { number: 15, name: "الحجر", nameEn: "Al-Hijr", verseCount: 99 },
  { number: 16, name: "النحل", nameEn: "An-Nahl", verseCount: 128 },
  { number: 17, name: "الإسراء", nameEn: "Al-Isra", verseCount: 111 },
  { number: 18, name: "الكهف", nameEn: "Al-Kahf", verseCount: 110 },
  { number: 19, name: "مريم", nameEn: "Maryam", verseCount: 98 },
  { number: 20, name: "طه", nameEn: "Ta-Ha", verseCount: 135 },
  { number: 21, name: "الأنبياء", nameEn: "Al-Anbiya", verseCount: 112 },
  { number: 22, name: "الحج", nameEn: "Al-Hajj", verseCount: 78 },
  { number: 23, name: "المؤمنون", nameEn: "Al-Mu'minun", verseCount: 118 },
  { number: 24, name: "النور", nameEn: "An-Nur", verseCount: 64 },
  { number: 25, name: "الفرقان", nameEn: "Al-Furqan", verseCount: 77 },
  { number: 26, name: "الشعراء", nameEn: "Ash-Shu'ara", verseCount: 227 },
  { number: 27, name: "النمل", nameEn: "An-Naml", verseCount: 93 },
  { number: 28, name: "القصص", nameEn: "Al-Qasas", verseCount: 88 },
  { number: 29, name: "العنكبوت", nameEn: "Al-Ankabut", verseCount: 69 },
  { number: 30, name: "الروم", nameEn: "Ar-Rum", verseCount: 60 },
  { number: 31, name: "لقمان", nameEn: "Luqman", verseCount: 34 },
  { number: 32, name: "السجدة", nameEn: "As-Sajda", verseCount: 30 },
  { number: 33, name: "الأحزاب", nameEn: "Al-Ahzab", verseCount: 73 },
  { number: 34, name: "سبأ", nameEn: "Saba", verseCount: 54 },
  { number: 35, name: "فاطر", nameEn: "Fatir", verseCount: 45 },
  { number: 36, name: "يس", nameEn: "Ya-Sin", verseCount: 83 },
  { number: 37, name: "الصافات", nameEn: "As-Saffat", verseCount: 182 },
  { number: 38, name: "ص", nameEn: "Sad", verseCount: 88 },
  { number: 39, name: "الزمر", nameEn: "Az-Zumar", verseCount: 75 },
  { number: 40, name: "غافر", nameEn: "Ghafir", verseCount: 85 },
  { number: 41, name: "فصلت", nameEn: "Fussilat", verseCount: 54 },
  { number: 42, name: "الشورى", nameEn: "Ash-Shura", verseCount: 53 },
  { number: 43, name: "الزخرف", nameEn: "Az-Zukhruf", verseCount: 89 },
  { number: 44, name: "الدخان", nameEn: "Ad-Dukhan", verseCount: 59 },
  { number: 45, name: "الجاثية", nameEn: "Al-Jathiya", verseCount: 37 },
  { number: 46, name: "الأحقاف", nameEn: "Al-Ahqaf", verseCount: 35 },
  { number: 47, name: "محمد", nameEn: "Muhammad", verseCount: 38 },
  { number: 48, name: "الفتح", nameEn: "Al-Fath", verseCount: 29 },
  { number: 49, name: "الحجرات", nameEn: "Al-Hujurat", verseCount: 18 },
  { number: 50, name: "ق", nameEn: "Qaf", verseCount: 45 },
  { number: 51, name: "الذاريات", nameEn: "Adh-Dhariyat", verseCount: 60 },
  { number: 52, name: "الطور", nameEn: "At-Tur", verseCount: 49 },
  { number: 53, name: "النجم", nameEn: "An-Najm", verseCount: 62 },
  { number: 54, name: "القمر", nameEn: "Al-Qamar", verseCount: 55 },
  { number: 55, name: "الرحمن", nameEn: "Ar-Rahman", verseCount: 78 },
  { number: 56, name: "الواقعة", nameEn: "Al-Waqi'a", verseCount: 96 },
  { number: 57, name: "الحديد", nameEn: "Al-Hadid", verseCount: 29 },
  { number: 58, name: "المجادلة", nameEn: "Al-Mujadila", verseCount: 22 },
  { number: 59, name: "الحشر", nameEn: "Al-Hashr", verseCount: 24 },
  { number: 60, name: "الممتحنة", nameEn: "Al-Mumtahina", verseCount: 13 },
  { number: 61, name: "الصف", nameEn: "As-Saff", verseCount: 14 },
  { number: 62, name: "الجمعة", nameEn: "Al-Jumu'a", verseCount: 11 },
  { number: 63, name: "المنافقون", nameEn: "Al-Munafiqun", verseCount: 11 },
  { number: 64, name: "التغابن", nameEn: "At-Taghabun", verseCount: 18 },
  { number: 65, name: "الطلاق", nameEn: "At-Talaq", verseCount: 12 },
  { number: 66, name: "التحريم", nameEn: "At-Tahrim", verseCount: 12 },
  { number: 67, name: "الملك", nameEn: "Al-Mulk", verseCount: 30 },
  { number: 68, name: "القلم", nameEn: "Al-Qalam", verseCount: 52 },
  { number: 69, name: "الحاقة", nameEn: "Al-Haqqa", verseCount: 52 },
  { number: 70, name: "المعارج", nameEn: "Al-Ma'arij", verseCount: 44 },
  { number: 71, name: "نوح", nameEn: "Nuh", verseCount: 28 },
  { number: 72, name: "الجن", nameEn: "Al-Jinn", verseCount: 28 },
  { number: 73, name: "المزمل", nameEn: "Al-Muzzammil", verseCount: 20 },
  { number: 74, name: "المدثر", nameEn: "Al-Muddaththir", verseCount: 56 },
  { number: 75, name: "القيامة", nameEn: "Al-Qiyama", verseCount: 40 },
  { number: 76, name: "الإنسان", nameEn: "Al-Insan", verseCount: 31 },
  { number: 77, name: "المرسلات", nameEn: "Al-Mursalat", verseCount: 50 },
  { number: 78, name: "النبأ", nameEn: "An-Naba", verseCount: 40 },
  { number: 79, name: "النازعات", nameEn: "An-Nazi'at", verseCount: 46 },
  { number: 80, name: "عبس", nameEn: "Abasa", verseCount: 42 },
  { number: 81, name: "التكوير", nameEn: "At-Takwir", verseCount: 29 },
  { number: 82, name: "الانفطار", nameEn: "Al-Infitar", verseCount: 19 },
  { number: 83, name: "المطففين", nameEn: "Al-Mutaffifin", verseCount: 36 },
  { number: 84, name: "الانشقاق", nameEn: "Al-Inshiqaq", verseCount: 25 },
  { number: 85, name: "البروج", nameEn: "Al-Buruj", verseCount: 22 },
  { number: 86, name: "الطارق", nameEn: "At-Tariq", verseCount: 17 },
  { number: 87, name: "الأعلى", nameEn: "Al-A'la", verseCount: 19 },
  { number: 88, name: "الغاشية", nameEn: "Al-Ghashiya", verseCount: 26 },
  { number: 89, name: "الفجر", nameEn: "Al-Fajr", verseCount: 30 },
  { number: 90, name: "البلد", nameEn: "Al-Balad", verseCount: 20 },
  { number: 91, name: "الشمس", nameEn: "Ash-Shams", verseCount: 15 },
  { number: 92, name: "الليل", nameEn: "Al-Layl", verseCount: 21 },
  { number: 93, name: "الضحى", nameEn: "Ad-Duha", verseCount: 11 },
  { number: 94, name: "الشرح", nameEn: "Ash-Sharh", verseCount: 8 },
  { number: 95, name: "التين", nameEn: "At-Tin", verseCount: 8 },
  { number: 96, name: "العلق", nameEn: "Al-Alaq", verseCount: 19 },
  { number: 97, name: "القدر", nameEn: "Al-Qadr", verseCount: 5 },
  { number: 98, name: "البينة", nameEn: "Al-Bayyina", verseCount: 8 },
  { number: 99, name: "الزلزلة", nameEn: "Az-Zalzala", verseCount: 8 },
  { number: 100, name: "العاديات", nameEn: "Al-Adiyat", verseCount: 11 },
  { number: 101, name: "القارعة", nameEn: "Al-Qari'a", verseCount: 11 },
  { number: 102, name: "التكاثر", nameEn: "At-Takathur", verseCount: 8 },
  { number: 103, name: "العصر", nameEn: "Al-Asr", verseCount: 3 },
  { number: 104, name: "الهمزة", nameEn: "Al-Humaza", verseCount: 9 },
  { number: 105, name: "الفيل", nameEn: "Al-Fil", verseCount: 5 },
  { number: 106, name: "قريش", nameEn: "Quraysh", verseCount: 4 },
  { number: 107, name: "الماعون", nameEn: "Al-Ma'un", verseCount: 7 },
  { number: 108, name: "الكوثر", nameEn: "Al-Kawthar", verseCount: 3 },
  { number: 109, name: "الكافرون", nameEn: "Al-Kafirun", verseCount: 6 },
  { number: 110, name: "النصر", nameEn: "An-Nasr", verseCount: 3 },
  { number: 111, name: "المسد", nameEn: "Al-Masad", verseCount: 5 },
  { number: 112, name: "الإخلاص", nameEn: "Al-Ikhlas", verseCount: 4 },
  { number: 113, name: "الفلق", nameEn: "Al-Falaq", verseCount: 5 },
  { number: 114, name: "الناس", nameEn: "An-Nas", verseCount: 6 },
] as const;

export const SURAH_COUNT = 114;
export const LANGUAGE_CODE = "ar-SA";

// IndexedDB configuration
export const DB_NAME = "quran-teleprompter";
export const DB_VERSION = 5;
export const STORE_NAME = "cache";
export const CACHE_KEY = "quran-data";
export const BOOKMARKS_STORE = "bookmarks";
export const CONTINUE_STORE = "continue";

// Word matching configuration
export const WINDOW_MULTIPLIER = 1.1; // Scale spoken word count to account for speech API under-delivering
export const LOOKAHEAD_PADDING = 8; // Extra words beyond scaled count in search window
export const MAX_DISTANCE_RATIO = 0.6; // Reject match if edit distance > perc% of spoken phrase length
export const MIN_SUFFIX_RATIO = 0.8; // Trimmed suffix must retain at least this fraction of fixedRef length
export const MIN_SUFFIX_TOKENS = 3; // Stop trimming if suffix has fewer than this many tokens

// Timing configuration (ms)
export const ERROR_DISMISS_DELAY = 3000;

// Standalone tajweed/juz mark codepoints that appear as whitespace-delimited tokens in uthmani
export const TAJWEED_MARKS = new Set([
  "\u06D6", // ۖ small high sad
  "\u06D7", // ۗ small high ain
  "\u06D8", // ۘ small high meem initial
  "\u06D9", // ۙ small high lam alef
  "\u06DA", // ۚ small meem
  "\u06DB", // ۛ small high three dots
  "\u06DC", // ۜ small high seen
  "\u06DE", // ۞ rub el hizb
  "\u06E9", // ۩ place of sajdah
]);
