import { describe, it, expect } from "vitest";
import { DateKit } from "../src/DateKit";

describe("DateKit.formatFromTimezoneString", () => {
  it("should format date from GMT+0600 timezone string", () => {
    const input =
      "Sun Aug 31 2025 00:00:00 GMT+0600 (Bangladesh Standard Time)";
    const result = DateKit.formatFromTimezoneString(input, "DD-MM-YYYY");
    expect(result).toBe("31-08-2025");
  });

  it("should preserve the correct date with different format", () => {
    const input =
      "Sun Aug 31 2025 00:00:00 GMT+0600 (Bangladesh Standard Time)";
    const result = DateKit.formatFromTimezoneString(input, "YYYY/MM/DD");
    expect(result).toBe("2025/08/31");
  });

  it("should handle GMT-0500 timezone", () => {
    const input = "Mon Dec 25 2024 10:30:00 GMT-0500 (Eastern Standard Time)";
    const result = DateKit.formatFromTimezoneString(input, "DD-MM-YYYY HH:mm");
    expect(result).toBe("25-12-2024 10:30");
  });

  it("should handle GMT+0000 (UTC)", () => {
    const input =
      "Wed Jan 01 2025 12:00:00 GMT+0000 (Coordinated Universal Time)";
    const result = DateKit.formatFromTimezoneString(
      input,
      "DD/MM/YYYY HH:mm:ss"
    );
    expect(result).toBe("01/01/2025 12:00:00");
  });

  it("should handle GMT+0530 (India Standard Time)", () => {
    const input = "Thu Feb 15 2025 14:45:30 GMT+0530 (India Standard Time)";
    const result = DateKit.formatFromTimezoneString(
      input,
      "DD-MM-YYYY HH:mm:ss"
    );
    expect(result).toBe("15-02-2025 14:45:30");
  });

  it("should handle negative timezone GMT-0800", () => {
    const input = "Fri Mar 21 2025 08:00:00 GMT-0800 (Pacific Standard Time)";
    const result = DateKit.formatFromTimezoneString(input, "DD-MM-YYYY");
    expect(result).toBe("21-03-2025");
  });

  it("should work with different format tokens", () => {
    const input =
      "Sun Aug 31 2025 23:59:59 GMT+0600 (Bangladesh Standard Time)";
    const result = DateKit.formatFromTimezoneString(
      input,
      "MMMM Do, YYYY - h:mm A"
    );
    expect(result).toBe("August 31st, 2025 - 11:59 PM");
  });

  it("should handle timezone without colon separator", () => {
    const input = "Mon Jan 20 2025 06:30:00 GMT+0545 (Nepal Time)";
    const result = DateKit.formatFromTimezoneString(input, "DD-MM-YYYY HH:mm");
    expect(result).toBe("20-01-2025 06:30");
  });

  it("should throw error for invalid date string", () => {
    const input = "Invalid date string";
    expect(() => {
      DateKit.formatFromTimezoneString(input, "DD-MM-YYYY");
    }).toThrow("Invalid date string provided");
  });

  it("should handle date with milliseconds", () => {
    const input =
      "Tue Apr 01 2025 12:30:45 GMT+0200 (Central European Summer Time)";
    const result = DateKit.formatFromTimezoneString(
      input,
      "YYYY-MM-DD HH:mm:ss"
    );
    expect(result).toBe("2025-04-01 12:30:45");
  });

  it("should preserve midnight correctly across different timezones", () => {
    const input = "Sat Jul 04 2025 00:00:00 GMT-0700 (Pacific Daylight Time)";
    const result = DateKit.formatFromTimezoneString(input, "DD-MM-YYYY HH:mm");
    expect(result).toBe("04-07-2025 00:00");
  });

  it("should handle end of day time", () => {
    const input = "Mon Dec 31 2025 23:59:59 GMT+0100 (Central European Time)";
    const result = DateKit.formatFromTimezoneString(
      input,
      "DD/MM/YYYY HH:mm:ss"
    );
    expect(result).toBe("31/12/2025 23:59:59");
  });
});
