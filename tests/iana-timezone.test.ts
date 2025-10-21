import { describe, it, expect } from "vitest";
import { DateKit } from "../src/DateKit";

describe("DateKit IANA Timezone Support", () => {
  describe("formatInTimezone", () => {
    it("should format UTC date in Asia/Dhaka timezone", () => {
      const utcDate = new Date("2025-08-31T00:00:00Z");
      const result = DateKit.formatInTimezone(
        utcDate,
        "Asia/Dhaka",
        "DD-MM-YYYY HH:mm"
      );
      expect(result).toBe("31-08-2025 06:00"); // UTC+6
    });

    it("should format UTC date in America/New_York timezone", () => {
      const utcDate = new Date("2025-08-31T12:00:00Z");
      const result = DateKit.formatInTimezone(
        utcDate,
        "America/New_York",
        "DD-MM-YYYY HH:mm"
      );
      // EDT is UTC-4 in summer
      expect(result).toBe("31-08-2025 08:00");
    });

    it("should format UTC date in Europe/London timezone", () => {
      const utcDate = new Date("2025-08-31T12:00:00Z");
      const result = DateKit.formatInTimezone(
        utcDate,
        "Europe/London",
        "DD-MM-YYYY HH:mm"
      );
      // BST is UTC+1 in summer
      expect(result).toBe("31-08-2025 13:00");
    });

    it("should format UTC date in Asia/Tokyo timezone", () => {
      const utcDate = new Date("2025-08-31T00:00:00Z");
      const result = DateKit.formatInTimezone(
        utcDate,
        "Asia/Tokyo",
        "DD-MM-YYYY HH:mm"
      );
      expect(result).toBe("31-08-2025 09:00"); // UTC+9
    });

    it("should handle date string input", () => {
      const result = DateKit.formatInTimezone(
        "2025-08-31T00:00:00Z",
        "Asia/Dhaka",
        "DD-MM-YYYY"
      );
      expect(result).toBe("31-08-2025");
    });

    it("should handle timestamp input", () => {
      const timestamp = new Date("2025-08-31T00:00:00Z").getTime();
      const result = DateKit.formatInTimezone(
        timestamp,
        "Asia/Dhaka",
        "DD-MM-YYYY HH:mm"
      );
      expect(result).toBe("31-08-2025 06:00");
    });

    it("should throw error for invalid date", () => {
      expect(() => {
        DateKit.formatInTimezone("invalid", "Asia/Dhaka", "DD-MM-YYYY");
      }).toThrow("Invalid date provided");
    });
  });

  describe("convertTimezone", () => {
    it("should convert from Asia/Dhaka to America/New_York", () => {
      const date = "2025-08-31T14:30:00";
      const result = DateKit.convertTimezone(
        date,
        "Asia/Dhaka",
        "America/New_York",
        "DD-MM-YYYY HH:mm"
      );
      // 14:30 in Dhaka (UTC+6) = 08:30 UTC = 04:30 EDT (UTC-4)
      expect(result).toBe("31-08-2025 04:30");
    });

    it("should convert from America/Los_Angeles to Asia/Tokyo", () => {
      const date = "2025-08-31T09:00:00";
      const result = DateKit.convertTimezone(
        date,
        "America/Los_Angeles",
        "Asia/Tokyo",
        "DD-MM-YYYY HH:mm"
      );
      // 09:00 PDT (UTC-7) = 16:00 UTC = 01:00+1 JST (UTC+9)
      expect(result).toBe("01-09-2025 01:00");
    });

    it("should convert from Europe/Paris to Australia/Sydney", () => {
      const date = "2025-08-31T12:00:00";
      const result = DateKit.convertTimezone(
        date,
        "Europe/Paris",
        "Australia/Sydney",
        "DD-MM-YYYY HH:mm"
      );
      // Summer in Europe (CEST UTC+2), Winter in Australia (AEST UTC+10)
      // 12:00 CEST = 10:00 UTC = 20:00 AEST
      expect(result).toBe("31-08-2025 20:00");
    });

    it("should handle UTC to any timezone", () => {
      const date = "2025-08-31T00:00:00";
      const result = DateKit.convertTimezone(
        date,
        "UTC",
        "Asia/Dhaka",
        "DD-MM-YYYY HH:mm"
      );
      expect(result).toBe("31-08-2025 06:00");
    });

    it("should handle Date object input", () => {
      const date = new Date("2025-08-31T14:30:00Z");
      const result = DateKit.convertTimezone(
        date,
        "UTC",
        "Asia/Dhaka",
        "DD-MM-YYYY HH:mm"
      );
      expect(result).toBe("31-08-2025 20:30");
    });

    it("should throw error for invalid date", () => {
      expect(() => {
        DateKit.convertTimezone("invalid", "UTC", "Asia/Dhaka", "DD-MM-YYYY");
      }).toThrow("Invalid date provided");
    });
  });

  describe("fromTimezone", () => {
    it("should create DateKit from Asia/Dhaka timezone", () => {
      const dk = DateKit.fromTimezone(2025, 8, 31, 14, 30, 0, "Asia/Dhaka");
      // 14:30 in Dhaka (UTC+6) should be 08:30 UTC
      const result = dk.format("YYYY-MM-DD HH:mm");
      expect(result).toBe("2025-08-31 08:30");
    });

    it("should create DateKit from America/New_York timezone", () => {
      const dk = DateKit.fromTimezone(
        2025,
        8,
        31,
        12,
        0,
        0,
        "America/New_York"
      );
      // 12:00 EDT (UTC-4) should be 16:00 UTC
      const result = dk.format("YYYY-MM-DD HH:mm");
      expect(result).toBe("2025-08-31 16:00");
    });

    it("should create DateKit from Europe/London timezone", () => {
      const dk = DateKit.fromTimezone(2025, 8, 31, 13, 45, 30, "Europe/London");
      // 13:45:30 BST (UTC+1) should be 12:45:30 UTC
      const result = dk.format("YYYY-MM-DD HH:mm:ss");
      expect(result).toBe("2025-08-31 12:45:30");
    });

    it("should default to UTC when no timezone specified", () => {
      const dk = DateKit.fromTimezone(2025, 8, 31, 12, 0, 0);
      const result = dk.format("YYYY-MM-DD HH:mm");
      expect(result).toBe("2025-08-31 12:00");
    });

    it("should handle midnight in timezone", () => {
      const dk = DateKit.fromTimezone(2025, 8, 31, 0, 0, 0, "Asia/Dhaka");
      // Midnight in Dhaka should be 18:00 previous day UTC
      const result = dk.format("YYYY-MM-DD HH:mm");
      expect(result).toBe("2025-08-30 18:00");
    });

    it("should handle date with only required parameters", () => {
      const dk = DateKit.fromTimezone(2025, 8, 31, 14, 30, 0, "UTC");
      const result = dk.format("YYYY-MM-DD HH:mm");
      expect(result).toBe("2025-08-31 14:30");
    });
  });

  describe("getTimezoneOffset", () => {
    it("should get offset for Asia/Dhaka", () => {
      const offset = DateKit.getTimezoneOffset("Asia/Dhaka");
      expect(offset).toBe(360); // UTC+6 = 360 minutes
    });

    it("should get offset for America/New_York in summer (EDT)", () => {
      const summerDate = new Date("2025-08-31T12:00:00Z");
      const offset = DateKit.getTimezoneOffset("America/New_York", summerDate);
      expect(offset).toBe(-240); // UTC-4 (EDT) = -240 minutes
    });

    it("should get offset for America/New_York in winter (EST)", () => {
      const winterDate = new Date("2025-01-15T12:00:00Z");
      const offset = DateKit.getTimezoneOffset("America/New_York", winterDate);
      expect(offset).toBe(-300); // UTC-5 (EST) = -300 minutes
    });

    it("should get offset for UTC", () => {
      const offset = DateKit.getTimezoneOffset("UTC");
      expect(offset).toBe(0);
    });

    it("should get offset for Asia/Kolkata (with half-hour offset)", () => {
      const offset = DateKit.getTimezoneOffset("Asia/Kolkata");
      expect(offset).toBe(330); // UTC+5:30 = 330 minutes
    });

    it("should get offset for Asia/Kathmandu (with 45-minute offset)", () => {
      const offset = DateKit.getTimezoneOffset("Asia/Kathmandu");
      expect(offset).toBe(345); // UTC+5:45 = 345 minutes
    });

    it("should handle Australia/Sydney with DST", () => {
      const summerDate = new Date("2025-01-15T12:00:00Z"); // Summer in Australia
      const offset = DateKit.getTimezoneOffset("Australia/Sydney", summerDate);
      expect(offset).toBe(660); // UTC+11 (AEDT) = 660 minutes

      const winterDate = new Date("2025-08-15T12:00:00Z"); // Winter in Australia
      const winterOffset = DateKit.getTimezoneOffset(
        "Australia/Sydney",
        winterDate
      );
      expect(winterOffset).toBe(600); // UTC+10 (AEST) = 600 minutes
    });
  });

  describe("Integration tests", () => {
    it("should handle complex timezone conversions with DST", () => {
      // Test during DST transition periods
      const date = "2025-03-15T12:00:00"; // Around DST transition
      const result = DateKit.convertTimezone(
        date,
        "America/New_York",
        "Europe/London",
        "DD-MM-YYYY HH:mm"
      );
      expect(result).toMatch(/15-03-2025 \d{2}:\d{2}/);
    });

    it("should format the same UTC moment in different timezones", () => {
      const utcDate = new Date("2025-08-31T12:00:00Z");

      const dhaka = DateKit.formatInTimezone(utcDate, "Asia/Dhaka", "HH:mm");
      const newYork = DateKit.formatInTimezone(
        utcDate,
        "America/New_York",
        "HH:mm"
      );
      const tokyo = DateKit.formatInTimezone(utcDate, "Asia/Tokyo", "HH:mm");

      expect(dhaka).toBe("18:00"); // UTC+6
      expect(newYork).toBe("08:00"); // UTC-4 (EDT)
      expect(tokyo).toBe("21:00"); // UTC+9
    });

    it("should round-trip conversion", () => {
      const originalDate = "2025-08-31T14:30:00";

      // Convert from Dhaka to New York and back
      const dk1 = DateKit.fromTimezone(2025, 8, 31, 14, 30, 0, "Asia/Dhaka");
      const nyTime = DateKit.formatInTimezone(
        dk1.toDate(),
        "America/New_York",
        "YYYY-MM-DD HH:mm"
      );

      // Parse the NY time back and convert to Dhaka
      const [datePart, timePart] = nyTime.split(" ");
      const [year, month, day] = datePart.split("-").map(Number);
      const [hour, minute] = timePart.split(":").map(Number);

      const dk2 = DateKit.fromTimezone(
        year,
        month,
        day,
        hour,
        minute,
        0,
        "America/New_York"
      );
      const dhakaTime = DateKit.formatInTimezone(
        dk2.toDate(),
        "Asia/Dhaka",
        "YYYY-MM-DD HH:mm"
      );

      expect(dhakaTime).toBe("2025-08-31 14:30");
    });
  });
});
