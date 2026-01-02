import { expect, test, describe } from "bun:test";
import { QuranDataService } from "../src/services/QuranDataService";

describe("QuranDataService", () => {
  test("should be a singleton", () => {
    const instance1 = QuranDataService.getInstance();
    const instance2 = QuranDataService.getInstance();

    expect(instance1).toBe(instance2);
  });

  test("should have getInstance method", () => {
    expect(typeof QuranDataService.getInstance).toBe("function");
  });

  test("should have loadData method", () => {
    const service = QuranDataService.getInstance();
    expect(typeof service.loadData).toBe("function");
  });

  test("should have getSurah method", () => {
    const service = QuranDataService.getInstance();
    expect(typeof service.getSurah).toBe("function");
  });

  test("should have getVerse method", () => {
    const service = QuranDataService.getInstance();
    expect(typeof service.getVerse).toBe("function");
  });

  test("should have getAllSurahs method", () => {
    const service = QuranDataService.getInstance();
    expect(typeof service.getAllSurahs).toBe("function");
  });

  test("should have clearCache method", () => {
    const service = QuranDataService.getInstance();
    expect(typeof service.clearCache).toBe("function");
  });
});
