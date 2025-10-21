import { DateKit } from "../dist/index.js";

console.log("=".repeat(60));
console.log("DateKit Timezone-Aware Date Formatting Examples");
console.log("=".repeat(60));

// Example 1: Bangladesh Standard Time (GMT+0600)
const bangladeshDate = "Sun Aug 31 2025 00:00:00 GMT+0600 (Bangladesh Standard Time)";
console.log("\n1. Bangladesh Standard Time:");
console.log("Input:", bangladeshDate);
console.log("Output (DD-MM-YYYY):", DateKit.formatFromTimezoneString(bangladeshDate, "DD-MM-YYYY"));
console.log("Output (YYYY/MM/DD):", DateKit.formatFromTimezoneString(bangladeshDate, "YYYY/MM/DD"));

// Example 2: Eastern Standard Time (GMT-0500)
const easternDate = "Mon Dec 25 2024 10:30:00 GMT-0500 (Eastern Standard Time)";
console.log("\n2. Eastern Standard Time:");
console.log("Input:", easternDate);
console.log("Output (DD-MM-YYYY HH:mm):", DateKit.formatFromTimezoneString(easternDate, "DD-MM-YYYY HH:mm"));

// Example 3: India Standard Time (GMT+0530)
const indiaDate = "Thu Feb 15 2025 14:45:30 GMT+0530 (India Standard Time)";
console.log("\n3. India Standard Time:");
console.log("Input:", indiaDate);
console.log("Output (DD-MM-YYYY HH:mm:ss):", DateKit.formatFromTimezoneString(indiaDate, "DD-MM-YYYY HH:mm:ss"));

// Example 4: Pacific Standard Time (GMT-0800)
const pacificDate = "Fri Mar 21 2025 08:00:00 GMT-0800 (Pacific Standard Time)";
console.log("\n4. Pacific Standard Time:");
console.log("Input:", pacificDate);
console.log("Output (MMMM DD, YYYY):", DateKit.formatFromTimezoneString(pacificDate, "MMMM DD, YYYY"));

// Example 5: UTC (GMT+0000)
const utcDate = "Wed Jan 01 2025 12:00:00 GMT+0000 (Coordinated Universal Time)";
console.log("\n5. UTC:");
console.log("Input:", utcDate);
console.log("Output (DD/MM/YYYY HH:mm):", DateKit.formatFromTimezoneString(utcDate, "DD/MM/YYYY HH:mm"));

// Example 6: Central European Time (GMT+0100)
const europeanDate = "Mon Dec 31 2025 23:59:59 GMT+0100 (Central European Time)";
console.log("\n6. Central European Time:");
console.log("Input:", europeanDate);
console.log("Output (YYYY-MM-DD HH:mm:ss):", DateKit.formatFromTimezoneString(europeanDate, "YYYY-MM-DD HH:mm:ss"));

// Example 7: Demonstrating the issue without the function
console.log("\n" + "=".repeat(60));
console.log("Why this function is important:");
console.log("=".repeat(60));
const testDate = "Sun Aug 31 2025 00:00:00 GMT+0600 (Bangladesh Standard Time)";
console.log("\nInput date string:", testDate);

// Without our function, JavaScript would interpret this in local system timezone
const jsDate = new Date(testDate);
console.log("\nUsing JavaScript Date directly:");
console.log("- getDate():", jsDate.getDate());
console.log("- This could be wrong if your system timezone differs!");

// With our function
console.log("\nUsing DateKit.formatFromTimezoneString():");
console.log("- Output:", DateKit.formatFromTimezoneString(testDate, "DD-MM-YYYY"));
console.log("- This preserves the original timezone's date: 31-08-2025");

console.log("\n" + "=".repeat(60));
