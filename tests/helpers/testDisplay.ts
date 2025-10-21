import { expect } from "vitest";

export interface TestInfo {
  description: string;
  functionName: string;
  parameters: Record<string, any>;
  expectedResult: any;
  actualResult?: any;
  passed?: boolean;
}

export function logTestSection(title: string) {
  console.log(`\n${"=".repeat(80)}`);
  console.log(`🧪 ${title}`);
  console.log("=".repeat(80));
}

export function logTestCase(info: TestInfo) {
  const {
    description,
    functionName,
    parameters,
    expectedResult,
    actualResult,
    passed,
  } = info;

  console.log(`\n${"─".repeat(80)}`);
  console.log(`📝 Test: ${description}`);
  console.log(`${"─".repeat(80)}`);
  console.log(`🔧 Function Called: ${functionName}()`);
  console.log(`📥 Parameters:`);

  Object.entries(parameters).forEach(([key, value]) => {
    const displayValue = formatValue(value);
    console.log(`   • ${key}: ${displayValue}`);
  });

  console.log(`\n📊 Results:`);
  console.log(`   Expected: ${formatValue(expectedResult)}`);
  console.log(`   Actual:   ${formatValue(actualResult)}`);
  console.log(
    `   Match:    ${actualResult === expectedResult ? "✅ YES" : "❌ NO"}`
  );
  console.log(
    `\n${passed ? "✅ PASS" : "❌ FAIL"} - ${
      passed ? "Test Passed Successfully" : "Test Failed"
    }`
  );
  console.log(`${"─".repeat(80)}`);
}

export function formatValue(value: any): string {
  if (value === null) return "null";
  if (value === undefined) return "undefined";
  if (value instanceof Date) return `Date(${value.toISOString()})`;
  if (typeof value === "object") {
    if (Array.isArray(value)) {
      return `[${value.map((v) => formatValue(v)).join(", ")}]`;
    }
    return JSON.stringify(value, null, 2);
  }
  if (typeof value === "string") return `"${value}"`;
  if (typeof value === "boolean") return value ? "true" : "false";
  return String(value);
}

export function createTestInfo(
  description: string,
  functionName: string,
  parameters: Record<string, any>,
  expectedResult: any
): TestInfo {
  return {
    description,
    functionName,
    parameters,
    expectedResult,
  };
}

export function executeTest(info: TestInfo, testFn: () => any) {
  try {
    const actualResult = testFn();
    const passed =
      actualResult === info.expectedResult ||
      JSON.stringify(actualResult) === JSON.stringify(info.expectedResult);

    const updatedInfo = {
      ...info,
      actualResult,
      passed,
    };

    logTestCase(updatedInfo);
    expect(actualResult).toEqual(info.expectedResult);
  } catch (error: any) {
    const updatedInfo = {
      ...info,
      actualResult: `Error: ${error.message}`,
      passed: false,
    };

    logTestCase(updatedInfo);
    throw error;
  }
}
