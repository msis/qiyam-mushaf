import { expect, test, describe, beforeAll } from "bun:test";
import { processQuranData, findSurahByNumber, findVerseByNumber } from "../src/utils/dataProcessor";
import { SURAH_NAMES } from "../src/utils/constants";

describe("Integration: Real Quran Data", () => {
  let processedData: any;

  beforeAll(async () => {
    const [uthmaniData, simpleData] = await Promise.all([
      Bun.file("./public/data/quran-uthmani-list.json").json() as Promise<string[][]>,
      Bun.file("./public/data/quran-simple-clean-list.json").json() as Promise<string[][]>
    ]);

    const rawData = {
      uthmani: uthmaniData,
      simple: simpleData
    };

    processedData = processQuranData(rawData);
  });

  test("should load all 114 surahs", () => {
    expect(processedData.surahs.length).toBe(114);
  });

  test("should match surah counts from constants", () => {
    processedData.surahs.forEach((surah: any, index: number) => {
      const expected = SURAH_NAMES[index];
      expect(surah.verseCount).toBe(expected.verseCount);
    });
  });

  test("should have valid verse data for each surah", () => {
    processedData.surahs.forEach((surah: any) => {
      expect(surah.verses.length).toBeGreaterThan(0);
      expect(surah.verses.length).toBe(surah.verseCount);
    });
  });

  test("should find Surah Al-Fatiha", () => {
    const surah = findSurahByNumber(1, processedData);
    
    expect(surah).toBeDefined();
    expect(surah?.number).toBe(1);
    expect(surah?.name).toBe("الفاتحة");
    expect(surah?.verseCount).toBe(7);
  });

  test("should find Surah Al-Baqara", () => {
    const surah = findSurahByNumber(2, processedData);
    
    expect(surah).toBeDefined();
    expect(surah?.number).toBe(2);
    expect(surah?.name).toBe("البقرة");
    expect(surah?.verseCount).toBe(286);
  });

  test("should find Surah An-Nas (last surah)", () => {
    const surah = findSurahByNumber(114, processedData);
    
    expect(surah).toBeDefined();
    expect(surah?.number).toBe(114);
    expect(surah?.name).toBe("الناس");
    expect(surah?.verseCount).toBe(6);
  });

  test("should have valid verse structure in Surah 1", () => {
    const surah = findSurahByNumber(1, processedData);
    const verse = surah?.verses[0];
    
    expect(verse).toBeDefined();
    expect(verse?.number).toBe(1);
    expect(verse?.uthmani).toBeTruthy();
    expect(verse?.simple).toBeTruthy();
    expect(verse?.words).toBeInstanceOf(Array);
    expect(verse?.words.length).toBeGreaterThan(0);
  });

  test("should have valid word structure in verse 1", () => {
    const surah = findSurahByNumber(1, processedData);
    const verse = surah?.verses[0];
    const word = verse?.words[0];
    
    expect(word).toBeDefined();
    expect(word?.uthmani).toBeTruthy();
    expect(word?.simple).toBeTruthy();
    expect(word?.highlighted).toBe(false);
  });

  test("should split verse 1 into correct words", () => {
    const surah = findSurahByNumber(1, processedData);
    const verse = surah?.verses[0];
    
    expect(verse?.words.length).toBe(4);
    expect(verse?.words[0].uthmani).toBe("بِسْمِ");
    expect(verse?.words[0].simple).toBe("بسم");
  });

  test("should find specific verse", () => {
    const surah = findSurahByNumber(2, processedData);
    const verse = findVerseByNumber(surah!, 255);
    
    expect(verse).toBeDefined();
    expect(verse?.number).toBe(255);
  });

  test("should handle longest verse (2:282)", () => {
    const surah = findSurahByNumber(2, processedData);
    const verse = findVerseByNumber(surah!, 282);
    
    expect(verse).toBeDefined();
    expect(verse?.words.length).toBeGreaterThan(100);
  });

  test("should have consistent uthmani and simple word counts", () => {
    processedData.surahs.forEach((surah: any) => {
      surah.verses.forEach((verse: any) => {
        const uthmaniWordCount = verse.uthmani.trim().split(/\s+/).length;
        const simpleWordCount = verse.simple.trim().split(/\s+/).length;
        
        expect(verse.words.length).toBe(Math.max(uthmaniWordCount, simpleWordCount));
      });
    });
  });

  test("should not have null or undefined in required fields", () => {
    processedData.surahs.forEach((surah: any) => {
      expect(surah.number).not.toBeNull();
      expect(surah.name).not.toBeNull();
      expect(surah.nameEn).not.toBeNull();
      expect(surah.verses).not.toBeNull();
      
      surah.verses.forEach((verse: any) => {
        expect(verse.number).not.toBeNull();
        expect(verse.uthmani).not.toBeNull();
        expect(verse.simple).not.toBeNull();
        expect(verse.words).not.toBeNull();
        
        verse.words.forEach((word: any) => {
          expect(word.uthmani).not.toBeNull();
          expect(word.simple).not.toBeNull();
          expect(word.highlighted).not.toBeNull();
        });
      });
    });
  });
});
