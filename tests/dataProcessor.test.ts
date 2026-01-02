import { expect, test, describe } from "bun:test";
import { processQuranData, findSurahByNumber, findVerseByNumber } from "../src/utils/dataProcessor";
import type { QuranRawData } from "../src/types";

describe("dataProcessor", () => {
  const mockRawData: QuranRawData = {
    uthmani: [
      [
        "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ",
        "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ"
      ],
      [
        "ٱلْم",
        "ذَٰلِكَ ٱلْكِتَـٰبُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ"
      ]
    ],
    simple: [
      [
        "بسم الله الرحمن الرحيم",
        "الحمد لله رب العالمين"
      ],
      [
        "الم",
        "ذلك الكتاب لا ريب فيه هدى للمتقين"
      ]
    ]
  };

  describe("processQuranData", () => {
    test("should process raw data into QuranData", () => {
      const result = processQuranData(mockRawData);
      
      expect(result).toHaveProperty("surahs");
      expect(Array.isArray(result.surahs)).toBe(true);
      expect(result.surahs.length).toBe(2);
    });

    test("should create Surah objects with correct structure", () => {
      const result = processQuranData(mockRawData);
      const surah = result.surahs[0];

      expect(surah).toHaveProperty("number");
      expect(surah).toHaveProperty("name");
      expect(surah).toHaveProperty("nameEn");
      expect(surah).toHaveProperty("verses");
      expect(surah).toHaveProperty("verseCount");
    });

    test("should create Verse objects with correct structure", () => {
      const result = processQuranData(mockRawData);
      const verse = result.surahs[0].verses[0];

      expect(verse).toHaveProperty("number");
      expect(verse).toHaveProperty("uthmani");
      expect(verse).toHaveProperty("simple");
      expect(verse).toHaveProperty("words");
      expect(Array.isArray(verse.words)).toBe(true);
    });

    test("should create Word objects with correct structure", () => {
      const result = processQuranData(mockRawData);
      const word = result.surahs[0].verses[0].words[0];

      expect(word).toHaveProperty("uthmani");
      expect(word).toHaveProperty("simple");
      expect(word).toHaveProperty("highlighted");
      expect(word.highlighted).toBe(false);
    });

    test("should correctly map verse numbers", () => {
      const result = processQuranData(mockRawData);
      const surah = result.surahs[0];

      expect(surah.verses[0].number).toBe(1);
      expect(surah.verses[1].number).toBe(2);
    });

    test("should correctly split verses into words", () => {
      const result = processQuranData(mockRawData);
      const verse = result.surahs[0].verses[0];

      expect(verse.words.length).toBeGreaterThan(0);
      expect(verse.words[0].uthmani).toBe("بِسْمِ");
      expect(verse.words[0].simple).toBe("بسم");
    });

    test("should preserve uthmani text", () => {
      const result = processQuranData(mockRawData);
      const verse = result.surahs[0].verses[0];

      expect(verse.uthmani).toBe("بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ");
    });

    test("should preserve simple text", () => {
      const result = processQuranData(mockRawData);
      const verse = result.surahs[0].verses[0];

      expect(verse.simple).toBe("بسم الله الرحمن الرحيم");
    });

    test("should handle empty verses", () => {
      const emptyData: QuranRawData = {
        uthmani: [[]],
        simple: [[]]
      };
      
      const result = processQuranData(emptyData);
      expect(result.surahs[0].verses.length).toBe(0);
    });

    test("should handle different word counts between uthmani and simple", () => {
      const unevenData: QuranRawData = {
        uthmani: [["test word extra"]],
        simple: [["test word"]]
      };
      
      const result = processQuranData(unevenData);
      const verse = result.surahs[0].verses[0];
      
      expect(verse.words.length).toBe(3);
      expect(verse.words[2].uthmani).toBe("extra");
      expect(verse.words[2].simple).toBe("");
    });
  });

  describe("findSurahByNumber", () => {
    test("should find surah by number", () => {
      const result = processQuranData(mockRawData);
      const surah = findSurahByNumber(1, result);

      expect(surah).toBeDefined();
      expect(surah?.number).toBe(1);
    });

    test("should return undefined for non-existent surah", () => {
      const result = processQuranData(mockRawData);
      const surah = findSurahByNumber(999, result);

      expect(surah).toBeUndefined();
    });
  });

  describe("findVerseByNumber", () => {
    test("should find verse by number", () => {
      const result = processQuranData(mockRawData);
      const surah = result.surahs[0];
      const verse = findVerseByNumber(surah, 1);

      expect(verse).toBeDefined();
      expect(verse?.number).toBe(1);
    });

    test("should return undefined for non-existent verse", () => {
      const result = processQuranData(mockRawData);
      const surah = result.surahs[0];
      const verse = findVerseByNumber(surah, 999);

      expect(verse).toBeUndefined();
    });
  });
});
