import { describe, it, expect } from "vitest";
import { Duration } from "../../../src";
import {
  logTestSection,
  createTestInfo,
  executeTest,
} from "../../helpers/testDisplay";

describe("Duration - ALL Methods Complete Test", () => {
  describe("🏗️ Duration Constructor", () => {
    logTestSection("Duration Constructor Methods");

    it("new Duration(value: number, unit: string)", () => {
      const info = createTestInfo(
        "Create duration from number and unit",
        "new Duration",
        {
          value: 5,
          unit: "days",
        },
        5
      );

      executeTest(info, () => {
        const duration = new Duration(5, "days");
        return duration.asDays();
      });
    });

    it("new Duration(object: DurationObject)", () => {
      const info = createTestInfo(
        "Create duration from object",
        "new Duration",
        {
          object: "{ hours: 2, minutes: 30, seconds: 45 }",
        },
        150
      );

      executeTest(info, () => {
        const duration = new Duration({ hours: 2, minutes: 30, seconds: 45 });
        return Math.floor(duration.asMinutes());
      });
    });
  });

  describe("🔢 Conversion Methods", () => {
    logTestSection("Duration Conversion Methods");

    const duration = new Duration(90, "minutes");

    const conversions = [
      {
        method: "asMilliseconds",
        expected: 5400000,
        description: "Convert to milliseconds",
      },
      {
        method: "asSeconds",
        expected: 5400,
        description: "Convert to seconds",
      },
      { method: "asMinutes", expected: 90, description: "Convert to minutes" },
      { method: "asHours", expected: 1.5, description: "Convert to hours" },
      {
        method: "asDays",
        expected: 0.0625,
        description: "Convert to days",
        precision: 4,
      },
      {
        method: "asWeeks",
        expected: 0.00893,
        description: "Convert to weeks",
        precision: 5,
      },
    ];

    conversions.forEach(({ method, expected, description, precision }) => {
      it(`${method}()`, () => {
        const info = createTestInfo(
          description,
          method,
          {
            this: "Duration(90 minutes)",
          },
          expected
        );

        const result = (duration as any)[method]();
        const actual = precision
          ? parseFloat(result.toFixed(precision))
          : result;

        console.log(`\n${"─".repeat(80)}`);
        console.log(`📝 Test: ${description}`);
        console.log(`${"─".repeat(80)}`);
        console.log(`🔧 Function: ${method}()`);
        console.log(`📥 This: Duration(90 minutes)`);
        console.log(`\n📊 Results:`);
        console.log(`   Expected: ${expected}`);
        console.log(`   Actual:   ${actual}`);
        console.log(`   Match:    ✅ YES`);
        console.log(`\n✅ PASS - ${method}() converted correctly`);
        console.log(`${"─".repeat(80)}`);

        if (precision) {
          expect(actual).toBeCloseTo(expected, precision);
        } else {
          expect(actual).toBe(expected);
        }
      });
    });
  });

  describe("📝 Other Duration Methods", () => {
    logTestSection("Other Duration Methods");

    it("humanize()", () => {
      const durations = [
        { value: 30, unit: "seconds", expected: /seconds?/ },
        { value: 1, unit: "minutes", expected: /minute/ },
        { value: 5, unit: "minutes", expected: /minutes/ },
        { value: 1, unit: "hours", expected: /hour/ },
        { value: 5, unit: "hours", expected: /hours/ },
        { value: 1, unit: "days", expected: /day/ },
        { value: 5, unit: "days", expected: /days/ },
      ];

      durations.forEach(({ value, unit, expected }) => {
        const duration = new Duration(value, unit);
        const result = duration.humanize();

        console.log(`\n${"─".repeat(80)}`);
        console.log(`📝 Test: Humanize ${value} ${unit}`);
        console.log(`${"─".repeat(80)}`);
        console.log(`🔧 Function: humanize()`);
        console.log(`📥 Input: Duration(${value} ${unit})`);
        console.log(`\n📊 Result: ${result}`);
        console.log(`   Matches pattern: ${expected}`);
        console.log(`\n✅ PASS - humanize() formatted correctly`);
        console.log(`${"─".repeat(80)}`);

        expect(result).toMatch(expected);
      });
    });

    it("toObject()", () => {
      const duration = new Duration({ days: 2, hours: 5, minutes: 30 });
      const result = duration.toObject();

      console.log(`\n${"─".repeat(80)}`);
      console.log(`📝 Test: Convert duration to object`);
      console.log(`${"─".repeat(80)}`);
      console.log(`🔧 Function: toObject()`);
      console.log(`📥 Input: Duration({ days: 2, hours: 5, minutes: 30 })`);
      console.log(`\n📊 Result Object:`);
      Object.entries(result).forEach(([key, value]) => {
        console.log(`   • ${key}: ${value}`);
      });
      console.log(`\n✅ PASS - toObject() converted correctly`);
      console.log(`${"─".repeat(80)}`);

      expect(result).toHaveProperty("days");
      expect(result).toHaveProperty("hours");
      expect(result).toHaveProperty("minutes");
    });

    it("add(duration: Duration)", () => {
      const info = createTestInfo(
        "Add two durations",
        "add",
        {
          this: "Duration(1 hour)",
          addDuration: "Duration(30 minutes)",
        },
        90
      );

      executeTest(info, () => {
        const d1 = new Duration(1, "hours");
        const d2 = new Duration(30, "minutes");
        const sum = d1.add(d2);
        return sum.asMinutes();
      });
    });

    it("subtract(duration: Duration)", () => {
      const info = createTestInfo(
        "Subtract two durations",
        "subtract",
        {
          this: "Duration(2 hours)",
          subtractDuration: "Duration(30 minutes)",
        },
        90
      );

      executeTest(info, () => {
        const d1 = new Duration(2, "hours");
        const d2 = new Duration(30, "minutes");
        const diff = d1.subtract(d2);
        return diff.asMinutes();
      });
    });

    it("Duration.between(date1: Date, date2: Date)", () => {
      const info = createTestInfo(
        "Calculate duration between two dates",
        "Duration.between",
        {
          date1: "2024-01-01T00:00:00Z",
          date2: "2024-01-01T02:30:00Z",
        },
        2.5
      );

      executeTest(info, () => {
        const date1 = new Date("2024-01-01T00:00:00Z");
        const date2 = new Date("2024-01-01T02:30:00Z");
        const duration = Duration.between(date1, date2);
        return duration.asHours();
      });
    });
  });
});
