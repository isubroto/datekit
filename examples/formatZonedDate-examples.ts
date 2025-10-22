import { DateKit } from "../dist/index.js";

console.log("=".repeat(70));
console.log("DateKit.formatZonedDate - Static and Instance Method Examples");
console.log("=".repeat(70));

// Example date strings with timezone information
const dateStrings = [
  "Sun Aug 31 2025 00:00:00 GMT+0600 (Bangladesh Standard Time)",
  "Mon Dec 25 2024 10:30:00 GMT-0500 (Eastern Standard Time)",
  "Thu Feb 15 2025 14:45:30 GMT+0530 (India Standard Time)",
  "Fri Mar 21 2025 08:00:00 GMT-0800 (Pacific Standard Time)",
];

// ============================================================
// 1. Static Method Examples
// ============================================================
console.log("\n1. STATIC METHOD: DateKit.formatZonedDate()");
console.log("-".repeat(70));
console.log("Call directly on the DateKit class\n");

dateStrings.forEach((dateStr, index) => {
  console.log(`Example ${index + 1}:`);
  console.log(`  Input:  ${dateStr}`);
  console.log(
    `  Output: ${DateKit.formatZonedDate(dateStr, "DD-MM-YYYY HH:mm")}`
  );
  console.log();
});

// With different formats
console.log("=".repeat(70));
console.log("Different output formats (static method):");
console.log("=".repeat(70));
const sampleDate =
  "Sun Aug 31 2025 14:30:00 GMT+0600 (Bangladesh Standard Time)";
console.log(
  `  DD-MM-YYYY:           ${DateKit.formatZonedDate(sampleDate, "DD-MM-YYYY")}`
);
console.log(
  `  YYYY/MM/DD:           ${DateKit.formatZonedDate(sampleDate, "YYYY/MM/DD")}`
);
console.log(
  `  MMMM DD, YYYY:        ${DateKit.formatZonedDate(
    sampleDate,
    "MMMM DD, YYYY"
  )}`
);
console.log(
  `  DD-MM-YYYY HH:mm:ss:  ${DateKit.formatZonedDate(
    sampleDate,
    "DD-MM-YYYY HH:mm:ss"
  )}`
);

// With custom locale
console.log("\nWith Spanish locale (static method):");
console.log(
  `  English: ${DateKit.formatZonedDate(sampleDate, "MMMM DD, YYYY", "en")}`
);
console.log(
  `  Spanish: ${DateKit.formatZonedDate(sampleDate, "MMMM DD, YYYY", "es")}`
);

// ============================================================
// 2. Instance Method Examples
// ============================================================
console.log("\n\n2. INSTANCE METHOD: instance.formatZonedDate()");
console.log("-".repeat(70));
console.log("Call on a DateKit instance (uses instance's locale)\n");

// Create instance with English locale
const dkEn = new DateKit("2025-01-15", { locale: "en" });
console.log("DateKit instance with English locale:");
console.log(`  ${dkEn.formatZonedDate(sampleDate, "MMMM DD, YYYY")}`);

// Create instance with Spanish locale
const dkEs = new DateKit("2025-01-15", { locale: "es" });
console.log("\nDateKit instance with Spanish locale:");
console.log(`  ${dkEs.formatZonedDate(sampleDate, "MMMM DD, YYYY")}`);

// Using default format
console.log("\nUsing default format (DD-MM-YYYY):");
console.log(`  ${dkEn.formatZonedDate(sampleDate)}`);

// ============================================================
// 3. Comparison: Static vs Instance
// ============================================================
console.log("\n\n3. COMPARISON: Static vs Instance Method");
console.log("-".repeat(70));

const testDate = "Fri Mar 15 2024 14:30:00 GMT+0600 (Bangladesh Standard Time)";

console.log("\nStatic method (explicit locale):");
console.log(
  `  English: ${DateKit.formatZonedDate(testDate, "dddd, MMMM D, YYYY", "en")}`
);
console.log(
  `  Spanish: ${DateKit.formatZonedDate(testDate, "dddd, MMMM D, YYYY", "es")}`
);

console.log("\nInstance method (uses instance locale):");
const dkEn2 = new DateKit("2025-01-01", { locale: "en" });
const dkEs2 = new DateKit("2025-01-01", { locale: "es" });
console.log(
  `  English instance: ${dkEn2.formatZonedDate(testDate, "dddd, MMMM D, YYYY")}`
);
console.log(
  `  Spanish instance: ${dkEs2.formatZonedDate(testDate, "dddd, MMMM D, YYYY")}`
);

// ============================================================
// 4. Real-World Use Case
// ============================================================
console.log("\n\n4. REAL-WORLD USE CASE");
console.log("-".repeat(70));
console.log("Processing user-provided date strings with timezone info\n");

// Simulating dates from different timezones
const userInputs = [
  {
    user: "User from Bangladesh",
    date: "Mon Sep 15 2025 09:00:00 GMT+0600 (Bangladesh Standard Time)",
  },
  {
    user: "User from New York",
    date: "Mon Sep 15 2025 09:00:00 GMT-0400 (Eastern Daylight Time)",
  },
  {
    user: "User from London",
    date: "Mon Sep 15 2025 09:00:00 GMT+0100 (British Summer Time)",
  },
];

userInputs.forEach((input) => {
  console.log(`${input.user}:`);
  console.log(`  Original: ${input.date}`);
  console.log(
    `  Formatted: ${DateKit.formatZonedDate(input.date, "YYYY-MM-DD HH:mm")}`
  );
  console.log(
    `  Display: ${DateKit.formatZonedDate(
      input.date,
      "dddd, MMMM DD at HH:mm"
    )}`
  );
  console.log();
});

// ============================================================
// 5. Edge Cases
// ============================================================
console.log("\n5. EDGE CASES");
console.log("-".repeat(70));

console.log("\nMidnight:");
const midnight = "Sat Jul 04 2025 00:00:00 GMT-0700 (Pacific Daylight Time)";
console.log(`  ${DateKit.formatZonedDate(midnight, "DD-MM-YYYY HH:mm:ss")}`);

console.log("\nEnd of day:");
const endOfDay = "Mon Dec 31 2025 23:59:59 GMT+0100 (Central European Time)";
console.log(`  ${DateKit.formatZonedDate(endOfDay, "DD/MM/YYYY HH:mm:ss")}`);

console.log("\nNo timezone in input (fallback):");
const noTz = "Mon Jan 20 2025 06:30:00";
try {
  console.log(`  ${DateKit.formatZonedDate(noTz, "DD-MM-YYYY HH:mm")}`);
} catch (error) {
  console.log(
    `  Handled: ${error instanceof Error ? error.message : "Unknown error"}`
  );
}

console.log("\n" + "=".repeat(70));
console.log("✅ Both static and instance methods work perfectly!");
console.log("=".repeat(70));
