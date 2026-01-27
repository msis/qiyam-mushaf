import { expect, test, describe } from "bun:test";
import {
  SURAH_NAMES,
  SURAH_COUNT,
  LANGUAGE_CODE,
  CACHE_KEY,
} from "../src/utils/constants";

describe("Constants", () => {
  test("SURAH_COUNT should be 114", () => {
    expect(SURAH_COUNT).toBe(114);
  });

  test("LANGUAGE_CODE should be ar-SA", () => {
    expect(LANGUAGE_CODE).toBe("ar-SA");
  });

  test("SURAH_NAMES should have 114 entries", () => {
    expect(SURAH_NAMES.length).toBe(114);
  });

  test("Each Surah should have required properties", () => {
    SURAH_NAMES.forEach((surah) => {
      expect(surah).toHaveProperty("number");
      expect(surah).toHaveProperty("name");
      expect(surah).toHaveProperty("nameEn");
      expect(surah).toHaveProperty("verseCount");
    });
  });

  test("Surah numbers should be sequential starting from 1", () => {
    SURAH_NAMES.forEach((surah, index) => {
      expect(surah.number).toBe(index + 1);
    });
  });

  test("All verse counts should be greater than 0", () => {
    SURAH_NAMES.forEach((surah) => {
      expect(surah.verseCount).toBeGreaterThan(0);
    });
  });

  test("First surah should be Al-Fatiha with 7 verses", () => {
    const firstSurah = SURAH_NAMES[0];
    expect(firstSurah.number).toBe(1);
    expect(firstSurah.name).toBe("الفاتحة");
    expect(firstSurah.nameEn).toBe("Al-Fatiha");
    expect(firstSurah.verseCount).toBe(7);
  });

  test("Last surah should be An-Nas with 6 verses", () => {
    const lastSurah = SURAH_NAMES[SURAH_NAMES.length - 1];
    expect(lastSurah.number).toBe(114);
    expect(lastSurah.name).toBe("الناس");
    expect(lastSurah.nameEn).toBe("An-Nas");
    expect(lastSurah.verseCount).toBe(6);
  });

  test("CACHE_KEY should be defined", () => {
    expect(CACHE_KEY).toBeTruthy();
    expect(typeof CACHE_KEY).toBe("string");
  });
});
