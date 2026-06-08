import { describe, expect, it } from "vitest";
import { DateKit } from "../src";

describe("strict parsing overflow regressions", () => {
  it("rejects impossible custom-format dates and times by default", () => {
    expect(() => DateKit.parse("31/02/2025", "DD/MM/YYYY")).toThrow();
    expect(() => DateKit.parse("2025-13-01", "YYYY-MM-DD")).toThrow();
    expect(() =>
      DateKit.parse("2025-01-01 24:60", "YYYY-MM-DD HH:mm")
    ).toThrow();
  });

  it("handles years from 0000 through 0099 without the 1900 offset", () => {
    expect(DateKit.parse("0050-01-01", "YYYY-MM-DD").year()).toBe(50);
    expect(DateKit.parse("0000-01-01", "YYYY-MM-DD").year()).toBe(0);
  });

  it("applies leap-year and century-year rules", () => {
    expect(DateKit.parse("2024-02-29", "YYYY-MM-DD").toObject().date).toBe(29);
    expect(() => DateKit.parse("2023-02-29", "YYYY-MM-DD")).toThrow();
    expect(() => DateKit.parse("1900-02-29", "YYYY-MM-DD")).toThrow();
    expect(DateKit.parse("2000-02-29", "YYYY-MM-DD").toObject().date).toBe(29);
  });

  it("rejects dates beyond each month's length", () => {
    expect(() => DateKit.parse("2025-04-31", "YYYY-MM-DD")).toThrow();
    expect(() => DateKit.parse("2025-06-31", "YYYY-MM-DD")).toThrow();
    expect(() => DateKit.parse("2025-09-31", "YYYY-MM-DD")).toThrow();
    expect(() => DateKit.parse("2025-11-31", "YYYY-MM-DD")).toThrow();
  });

  it("rejects negative years", () => {
    expect(() => DateKit.parse("-001-01-01", "YYYY-MM-DD")).toThrow();
    expect(
      () => new DateKit("-001-01-01", { strictParsing: true })
    ).toThrow();
  });

  it("rejects impossible ISO dates in strict parsing mode", () => {
    expect(
      () => new DateKit("2025-02-31", { strictParsing: true })
    ).toThrow();
    expect(
      () => new DateKit("2025-13-01", { strictParsing: true })
    ).toThrow();
    expect(
      () => new DateKit("2025-01-01T24:60:00Z", { strictParsing: true })
    ).toThrow();
    expect(
      () => new DateKit("2025-01-01T00:00:60Z", { strictParsing: true })
    ).toThrow();
    expect(
      () => new DateKit("2025-01-01T00:00:00+24:00", { strictParsing: true })
    ).toThrow();
    expect(new DateKit("0050-01-01", { strictParsing: true }).year()).toBe(50);
  });

  it("supports explicit constrain and balance modes", () => {
    expect(
      DateKit.parse("31/02/2025", "DD/MM/YYYY", {
        overflow: "constrain",
      }).format("YYYY-MM-DD")
    ).toBe("2025-02-28");
    expect(
      DateKit.parse("31/02/2025", "DD/MM/YYYY", {
        overflow: "balance",
      }).format("YYYY-MM-DD")
    ).toBe("2025-03-03");
    expect(
      new DateKit("2025-02-31", { overflow: "constrain" }).format("YYYY-MM-DD")
    ).toBe("2025-02-28");
    expect(
      new DateKit("2025-02-31", { overflow: "balance" }).format("YYYY-MM-DD")
    ).toBe("2025-03-03");
  });
});
