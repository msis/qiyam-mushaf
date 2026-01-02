export interface Word {
  uthmani: string;
  simple: string;
  highlighted: boolean;
}

export interface Verse {
  number: number;
  uthmani: string;
  simple: string;
  words: Word[];
}

export interface Surah {
  number: number;
  name: string;
  nameEn: string;
  verses: Verse[];
  verseCount: number;
}

export interface QuranUthmaniData {
  [key: string]: string[];
}

export interface QuranSimpleData {
  [key: string]: string[];
}

export interface QuranData {
  surahs: Surah[];
}

export interface QuranRawData {
  uthmani: string[][];
  simple: string[][];
}
