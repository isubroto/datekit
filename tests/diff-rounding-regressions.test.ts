import { describe, expect, it } from "vitest";
import { DateKit } from "../src";

describe("diff rounding regressions", () => {
  const start = new DateKit("2024-01-01T00:00:00.000Z");
  const end = new DateKit("2024-03-15T14:30:00.000Z");

  it("truncates integer differences toward zero by default", () => {
    expect(start.diff(end, "day")).toBe(-end.diff(start, "day"));
    expect(start.diff(end, "day", { roundingMode: "trunc" })).toBe(-74);
  });

  it("keeps reverse quarter differences symmetrical", () => {
    const laterQuarter = new DateKit("2024-05-15T00:00:00.000Z");

    expect(start.diff(laterQuarter, "quarter")).toBe(
      -laterQuarter.diff(start, "quarter")
    );
  });

  it("supports explicit integer rounding modes", () => {
    const oneAndAHalfDaysLater = new DateKit("2024-01-02T12:00:00.000Z");

    expect(
      start.diff(oneAndAHalfDaysLater, "day", { roundingMode: "floor" })
    ).toBe(-2);
    expect(
      start.diff(oneAndAHalfDaysLater, "day", { roundingMode: "ceil" })
    ).toBe(-1);
    expect(
      start.diff(oneAndAHalfDaysLater, "day", { roundingMode: "halfExpand" })
    ).toBe(-2);
  });

  it("preserves the boolean precise-difference API", () => {
    expect(start.diff(end, "day", true)).toBeCloseTo(-74.6041666667);
  });
});
