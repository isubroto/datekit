import { DateKit } from "../dist/index.js";

console.log("=".repeat(70));
console.log("DateKit IANA Timezone Support Examples");
console.log("=".repeat(70));

// ============================================================
// 1. Format in Timezone
// ============================================================
console.log("\n1. FORMAT IN TIMEZONE (formatInTimezone)");
console.log("-".repeat(70));
console.log("Takes a UTC date and displays it in a specific timezone\n");

const utcDate = new Date("2025-08-31T12:00:00Z");
console.log("UTC Date:", utcDate.toISOString());
console.log("\nFormatted in different timezones:");
console.log(
  "  Asia/Dhaka:       ",
  DateKit.formatInTimezone(utcDate, "Asia/Dhaka", "DD-MM-YYYY HH:mm")
);
console.log(
  "  America/New_York: ",
  DateKit.formatInTimezone(utcDate, "America/New_York", "DD-MM-YYYY HH:mm")
);
console.log(
  "  Europe/London:    ",
  DateKit.formatInTimezone(utcDate, "Europe/London", "DD-MM-YYYY HH:mm")
);
console.log(
  "  Asia/Tokyo:       ",
  DateKit.formatInTimezone(utcDate, "Asia/Tokyo", "DD-MM-YYYY HH:mm")
);
console.log(
  "  Australia/Sydney: ",
  DateKit.formatInTimezone(utcDate, "Australia/Sydney", "DD-MM-YYYY HH:mm")
);

// ============================================================
// 2. Convert Between Timezones
// ============================================================
console.log("\n\n2. CONVERT BETWEEN TIMEZONES (convertTimezone)");
console.log("-".repeat(70));
console.log(
  "Interprets a date string in one timezone and converts to another\n"
);

const localTime = "2025-08-31T14:30:00";
console.log("Local time:", localTime);
console.log("\nConverting from Asia/Dhaka to other timezones:");
console.log(
  "  To America/New_York:  ",
  DateKit.convertTimezone(
    localTime,
    "Asia/Dhaka",
    "America/New_York",
    "DD-MM-YYYY HH:mm"
  )
);
console.log(
  "  To Europe/London:     ",
  DateKit.convertTimezone(
    localTime,
    "Asia/Dhaka",
    "Europe/London",
    "DD-MM-YYYY HH:mm"
  )
);
console.log(
  "  To Asia/Tokyo:        ",
  DateKit.convertTimezone(
    localTime,
    "Asia/Dhaka",
    "Asia/Tokyo",
    "DD-MM-YYYY HH:mm"
  )
);
console.log(
  "  To UTC:               ",
  DateKit.convertTimezone(localTime, "Asia/Dhaka", "UTC", "DD-MM-YYYY HH:mm")
);

console.log("\nConverting from America/Los_Angeles to other timezones:");
const laTime = "2025-08-31T09:00:00";
console.log("Local time:", laTime);
console.log(
  "  To Asia/Tokyo:        ",
  DateKit.convertTimezone(
    laTime,
    "America/Los_Angeles",
    "Asia/Tokyo",
    "DD-MM-YYYY HH:mm"
  )
);
console.log(
  "  To Europe/Paris:      ",
  DateKit.convertTimezone(
    laTime,
    "America/Los_Angeles",
    "Europe/Paris",
    "DD-MM-YYYY HH:mm"
  )
);
console.log(
  "  To Asia/Dhaka:        ",
  DateKit.convertTimezone(
    laTime,
    "America/Los_Angeles",
    "Asia/Dhaka",
    "DD-MM-YYYY HH:mm"
  )
);

// ============================================================
// 3. Create Date from Timezone
// ============================================================
console.log("\n\n3. CREATE DATE FROM TIMEZONE (fromTimezone)");
console.log("-".repeat(70));
console.log(
  "Creates a DateKit instance from date components in a specific timezone\n"
);

console.log("Creating date: August 31, 2025, 14:30:00");
const dhakaDate = DateKit.fromTimezone(2025, 8, 31, 14, 30, 0, "Asia/Dhaka");
const nyDate = DateKit.fromTimezone(2025, 8, 31, 14, 30, 0, "America/New_York");
const tokyoDate = DateKit.fromTimezone(2025, 8, 31, 14, 30, 0, "Asia/Tokyo");

console.log("\nIn Asia/Dhaka timezone:");
console.log("  UTC equivalent:  ", dhakaDate.format("YYYY-MM-DD HH:mm:ss"));
console.log("  ISO String:      ", dhakaDate.toISOString());

console.log("\nIn America/New_York timezone:");
console.log("  UTC equivalent:  ", nyDate.format("YYYY-MM-DD HH:mm:ss"));
console.log("  ISO String:      ", nyDate.toISOString());

console.log("\nIn Asia/Tokyo timezone:");
console.log("  UTC equivalent:  ", tokyoDate.format("YYYY-MM-DD HH:mm:ss"));
console.log("  ISO String:      ", tokyoDate.toISOString());

// ============================================================
// 4. Get Timezone Offset
// ============================================================
console.log("\n\n4. GET TIMEZONE OFFSET (getTimezoneOffset)");
console.log("-".repeat(70));
console.log("Returns the offset in minutes for a timezone\n");

const timezones = [
  "UTC",
  "Asia/Dhaka",
  "America/New_York",
  "Europe/London",
  "Asia/Tokyo",
  "Asia/Kolkata",
  "Asia/Kathmandu",
  "Australia/Sydney",
];

console.log("Timezone offsets (in minutes):");
timezones.forEach((tz) => {
  const offset = DateKit.getTimezoneOffset(tz);
  const hours = Math.floor(Math.abs(offset) / 60);
  const minutes = Math.abs(offset) % 60;
  const sign = offset >= 0 ? "+" : "-";
  const formatted = `UTC${sign}${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
  console.log(
    `  ${tz.padEnd(20)} ${offset.toString().padStart(4)} min  (${formatted})`
  );
});

// ============================================================
// 5. Daylight Saving Time (DST) Handling
// ============================================================
console.log("\n\n5. DAYLIGHT SAVING TIME (DST) HANDLING");
console.log("-".repeat(70));
console.log("Automatic DST adjustment for timezones that observe it\n");

const summerDate = new Date("2025-08-15T12:00:00Z");
const winterDate = new Date("2025-01-15T12:00:00Z");

console.log("New York (observes DST):");
console.log(
  "  Summer (EDT): ",
  DateKit.getTimezoneOffset("America/New_York", summerDate),
  "minutes (UTC-4)"
);
console.log(
  "  Winter (EST): ",
  DateKit.getTimezoneOffset("America/New_York", winterDate),
  "minutes (UTC-5)"
);

console.log("\nLondon (observes DST):");
console.log(
  "  Summer (BST): ",
  DateKit.getTimezoneOffset("Europe/London", summerDate),
  "minutes (UTC+1)"
);
console.log(
  "  Winter (GMT): ",
  DateKit.getTimezoneOffset("Europe/London", winterDate),
  "minutes (UTC+0)"
);

console.log("\nSydney (observes DST, opposite hemisphere):");
console.log(
  "  Summer (AEDT):",
  DateKit.getTimezoneOffset("Australia/Sydney", winterDate),
  "minutes (UTC+11)"
);
console.log(
  "  Winter (AEST):",
  DateKit.getTimezoneOffset("Australia/Sydney", summerDate),
  "minutes (UTC+10)"
);

console.log("\nDhaka (does NOT observe DST):");
console.log(
  "  Summer:       ",
  DateKit.getTimezoneOffset("Asia/Dhaka", summerDate),
  "minutes (UTC+6)"
);
console.log(
  "  Winter:       ",
  DateKit.getTimezoneOffset("Asia/Dhaka", winterDate),
  "minutes (UTC+6)"
);

// ============================================================
// 6. Real-World Use Cases
// ============================================================
console.log("\n\n6. REAL-WORLD USE CASES");
console.log("-".repeat(70));

console.log("\nUse Case 1: International Meeting Scheduler");
const meetingTime = "2025-09-15T14:00:00";
console.log("Meeting scheduled at:", meetingTime, "(Asia/Dhaka)");
console.log(
  "  Team in New York:   ",
  DateKit.convertTimezone(
    meetingTime,
    "Asia/Dhaka",
    "America/New_York",
    "MMMM DD, YYYY - HH:mm"
  )
);
console.log(
  "  Team in London:     ",
  DateKit.convertTimezone(
    meetingTime,
    "Asia/Dhaka",
    "Europe/London",
    "MMMM DD, YYYY - HH:mm"
  )
);
console.log(
  "  Team in Tokyo:      ",
  DateKit.convertTimezone(
    meetingTime,
    "Asia/Dhaka",
    "Asia/Tokyo",
    "MMMM DD, YYYY - HH:mm"
  )
);
console.log(
  "  Team in Sydney:     ",
  DateKit.convertTimezone(
    meetingTime,
    "Asia/Dhaka",
    "Australia/Sydney",
    "MMMM DD, YYYY - HH:mm"
  )
);

console.log("\nUse Case 2: Event Display in User's Local Timezone");
const eventUtc = new Date("2025-12-25T00:00:00Z");
console.log("Event starts (UTC):", eventUtc.toISOString());
console.log("Display for users in:");
console.log(
  "  Asia/Dhaka:       ",
  DateKit.formatInTimezone(eventUtc, "Asia/Dhaka", "dddd, MMMM DD, YYYY HH:mm")
);
console.log(
  "  America/New_York: ",
  DateKit.formatInTimezone(
    eventUtc,
    "America/New_York",
    "dddd, MMMM DD, YYYY HH:mm"
  )
);
console.log(
  "  Europe/Paris:     ",
  DateKit.formatInTimezone(
    eventUtc,
    "Europe/Paris",
    "dddd, MMMM DD, YYYY HH:mm"
  )
);

console.log("\nUse Case 3: Storing User Input in UTC");
const userInput = "2025-10-15T09:30:00";
const userTimezone = "America/Chicago";
console.log("User enters time:", userInput, `(${userTimezone})`);
const utcVersion = DateKit.fromTimezone(2025, 10, 15, 9, 30, 0, userTimezone);
console.log("Stored in database (UTC):", utcVersion.toISOString());
console.log(
  "Display to user:",
  DateKit.formatInTimezone(
    utcVersion.toDate(),
    userTimezone,
    "YYYY-MM-DD HH:mm"
  )
);

console.log("\n" + "=".repeat(70));
