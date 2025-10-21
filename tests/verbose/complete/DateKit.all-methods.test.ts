import { describe, it, expect } from "vitest";
import { DateKit, Duration } from "../../../src";
import {
  logTestSection,
  createTestInfo,
  executeTest,
} from "../../helpers/testDisplay";

describe("DateKit - ALL Methods Complete Test", () => {
  describe("📅 Constructor Methods", () => {
    logTestSection("Constructor Methods");

    it("new DateKit() - no arguments", () => {
      const info = createTestInfo(
        "Constructor with no arguments",
        "new DateKit",
        { arguments: "none" },
        "DateKit instance"
      );

      const result = (() => {
        const dk = new DateKit();
        return dk instanceof DateKit ? "DateKit instance" : "error";
      })();

      console.log(`\n${"─".repeat(80)}`);
      console.log(`📝 Test: ${info.description}`);
      console.log(`${"─".repeat(80)}`);
      console.log(`🔧 Function: new DateKit()`);
      console.log(`📥 Parameters: ${info.parameters.arguments}`);
      console.log(`\n📊 Results:`);
      console.log(`   Expected: ${info.expectedResult}`);
      console.log(`   Actual:   ${result}`);
      console.log(`   Type:     DateKit`);
      console.log(`\n✅ PASS - Constructor works with no arguments`);
      console.log(`${"─".repeat(80)}`);

      expect(result).toBe(info.expectedResult);
    });

    it("new DateKit(date: DateInput)", () => {
      const info = createTestInfo(
        "Constructor with date argument",
        "new DateKit",
        {
          date: "2024-01-15T14:30:45.123Z",
        },
        "2024-01-15T14:30:45.123Z"
      );

      executeTest(info, () => {
        const dk = new DateKit("2024-01-15T14:30:45.123Z");
        return dk.toISOString();
      });
    });

    it("new DateKit(date: DateInput, config: DateKitConfig)", () => {
      const info = createTestInfo(
        "Constructor with date and config",
        "new DateKit",
        {
          date: "2024-01-15",
          config: '{ locale: "es", weekStartsOn: 1 }',
        },
        "Enero"
      );

      executeTest(info, () => {
        const dk = new DateKit("2024-01-15", { locale: "es", weekStartsOn: 1 });
        return dk.format("MMMM");
      });
    });
  });

  describe("🔢 Getter Methods (Individual Units)", () => {
    logTestSection("Getter Methods - Individual Units");

    const testDate = new DateKit("2024-03-15T14:30:45.123Z");
    const allGetters = [
      { method: "year", expected: 2024, description: "Get year (4-digit)" },
      { method: "month", expected: 2, description: "Get month (0-indexed)" },
      {
        method: "getDate",
        expected: 15,
        description: "Get date (day of month)",
      },
      {
        method: "day",
        expected: 5,
        description: "Get day (day of week, 0=Sunday)",
      },
      { method: "hour", expected: 14, description: "Get hour (0-23)" },
      { method: "minute", expected: 30, description: "Get minute (0-59)" },
      { method: "second", expected: 45, description: "Get second (0-59)" },
      {
        method: "millisecond",
        expected: 123,
        description: "Get millisecond (0-999)",
      },
      { method: "quarter", expected: 1, description: "Get quarter (1-4)" },
      { method: "week", expected: 11, description: "Get week number" },
      { method: "isoWeek", expected: 11, description: "Get ISO week number" },
      {
        method: "weekday",
        expected: 5,
        description: "Get weekday (locale-aware)",
      },
      {
        method: "isoWeekday",
        expected: 5,
        description: "Get ISO weekday (1=Monday, 7=Sunday)",
      },
      {
        method: "dayOfYear",
        expected: 75,
        description: "Get day of year (1-366)",
      },
      { method: "weekYear", expected: 2024, description: "Get week year" },
    ];

    allGetters.forEach(({ method, expected, description }) => {
      it(`${method}() - ${description}`, () => {
        const info = createTestInfo(
          description,
          method,
          { this: "2024-03-15T14:30:45.123Z" },
          expected
        );

        executeTest(info, () => (testDate as any)[method]());
      });
    });
  });

  describe("📤 Converter Methods", () => {
    logTestSection("Converter Methods");

    const testDate = new DateKit("2024-01-15T14:30:45.123Z");

    const converters = [
      {
        method: "toDate",
        description: "Convert to JavaScript Date",
        test: () => testDate.toDate() instanceof Date,
        expected: true,
      },
      {
        method: "toISOString",
        description: "Convert to ISO string",
        test: () => testDate.toISOString(),
        expected: "2024-01-15T14:30:45.123Z",
      },
      {
        method: "toUnix",
        description: "Convert to Unix timestamp (seconds)",
        test: () => testDate.toUnix(),
        expected: 1705329045,
      },
      {
        method: "valueOf",
        description: "Convert to milliseconds timestamp",
        test: () => testDate.valueOf(),
        expected: 1705329045123,
      },
      {
        method: "toArray",
        description: "Convert to array [year, month, date, ...]",
        test: () => testDate.toArray().length,
        expected: 7,
      },
      {
        method: "toObject",
        description: "Convert to object with date parts",
        test: () => typeof testDate.toObject() === "object",
        expected: true,
      },
      {
        method: "toJSON",
        description: "Convert to JSON string",
        test: () => testDate.toJSON(),
        expected: "2024-01-15T14:30:45.123Z",
      },
      {
        method: "toString",
        description: "Convert to string",
        test: () => typeof testDate.toString() === "string",
        expected: true,
      },
    ];

    converters.forEach(({ method, description, test, expected }) => {
      it(`${method}() - ${description}`, () => {
        const info = createTestInfo(
          description,
          method,
          { this: "2024-01-15T14:30:45.123Z" },
          expected
        );

        executeTest(info, test);
      });
    });
  });

  describe("✏️ Setter Methods", () => {
    logTestSection("Setter Methods");

    const setters = [
      { method: "setYear", param: 2025, getter: "year", expected: 2025 },
      { method: "setMonth", param: 11, getter: "month", expected: 11 },
      { method: "setDate", param: 25, getter: "getDate", expected: 25 },
      { method: "setHour", param: 15, getter: "hour", expected: 15 },
      { method: "setMinute", param: 45, getter: "minute", expected: 45 },
      { method: "setSecond", param: 30, getter: "second", expected: 30 },
      {
        method: "setMillisecond",
        param: 500,
        getter: "millisecond",
        expected: 500,
      },
      { method: "setQuarter", param: 3, getter: "quarter", expected: 3 },
    ];

    setters.forEach(({ method, param, getter, expected }) => {
      it(`${method}(${param})`, () => {
        const info = createTestInfo(
          `Set ${getter} to ${param}`,
          method,
          {
            this: "2024-01-15T10:30:45.123Z",
            value: param,
          },
          expected
        );

        executeTest(info, () => {
          const dk = new DateKit("2024-01-15T10:30:45.123Z");
          return (dk as any)[method](param)[getter]();
        });
      });
    });

    it("set(values: SetDateValues)", () => {
      const info = createTestInfo(
        "Set multiple values at once",
        "set",
        {
          this: "2024-01-15T10:30:45.123Z",
          values: "{ year: 2025, month: 11, date: 25, hour: 15 }",
        },
        "2025-12-25 15:30"
      );

      executeTest(info, () => {
        const dk = new DateKit("2024-01-15T10:30:45.123Z");
        return dk
          .set({ year: 2025, month: 11, date: 25, hour: 15 })
          .format("YYYY-MM-DD HH:mm");
      });
    });
  });

  // Continue in next part...
});
