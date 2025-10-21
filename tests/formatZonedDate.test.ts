import { describe, it, expect } from "vitest";
import { DateKit } from "../src/DateKit";

describe("DateKit.formatZonedDate", () => {
  describe("Static method", () => {
    it("should format date with GMT+0600 timezone", () => {
      const input =
        "Sun Aug 31 2025 00:00:00 GMT+0600 (Bangladesh Standard Time)";
      const result = DateKit.formatZonedDate(input, "DD-MM-YYYY");
      expect(result).toBe("31-08-2025");
    });

    it("should format with different output format", () => {
      const input =
        "Sun Aug 31 2025 00:00:00 GMT+0600 (Bangladesh Standard Time)";
      const result = DateKit.formatZonedDate(input, "YYYY/MM/DD");
      expect(result).toBe("2025/08/31");
    });

    it("should handle GMT-0500 timezone", () => {
      const input = "Mon Dec 25 2024 10:30:00 GMT-0500 (Eastern Standard Time)";
      const result = DateKit.formatZonedDate(input, "DD-MM-YYYY HH:mm");
      expect(result).toBe("25-12-2024 10:30");
    });

    it("should handle GMT+0000 (UTC)", () => {
      const input =
        "Wed Jan 01 2025 12:00:00 GMT+0000 (Coordinated Universal Time)";
      const result = DateKit.formatZonedDate(input, "DD/MM/YYYY HH:mm:ss");
      expect(result).toBe("01/01/2025 12:00:00");
    });

    it("should handle GMT+0530 (India Standard Time)", () => {
      const input = "Thu Feb 15 2025 14:45:30 GMT+0530 (India Standard Time)";
      const result = DateKit.formatZonedDate(input, "DD-MM-YYYY HH:mm:ss");
      expect(result).toBe("15-02-2025 14:45:30");
    });

    it("should handle negative timezone GMT-0800", () => {
      const input = "Fri Mar 21 2025 08:00:00 GMT-0800 (Pacific Standard Time)";
      const result = DateKit.formatZonedDate(input, "DD-MM-YYYY");
      expect(result).toBe("21-03-2025");
    });

    it("should use default format when not specified", () => {
      const input =
        "Sun Aug 31 2025 00:00:00 GMT+0600 (Bangladesh Standard Time)";
      const result = DateKit.formatZonedDate(input);
      expect(result).toBe("31-08-2025"); // Default is DD-MM-YYYY
    });

    it("should handle timezone without colon separator", () => {
      const input = "Mon Jan 20 2025 06:30:00 GMT+0545 (Nepal Time)";
      const result = DateKit.formatZonedDate(input, "DD-MM-YYYY HH:mm");
      expect(result).toBe("20-01-2025 06:30");
    });

    it("should throw error for non-string input", () => {
      expect(() => {
        // @ts-expect-error - Testing invalid input
        DateKit.formatZonedDate(12345, "DD-MM-YYYY");
      }).toThrow(
        "formatZonedDate expects input as a string with explicit GMT offset"
      );
    });

    it("should throw error for invalid date string", () => {
      expect(() => {
        DateKit.formatZonedDate("Invalid date string", "DD-MM-YYYY");
      }).toThrow("Invalid date input for formatZonedDate");
    });

    it("should preserve midnight correctly across different timezones", () => {
      const input = "Sat Jul 04 2025 00:00:00 GMT-0700 (Pacific Daylight Time)";
      const result = DateKit.formatZonedDate(input, "DD-MM-YYYY HH:mm");
      expect(result).toBe("04-07-2025 00:00");
    });

    it("should handle end of day time", () => {
      const input = "Mon Dec 31 2025 23:59:59 GMT+0100 (Central European Time)";
      const result = DateKit.formatZonedDate(input, "DD/MM/YYYY HH:mm:ss");
      expect(result).toBe("31/12/2025 23:59:59");
    });

    it("should accept custom locale parameter", () => {
      const input =
        "Fri Mar 15 2024 14:30:00 GMT+0600 (Bangladesh Standard Time)";
      const result = DateKit.formatZonedDate(input, "MMMM DD, YYYY", "en");
      expect(result).toBe("March 15, 2024");
    });
  });

  describe("Instance method", () => {
    it("should use instance locale for formatting", () => {
      const dk = new DateKit("2025-01-15", { locale: "es" });
      const input =
        "Fri Mar 15 2024 14:30:00 GMT+0600 (Bangladesh Standard Time)";
      const result = dk.formatZonedDate(input, "MMMM DD, YYYY");
      expect(result).toBe("Marzo 15, 2024"); // Spanish month name
    });

    it("should format with instance's default locale (en)", () => {
      const dk = new DateKit("2025-01-15"); // Default locale is 'en'
      const input =
        "Sun Aug 31 2025 00:00:00 GMT+0600 (Bangladesh Standard Time)";
      const result = dk.formatZonedDate(input, "DD-MM-YYYY");
      expect(result).toBe("31-08-2025");
    });

    it("should use default output format when not specified", () => {
      const dk = new DateKit("2025-01-15");
      const input =
        "Sun Aug 31 2025 00:00:00 GMT+0600 (Bangladesh Standard Time)";
      const result = dk.formatZonedDate(input);
      expect(result).toBe("31-08-2025"); // Default is DD-MM-YYYY
    });

    it("should handle different timezones with instance method", () => {
      const dk = new DateKit("2025-01-15");
      const input1 =
        "Mon Dec 25 2024 10:30:00 GMT-0500 (Eastern Standard Time)";
      const input2 =
        "Mon Dec 25 2024 16:30:00 GMT+0100 (Central European Time)";

      expect(dk.formatZonedDate(input1, "HH:mm")).toBe("10:30");
      expect(dk.formatZonedDate(input2, "HH:mm")).toBe("16:30");
    });

    it("should work with Spanish locale", () => {
      const dk = new DateKit("2025-01-15", { locale: "es" });
      const input = "Fri Mar 15 2024 14:30:00 GMT+0600";
      const result = dk.formatZonedDate(input, "MMMM DD, YYYY");
      expect(result).toBe("Marzo 15, 2024"); // Spanish month name
    });

    it("should fallback to 'en' locale when instance has no locale configured", () => {
      const dk = new DateKit("2025-01-15", {});
      const input = "Fri Mar 15 2024 14:30:00 GMT+0600";
      const result = dk.formatZonedDate(input, "MMMM");
      expect(result).toBe("March");
    });
  });

  describe("Comparison with formatFromTimezoneString", () => {
    it("should produce same result as formatFromTimezoneString", () => {
      const input =
        "Sun Aug 31 2025 00:00:00 GMT+0600 (Bangladesh Standard Time)";
      const format = "DD-MM-YYYY HH:mm:ss";

      const result1 = DateKit.formatZonedDate(input, format);
      const result2 = DateKit.formatFromTimezoneString(input, format);

      expect(result1).toBe(result2);
    });

    it("should handle edge cases consistently", () => {
      const inputs = [
        "Mon Dec 25 2024 10:30:00 GMT-0500 (Eastern Standard Time)",
        "Thu Feb 15 2025 14:45:30 GMT+0530 (India Standard Time)",
        "Fri Mar 21 2025 08:00:00 GMT-0800 (Pacific Standard Time)",
      ];

      inputs.forEach((input) => {
        const result1 = DateKit.formatZonedDate(input, "YYYY-MM-DD HH:mm");
        const result2 = DateKit.formatFromTimezoneString(
          input,
          "YYYY-MM-DD HH:mm"
        );
        expect(result1).toBe(result2);
      });
    });
  });
});
