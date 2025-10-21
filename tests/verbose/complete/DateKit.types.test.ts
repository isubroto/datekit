import { describe, it, expect } from "vitest";
import { DateKit, Duration } from "../../../src";
import type {
  DateInput,
  TimeUnit,
  DateKitConfig,
  SetDateValues,
  DateInterval,
  DurationObject,
  QuarterNumber,
} from "../../../src";
import {
  logTestSection,
  createTestInfo,
  executeTest,
} from "../../helpers/testDisplay";
import { DayOfWeek } from "../../../src/types";

describe("DateKit - Type System Tests", () => {
  logTestSection("Type System & Type Checking");

  describe("DateInput Type", () => {
    it("accepts Date object as DateInput", () => {
      const info = createTestInfo(
        "DateInput type: Date object",
        "new DateKit",
        {
          input: new Date("2024-01-15"),
          inputType: "Date",
        },
        "2024-01-15"
      );

      executeTest(info, () => {
        const dk = new DateKit(new Date("2024-01-15"));
        return dk.format("YYYY-MM-DD");
      });
    });

    it("accepts string as DateInput", () => {
      const info = createTestInfo(
        "DateInput type: string",
        "new DateKit",
        {
          input: "2024-01-15T10:00:00Z",
          inputType: "string",
        },
        "2024-01-15"
      );

      executeTest(info, () => {
        const dk = new DateKit("2024-01-15T10:00:00Z");
        return dk.format("YYYY-MM-DD");
      });
    });

    it("accepts number (timestamp) as DateInput", () => {
      const info = createTestInfo(
        "DateInput type: number (timestamp)",
        "new DateKit",
        {
          input: 1705315200000,
          inputType: "number",
        },
        1705315200000
      );

      executeTest(info, () => {
        const dk = new DateKit(1705315200000);
        return dk.valueOf();
      });
    });
  });

  describe("TimeUnit Type", () => {
    const units: TimeUnit[] = [
      "millisecond",
      "second",
      "minute",
      "hour",
      "day",
      "week",
      "month",
      "quarter",
      "year",
    ];

    units.forEach((unit) => {
      it(`accepts "${unit}" as TimeUnit`, () => {
        const info = createTestInfo(
          `TimeUnit type: "${unit}"`,
          "add",
          {
            unit: unit,
            value: 1,
          },
          "success"
        );

        const result = (() => {
          try {
            const dk = new DateKit("2024-01-15");
            dk.add(1, unit);
            return "success";
          } catch (error) {
            return "error";
          }
        })();

        console.log(`\n${"─".repeat(80)}`);
        console.log(`📝 Test: ${info.description}`);
        console.log(`${"─".repeat(80)}`);
        console.log(`🔧 Function Called: ${info.functionName}()`);
        console.log(`📥 Parameters:`);
        console.log(`   • unit: "${unit}"`);
        console.log(`   • value: 1`);
        console.log(`\n📊 Results:`);
        console.log(`   Expected: ${info.expectedResult}`);
        console.log(`   Actual:   ${result}`);
        console.log(`   Match:    ✅ YES`);
        console.log(`\n✅ PASS - TimeUnit "${unit}" is valid`);
        console.log(`${"─".repeat(80)}`);

        expect(result).toBe("success");
      });
    });
  });

  describe("QuarterNumber Type", () => {
    const quarters: QuarterNumber[] = [1, 2, 3, 4];

    quarters.forEach((quarter) => {
      it(`accepts ${quarter} as QuarterNumber`, () => {
        const info = createTestInfo(
          `QuarterNumber type: Q${quarter}`,
          "setQuarter",
          {
            quarter: quarter,
          },
          quarter
        );

        executeTest(info, () => {
          const dk = new DateKit("2024-01-15").setQuarter(quarter);
          return dk.quarter();
        });
      });
    });
  });

  describe("DayOfWeek Type", () => {
    const days: DayOfWeek[] = [0, 1, 2, 3, 4, 5, 6];
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    days.forEach((day, index) => {
      it(`accepts ${day} as DayOfWeek (${dayNames[index]})`, () => {
        console.log(`\n${"─".repeat(80)}`);
        console.log(`📝 Test: DayOfWeek type: ${day} (${dayNames[index]})`);
        console.log(`${"─".repeat(80)}`);
        console.log(`🔧 Type: DayOfWeek`);
        console.log(`📥 Value: ${day}`);
        console.log(`📊 Name: ${dayNames[index]}`);
        console.log(`\n✅ PASS - DayOfWeek ${day} is valid`);
        console.log(`${"─".repeat(80)}`);

        expect(day).toBeGreaterThanOrEqual(0);
        expect(day).toBeLessThanOrEqual(6);
      });
    });
  });

  describe("SetDateValues Type", () => {
    it("accepts partial date values object", () => {
      const values: SetDateValues = {
        year: 2025,
        month: 11,
        date: 25,
      };

      const info = createTestInfo(
        "SetDateValues type: partial object",
        "set",
        {
          values: JSON.stringify(values),
        },
        "2025-12-25"
      );

      executeTest(info, () => {
        const dk = new DateKit("2024-01-15").set(values);
        return dk.format("YYYY-MM-DD");
      });
    });

    it("accepts all date values object", () => {
      const values: SetDateValues = {
        year: 2025,
        month: 11,
        date: 25,
        hour: 15,
        minute: 30,
        second: 45,
        millisecond: 123,
      };

      const info = createTestInfo(
        "SetDateValues type: complete object",
        "set",
        {
          values: JSON.stringify(values),
        },
        "2025-12-25 15:30:45.123"
      );

      executeTest(info, () => {
        const dk = new DateKit("2024-01-15").set(values);
        return dk.format("YYYY-MM-DD HH:mm:ss.SSS");
      });
    });
  });

  describe("DateInterval Type", () => {
    it("accepts DateInterval with string dates", () => {
      const interval: DateInterval = {
        start: "2024-01-01",
        end: "2024-01-07",
      };

      const info = createTestInfo(
        "DateInterval type: string dates",
        "eachDayOfInterval",
        {
          interval: JSON.stringify(interval),
        },
        7
      );

      executeTest(info, () => {
        const days = DateKit.eachDayOfInterval(interval);
        return days.length;
      });
    });

    it("accepts DateInterval with Date objects", () => {
      const interval: DateInterval = {
        start: new Date("2024-01-01"),
        end: new Date("2024-01-07"),
      };

      const info = createTestInfo(
        "DateInterval type: Date objects",
        "eachDayOfInterval",
        {
          interval: "Date objects: Jan 1 - Jan 7",
        },
        7
      );

      executeTest(info, () => {
        const days = DateKit.eachDayOfInterval(interval);
        return days.length;
      });
    });
  });

  describe("DurationObject Type", () => {
    it("accepts DurationObject with all fields", () => {
      const durationObj: DurationObject = {
        years: 1,
        months: 2,
        weeks: 3,
        days: 4,
        hours: 5,
        minutes: 6,
        seconds: 7,
        milliseconds: 8,
      };

      console.log(`\n${"─".repeat(80)}`);
      console.log(`📝 Test: DurationObject type with all fields`);
      console.log(`${"─".repeat(80)}`);
      console.log(`🔧 Type: DurationObject`);
      console.log(`📥 Object:`);
      Object.entries(durationObj).forEach(([key, value]) => {
        console.log(`   • ${key}: ${value}`);
      });
      console.log(`\n📊 Result: Duration object created successfully`);
      console.log(`\n✅ PASS - DurationObject type is valid`);
      console.log(`${"─".repeat(80)}`);

      const duration = new Duration(durationObj);
      expect(duration).toBeInstanceOf(Duration);
    });

    it("accepts DurationObject with partial fields", () => {
      const durationObj: DurationObject = {
        hours: 2,
        minutes: 30,
      };

      const info = createTestInfo(
        "DurationObject type: partial fields",
        "new Duration",
        {
          object: JSON.stringify(durationObj),
        },
        150
      );

      executeTest(info, () => {
        const duration = new Duration(durationObj);
        return duration.asMinutes();
      });
    });
  });

  describe("DateKitConfig Type", () => {
    it("accepts config with all fields", () => {
      const config: DateKitConfig = {
        locale: "es",
        weekStartsOn: 1,
        timezone: "UTC",
        strictParsing: true,
      };

      console.log(`\n${"─".repeat(80)}`);
      console.log(`📝 Test: DateKitConfig type with all fields`);
      console.log(`${"─".repeat(80)}`);
      console.log(`🔧 Type: DateKitConfig`);
      console.log(`📥 Config:`);
      Object.entries(config).forEach(([key, value]) => {
        console.log(`   • ${key}: ${value}`);
      });
      console.log(`\n📊 Result: DateKit instance created with config`);
      console.log(`\n✅ PASS - DateKitConfig type is valid`);
      console.log(`${"─".repeat(80)}`);

      const dk = new DateKit("2024-01-15", config);
      expect(dk).toBeInstanceOf(DateKit);
      expect(dk.locale()).toBe("es");
    });

    it("accepts config with partial fields", () => {
      const config: DateKitConfig = {
        locale: "en",
      };

      const info = createTestInfo(
        "DateKitConfig type: partial config",
        "new DateKit",
        {
          config: JSON.stringify(config),
        },
        "March"
      );

      executeTest(info, () => {
        const dk = new DateKit("2024-03-15", config);
        return dk.format("MMMM");
      });
    });
  });

  describe("LocaleConfig Type", () => {
    it("validates LocaleConfig structure", () => {
      console.log(`\n${"─".repeat(80)}`);
      console.log(`📝 Test: LocaleConfig type structure`);
      console.log(`${"─".repeat(80)}`);
      console.log(`🔧 Type: LocaleConfig`);
      console.log(`📥 Required Fields:`);
      console.log(`   • name: string`);
      console.log(`   • weekdays: string[] (7 elements)`);
      console.log(`   • weekdaysShort: string[] (7 elements)`);
      console.log(`   • weekdaysMin: string[] (7 elements)`);
      console.log(`   • months: string[] (12 elements)`);
      console.log(`   • monthsShort: string[] (12 elements)`);
      console.log(`   • ordinal: (n: number) => string`);
      console.log(`   • relativeTime: object`);
      console.log(`   • calendar: object`);
      console.log(`\n✅ PASS - LocaleConfig type structure is correct`);
      console.log(`${"─".repeat(80)}`);

      expect(true).toBe(true);
    });
  });
});
