import { describe, expect, it } from "vitest";
import { DateKit, DateRange } from "../src";

describe("date input regressions", () => {
  it("constructs the Unix epoch from timestamp 0", () => {
    const epoch = new DateKit(0);

    expect(epoch.valueOf()).toBe(0);
    expect(epoch.toISOString()).toBe("1970-01-01T00:00:00.000Z");
  });

  it("rejects explicit invalid constructor inputs", () => {
    expect(() => new DateKit("")).toThrow("Invalid date provided");
    expect(() => new DateKit(null as unknown as number)).toThrow(
      "Invalid date input"
    );
  });

  it("preserves timestamp 0 in DateRange endpoints", () => {
    const range = new DateRange(0, 1_000);

    expect(range.start.valueOf()).toBe(0);
    expect(range.end.valueOf()).toBe(1_000);
  });

  it("uses timestamp 0 in optional-reference methods", () => {
    expect(new DateKit(86_400_000).calendar(0)).toBe("Tomorrow at 00:00");
    expect(new DateKit(1_000).duration(0).asMilliseconds()).toBe(1_000);
    expect(new DateKit("1969-01-01T00:00:00.000Z").age(0)).toBe(1);
    expect(DateKit.utc(0).valueOf()).toBe(0);
  });

  it("rejects empty strings in optional-reference methods", () => {
    const date = new DateKit(0);

    expect(() => date.calendar("")).toThrow("Invalid date provided");
    expect(() => date.duration("")).toThrow("Invalid date provided");
    expect(() => date.age("")).toThrow("Invalid date provided");
    expect(() => DateKit.utc("")).toThrow("Invalid date provided");
  });
});
