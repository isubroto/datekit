<div align="center">

# 📅 DateKit

### A Modern TypeScript Toolkit for Dates, Times & Durations

[![npm version](https://img.shields.io/npm/v/@subrotosaha/datekit.svg)](https://www.npmjs.com/package/@subrotosaha/datekit)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/@subrotosaha/datekit)](https://bundlephobia.com/package/@subrotosaha/datekit)

**Lightweight • Immutable • Type-Safe • Zero Dependencies**

[Installation](#-installation) • [Quick Start](#-quick-start) • [API Reference](#-api-reference) • [Examples](#-real-world-examples)

</div>

---

## ✨ Why DateKit?

DateKit is a modern, lightweight date/time library that combines the best ideas from Moment.js, date-fns, and Day.js with a fresh, developer-friendly API.

| Feature | DateKit | Moment.js | date-fns | Day.js |
|---------|---------|-----------|----------|--------|
| **Immutable** | ✅ | ❌ | ✅ | ✅ |
| **TypeScript-first** | ✅ | Partial | ✅ | Partial |
| **Chainable API** | ✅ | ✅ | ❌ | ✅ |
| **UTC-first** | ✅ | ❌ | ❌ | Optional |
| **IANA Timezone Support** | ✅ Built-in | Plugin | Separate pkg | Plugin |
| **Business Days** | ✅ Built-in | ❌ | ❌ | ❌ |
| **Zero Dependencies** | ✅ | ❌ | ✅ | ✅ |

### 🎯 Key Features

- 🔒 **Immutable by Design** — All operations return new instances
- 🌍 **UTC-First Philosophy** — Consistent behavior across timezones
- 📦 **Zero Dependencies** — Lightweight and self-contained
- 🎨 **Chainable API** — Fluent, readable code
- 🌐 **IANA Timezone Support** — Full timezone conversion built-in
- 📊 **Business Day Calculations** — Skip weekends and holidays
- 🌍 **i18n Ready** — Extensible locale system
- 📝 **TypeScript Native** — Full type safety and IntelliSense

---

## 📦 Installation

```bash
# npm
npm install @subrotosaha/datekit

# yarn
yarn add @subrotosaha/datekit

# pnpm
pnpm add @subrotosaha/datekit
```

---

## 🚀 Quick Start

```typescript
import { DateKit, Duration } from "@subrotosaha/datekit";

// Create a date
const date = new DateKit("2024-03-15T14:30:00Z");

// Format it
console.log(date.format("MMMM D, YYYY")); // "March 15, 2024"

// Chain operations (all immutable!)
const futureDate = date
  .add(2, "week")
  .startOf("month")
  .setHour(9);

console.log(futureDate.format("dddd, MMMM D, YYYY [at] h:mm A"));
// "Monday, April 1, 2024 at 9:00 AM"

// Work with durations
const meeting = new Duration({ hours: 1, minutes: 30 });
console.log(meeting.humanize()); // "an hour"
```

---

## 📖 API Reference

### Table of Contents

<details>
<summary><strong>📌 DateKit Class</strong></summary>

- [Creating Instances](#creating-instances)
- [Formatting](#formatting)
- [Timezone Handling](#timezone-handling)
- [Getters](#getters)
- [Setters](#setters)
- [Manipulation](#manipulation)
- [Start/End of Time Units](#startend-of-time-units)
- [Comparison](#comparison)
- [Query Methods](#query-methods)
- [Differences](#differences)
- [Relative Time](#relative-time)
- [Calendar Time](#calendar-time)
- [Utilities](#utilities)
- [Business Days](#business-days)
- [Localization](#localization)
- [Intervals](#intervals)
- [Static Methods](#static-methods)

</details>

<details>
<summary><strong>⏱️ Duration Class</strong></summary>

- [Creating Durations](#creating-durations)
- [Conversions](#conversions)
- [Humanize](#humanize)
- [Arithmetic](#duration-arithmetic)

</details>

<details>
<summary><strong>📚 Reference Tables</strong></summary>

- [Format Tokens](#-format-tokens-reference)
- [TypeScript Types](#-typescript-types)
- [Constants](#constants)

</details>

---

## 📌 DateKit Class

### Creating Instances

Create DateKit instances in multiple ways:

```typescript
// Current date/time
const now = new DateKit();
const alsoNow = DateKit.now();

// From ISO string (recommended for UTC)
const fromISO = new DateKit("2024-03-15T14:30:00Z");

// From Date object
const fromDate = new DateKit(new Date());

// From Unix timestamp (milliseconds)
const fromMs = new DateKit(1710513000000);

// From Unix timestamp (seconds) - use static method
const fromUnix = DateKit.unix(1710513000);

// With configuration
const configured = new DateKit("2024-03-15", {
  locale: "es",           // Spanish locale
  weekStartsOn: 1,        // Monday = 1
  strictParsing: true     // Strict date parsing
});
```

---

### Formatting

Transform dates into human-readable strings:

```typescript
const date = new DateKit("2024-03-15T14:30:45.123Z");

// Common formats
date.format("YYYY-MM-DD");           // "2024-03-15"
date.format("DD/MM/YYYY");           // "15/03/2024"
date.format("MMMM D, YYYY");         // "March 15, 2024"
date.format("dddd, MMMM Do YYYY");   // "Friday, March 15th 2024"

// With time
date.format("YYYY-MM-DD HH:mm:ss");  // "2024-03-15 14:30:45"
date.format("h:mm A");               // "2:30 PM"
date.format("HH:mm:ss.SSS");         // "14:30:45.123"

// Complex formats
date.format("[Today is] dddd");      // "Today is Friday"
date.format("Qo [quarter of] YYYY"); // "1st quarter of 2024"

// With locale
const spanish = date.locale("es") as DateKit;
spanish.format("dddd, D [de] MMMM"); // "Viernes, 15 de Marzo"
```

> 💡 **Tip**: Use square brackets `[]` to escape literal text in format strings.

---

### Timezone Handling

DateKit provides comprehensive IANA timezone support with methods that **preserve timezone context**:

#### `formatInTimezone()` — Display in Any Timezone

```typescript
const utcDate = new Date("2024-12-25T00:00:00Z"); // Christmas midnight UTC

// Display in different timezones
DateKit.formatInTimezone(utcDate, "America/New_York", "YYYY-MM-DD HH:mm");
// → "2024-12-24 19:00" (EST: UTC-5, still Christmas Eve!)

DateKit.formatInTimezone(utcDate, "Asia/Tokyo", "YYYY-MM-DD HH:mm");
// → "2024-12-25 09:00" (JST: UTC+9)

DateKit.formatInTimezone(utcDate, "Asia/Dhaka", "YYYY-MM-DD HH:mm");
// → "2024-12-25 06:00" (BST: UTC+6)
```

#### `convertTimezone()` — Convert Between Timezones

```typescript
// Meeting at 2:30 PM in Dhaka - what time in New York?
DateKit.convertTimezone(
  "2024-12-25T14:30:00",
  "Asia/Dhaka",           // Source timezone
  "America/New_York",     // Target timezone  
  "YYYY-MM-DD HH:mm"
);
// → "2024-12-25 03:30" (10.5 hour difference)

// Same meeting, what time in London?
DateKit.convertTimezone(
  "2024-12-25T14:30:00",
  "Asia/Dhaka",
  "Europe/London",
  "h:mm A"
);
// → "8:30 AM"
```

#### `fromTimezone()` — Create from Local Time

```typescript
// Create a date representing 9:00 AM in Tokyo
const tokyoMorning = DateKit.fromTimezone(2024, 12, 25, 9, 0, 0, "Asia/Tokyo");

tokyoMorning.toISOString();
// → "2024-12-25T00:00:00.000Z" (stored as UTC internally)

// Display it in another timezone
DateKit.formatInTimezone(tokyoMorning.toDate(), "America/Los_Angeles", "h:mm A");
// → "4:00 PM" (previous day!)
```

#### `formatFromTimezoneString()` — Preserve Browser Timezone

Parse browser-generated date strings and format them **preserving the original timezone**:

```typescript
// Browser's Date.toString() output with timezone info
const browserDate = "Sun Dec 25 2024 00:00:00 GMT+0600 (Bangladesh Standard Time)";

// ✅ Preserves the local date (midnight in Bangladesh)
DateKit.formatFromTimezoneString(browserDate, "YYYY-MM-DD HH:mm");
// → "2024-12-25 00:00"

DateKit.formatFromTimezoneString(browserDate, "dddd, MMMM D");
// → "Sunday, December 25"
```

#### `formatZonedDate()` — Preserve Timezone with Locale Support

Enhanced version with locale support, available as both static and instance method:

```typescript
const dateString = "Mon Dec 25 2024 10:30:00 GMT-0500 (Eastern Standard Time)";

// Static method with explicit locale
DateKit.formatZonedDate(dateString, "MMMM DD, YYYY", "es");
// → "Diciembre 25, 2024"

// Instance method uses the instance's locale
const frenchKit = new DateKit({ locale: "fr" });
frenchKit.formatZonedDate(dateString, "dddd D MMMM YYYY");
// → "Lundi 25 Décembre 2024"
```

#### `getTimezoneOffset()` — Get Offset in Minutes

```typescript
// Current offset for a timezone
DateKit.getTimezoneOffset("Asia/Kolkata");      // 330 (UTC+5:30)
DateKit.getTimezoneOffset("America/New_York");  // -300 or -240 (depends on DST)
DateKit.getTimezoneOffset("UTC");               // 0

// Check offset at a specific date (for DST-aware calculations)
const summer = new Date("2024-07-15");
const winter = new Date("2024-01-15");

DateKit.getTimezoneOffset("America/New_York", summer); // -240 (EDT)
DateKit.getTimezoneOffset("America/New_York", winter); // -300 (EST)
```

---

### Getters

Access individual date/time components (all UTC-based):

| Method | Returns | Example |
|--------|---------|---------|
| `year()` | Full year | `2024` |
| `month()` | Month (0-indexed) | `2` (March) |
| `getDate()` | Day of month | `15` |
| `day()` | Day of week (0=Sun) | `5` (Friday) |
| `hour()` | Hour (0-23) | `14` |
| `minute()` | Minute (0-59) | `30` |
| `second()` | Second (0-59) | `45` |
| `millisecond()` | Millisecond (0-999) | `123` |
| `quarter()` | Quarter (1-4) | `1` |
| `week()` | ISO week number | `11` |
| `isoWeek()` | ISO week number | `11` |
| `weekday()` | Locale-aware weekday | `5` |
| `isoWeekday()` | ISO weekday (Mon=1) | `5` |
| `dayOfYear()` | Day of year (1-366) | `75` |
| `weekYear()` | ISO week year | `2024` |

```typescript
const date = new DateKit("2024-03-15T14:30:45.123Z");

console.log(`
  Year: ${date.year()}           // 2024
  Month: ${date.month()}         // 2 (March, 0-indexed)
  Date: ${date.getDate()}        // 15
  Day: ${date.day()}             // 5 (Friday)
  Hour: ${date.hour()}           // 14
  Quarter: ${date.quarter()}     // 1
  Week: ${date.week()}           // 11
  Day of Year: ${date.dayOfYear()} // 75
`);
```

---

### Setters

All setters return a **new DateKit instance** (immutable):

```typescript
const date = new DateKit("2024-03-15T14:30:00Z");

// Individual setters
date.setYear(2025).toISOString();        // "2025-03-15T14:30:00.000Z"
date.setMonth(11).toISOString();         // "2024-12-15T14:30:00.000Z"
date.setDate(1).toISOString();           // "2024-03-01T14:30:00.000Z"
date.setHour(9).toISOString();           // "2024-03-15T09:30:00.000Z"
date.setMinute(0).toISOString();         // "2024-03-15T14:00:00.000Z"
date.setSecond(0).toISOString();         // "2024-03-15T14:30:00.000Z"
date.setMillisecond(500).toISOString();  // "2024-03-15T14:30:00.500Z"
date.setQuarter(3).toISOString();        // "2024-09-15T14:30:00.000Z"

// Set multiple values at once
date.set({ 
  year: 2025, 
  month: 0,      // January
  date: 1, 
  hour: 0,
  minute: 0,
  second: 0 
}).format("YYYY-MM-DD HH:mm:ss");
// → "2025-01-01 00:00:00"
```

---

### Manipulation

Add or subtract time with chainable operations:

```typescript
const date = new DateKit("2024-01-15T10:00:00Z");

// Adding time
date.add(5, "day").format("YYYY-MM-DD");    // "2024-01-20"
date.add(2, "week").format("YYYY-MM-DD");   // "2024-01-29"
date.add(3, "month").format("YYYY-MM-DD");  // "2024-04-15"
date.add(1, "year").format("YYYY-MM-DD");   // "2025-01-15"
date.add(90, "minute").format("HH:mm");     // "11:30"

// Subtracting time
date.subtract(1, "month").format("YYYY-MM-DD"); // "2023-12-15"
date.subtract(2, "hour").format("HH:mm");       // "08:00"

// Chaining (all operations are immutable!)
const result = date
  .add(1, "month")
  .subtract(3, "day")
  .add(2, "hour")
  .format("YYYY-MM-DD HH:mm");
// → "2024-02-12 12:00"
```

**Supported units:** `'millisecond'` | `'second'` | `'minute'` | `'hour'` | `'day'` | `'week'` | `'month'` | `'quarter'` | `'year'`

---

### Start/End of Time Units

Snap to the boundaries of time units:

```typescript
const date = new DateKit("2024-03-15T14:30:45.123Z");

// Start of...
date.startOf("year").format("YYYY-MM-DD HH:mm:ss");    // "2024-01-01 00:00:00"
date.startOf("quarter").format("YYYY-MM-DD");          // "2024-01-01"
date.startOf("month").format("YYYY-MM-DD");            // "2024-03-01"
date.startOf("week").format("YYYY-MM-DD");             // "2024-03-10" (Sunday)
date.startOf("day").format("YYYY-MM-DD HH:mm:ss");     // "2024-03-15 00:00:00"
date.startOf("hour").format("HH:mm:ss");               // "14:00:00"

// End of...
date.endOf("year").format("YYYY-MM-DD HH:mm:ss");      // "2024-12-31 23:59:59"
date.endOf("month").format("YYYY-MM-DD");              // "2024-03-31"
date.endOf("day").format("HH:mm:ss.SSS");              // "23:59:59.999"
date.endOf("hour").format("HH:mm:ss.SSS");             // "14:59:59.999"
```

---

### Comparison

Compare dates with precision:

```typescript
const jan15 = new DateKit("2024-01-15");
const jan20 = new DateKit("2024-01-20");
const feb15 = new DateKit("2024-02-15");

// Basic comparisons
jan15.isBefore(jan20);        // true
jan20.isAfter(jan15);         // true
jan15.isSame("2024-01-15");   // true

// Compare by unit
jan15.isSame(jan20, "month"); // true (both January)
jan15.isSame(feb15, "year");  // true (both 2024)

// Inclusive comparisons
jan15.isSameOrBefore(jan20);  // true
jan20.isSameOrAfter(jan15);   // true

// Range check with inclusivity options
const jan17 = new DateKit("2024-01-17");
jan17.isBetween("2024-01-15", "2024-01-20");                    // true (exclusive)
jan17.isBetween("2024-01-15", "2024-01-20", undefined, "[]");   // true (inclusive)
jan15.isBetween("2024-01-15", "2024-01-20", undefined, "[)");   // true (start-inclusive)
jan20.isBetween("2024-01-15", "2024-01-20", undefined, "(]");   // true (end-inclusive)
```

---

### Query Methods

Quick boolean checks for common date questions:

```typescript
const today = DateKit.now();
const saturday = new DateKit("2024-03-16"); // A Saturday
const leapYear = new DateKit("2024-02-29");

// Relative checks
today.isToday();              // true
today.add(1, "day").isTomorrow();    // true
today.subtract(1, "day").isYesterday(); // true

// Period checks
today.isThisWeek();           // true
today.isThisMonth();          // true
today.isThisQuarter();        // true
today.isThisYear();           // true

// Day type checks
saturday.isWeekend();         // true
saturday.isWeekday();         // false

// Year checks
leapYear.isLeapYear();        // true (2024 is a leap year)

// DST check (environment-dependent)
today.isDST();                // true/false based on current DST status
```

---

### Differences

Calculate the difference between dates:

```typescript
const start = new DateKit("2024-01-01T00:00:00Z");
const end = new DateKit("2024-03-15T14:30:00Z");

// Basic differences (returns integers by default)
end.diff(start, "day");         // 74
end.diff(start, "week");        // 10
end.diff(start, "month");       // 2
end.diff(start, "hour");        // 1782

// Precise differences (floating point)
end.diff(start, "day", true);   // 74.604...
end.diff(start, "month", true); // 2.467...

// Negative differences (when comparing backwards)
start.diff(end, "day");         // -74

// Common use case: age calculation
const birthdate = new DateKit("1990-05-15");
const today = new DateKit("2024-03-15");
today.diff(birthdate, "year");  // 33
```

---

### Relative Time

Human-friendly "time ago" / "time from now" strings:

```typescript
const now = DateKit.now();

// From now (past)
now.subtract(5, "second").fromNow();  // "a few seconds ago"
now.subtract(3, "minute").fromNow();  // "3 minutes ago"
now.subtract(2, "hour").fromNow();    // "2 hours ago"
now.subtract(1, "day").fromNow();     // "a day ago"
now.subtract(5, "day").fromNow();     // "5 days ago"
now.subtract(1, "month").fromNow();   // "a month ago"
now.subtract(2, "year").fromNow();    // "2 years ago"

// To now (future)
now.add(10, "minute").toNow();        // "in 10 minutes"
now.add(3, "day").toNow();            // "in 3 days"

// Between specific dates
const past = new DateKit("2024-01-01");
const future = new DateKit("2024-12-31");
past.from(future);                    // "in 12 months"
future.to(past);                      // "12 months ago"

// Without suffix
now.subtract(5, "minute").fromNow(true); // "5 minutes"
```

---

### Calendar Time

Context-aware date descriptions:

```typescript
const now = DateKit.now();

now.calendar();                           // "Today at 2:30 PM"
now.add(1, "day").calendar();             // "Tomorrow at 2:30 PM"
now.subtract(1, "day").calendar();        // "Yesterday at 2:30 PM"
now.add(3, "day").calendar();             // "Thursday at 2:30 PM"
now.subtract(7, "day").calendar();        // "03/08/2024"

// With custom reference date
const eventDate = new DateKit("2024-06-15T10:00:00Z");
const currentDate = new DateKit("2024-06-14");
eventDate.calendar(currentDate);          // "Tomorrow at 10:00 AM"
```

---

### Utilities

Helpful methods for common operations:

```typescript
const date = new DateKit("2024-02-15");

// Days in the current month
date.daysInMonth();                    // 29 (February 2024, leap year)
new DateKit("2023-02-15").daysInMonth(); // 28 (non-leap year)
new DateKit("2024-01-15").daysInMonth(); // 31

// Weeks in year (ISO)
date.weeksInYear();                    // 52 (or 53 for some years)

// Age calculation
const birthdate = new DateKit("1990-05-15");
birthdate.age();                       // Current age in years
birthdate.age("2024-05-14");           // 33 (day before birthday)
birthdate.age("2024-05-15");           // 34 (on birthday)

// Clone (independent copy)
const original = new DateKit("2024-03-15");
const copy = original.clone();
copy.add(1, "day"); // Doesn't affect original

// Duration to another date
const start = new DateKit("2024-01-01T08:00:00Z");
const end = new DateKit("2024-01-01T17:30:00Z");
start.duration(end).asHours();         // 9.5
start.duration(end).humanize();        // "9 hours"
```

---

### Business Days

Calculate with working days (Monday-Friday), with optional holiday support:

```typescript
const friday = new DateKit("2024-03-15"); // Friday
const monday = new DateKit("2024-03-18"); // Monday

// Check if business day
friday.isBusinessDay();               // true
friday.add(1, "day").isBusinessDay(); // false (Saturday)

// Add business days (skips weekends)
friday.addBusinessDays(1).format("YYYY-MM-DD dddd");
// → "2024-03-18 Monday" (skipped Saturday & Sunday)

friday.addBusinessDays(5).format("YYYY-MM-DD dddd");
// → "2024-03-22 Friday"

// Subtract business days
monday.subtractBusinessDays(1).format("YYYY-MM-DD dddd");
// → "2024-03-15 Friday"

// Count business days between dates
friday.businessDaysUntil("2024-03-22"); // 5
monday.businessDaysUntil("2024-03-15"); // -1 (negative when going back)

// With holidays
const holidays = [
  new Date("2024-03-18"), // Custom holiday on Monday
];

friday.addBusinessDays(1, holidays).format("YYYY-MM-DD dddd");
// → "2024-03-19 Tuesday" (skipped the holiday)

friday.isBusinessDay(holidays);         // true
monday.isBusinessDay(holidays);         // false (it's a holiday)
```

---

### Localization

Switch between locales for formatted output:

```typescript
const date = new DateKit("2024-03-15T14:30:00Z");

// English (default)
date.format("dddd, MMMM D, YYYY"); // "Friday, March 15, 2024"

// Switch to Spanish
const spanish = date.locale("es") as DateKit;
spanish.format("dddd, D [de] MMMM [de] YYYY"); // "Viernes, 15 de Marzo de 2024"

// Get current locale
date.locale();    // "en"
spanish.locale(); // "es"

// Create with locale
const esDate = new DateKit("2024-03-15", { locale: "es" });
esDate.format("MMMM"); // "Marzo"
```

**Built-in locales:** `en` (English), `es` (Spanish)

> 💡 **Tip**: Use `registerLocale()` to add custom locales.

---

### Intervals

Generate arrays of dates for iteration:

```typescript
// Each day in a range
const days = DateKit.eachDayOfInterval({
  start: "2024-03-01",
  end: "2024-03-07"
});
days.map(d => d.format("YYYY-MM-DD"));
// → ["2024-03-01", "2024-03-02", ..., "2024-03-07"]

// Each week start
const weeks = DateKit.eachWeekOfInterval({
  start: "2024-03-01",
  end: "2024-03-31"
});
weeks.map(d => d.format("YYYY-MM-DD")); 
// → ["2024-02-25", "2024-03-03", "2024-03-10", ...]

// Each month start
const months = DateKit.eachMonthOfInterval({
  start: "2024-01-01",
  end: "2024-06-30"
});
months.map(d => d.format("MMMM YYYY"));
// → ["January 2024", "February 2024", ..., "June 2024"]
```

---

### Static Methods

Utility methods without instance creation:

```typescript
// Current moment
DateKit.now();                              // DateKit for current time

// Create from specific inputs
DateKit.utc("2024-03-15");                  // Parse as UTC
DateKit.unix(1710513000);                   // From Unix seconds

// Validation
DateKit.isValid("2024-03-15");              // true
DateKit.isValid("invalid-date");            // false
DateKit.isValid(new Date("invalid"));       // false

// Find extremes
DateKit.max("2024-01-01", "2024-06-15", "2024-03-20").format("YYYY-MM-DD");
// → "2024-06-15"

DateKit.min("2024-01-01", "2024-06-15", "2024-03-20").format("YYYY-MM-DD");
// → "2024-01-01"

// Duration factory
DateKit.duration(2, "hours").asMinutes();   // 120
DateKit.duration({ days: 1, hours: 12 }).asHours(); // 36

// Type guard
DateKit.isDuration(new Duration(5, "days")); // true
DateKit.isDuration({});                      // false
```

---

## ⏱️ Duration Class

Represent and manipulate time spans.

### Creating Durations

```typescript
import { Duration } from "@subrotosaha/datekit";

// From value and unit
const hours2 = new Duration(2, "hours");
const days5 = new Duration(5, "days");
const mins90 = new Duration(90, "minutes");

// From object (multiple units)
const complex = new Duration({
  days: 2,
  hours: 5,
  minutes: 30,
  seconds: 15
});

// From DateKit factory
const dur = DateKit.duration(3, "weeks");
const dur2 = DateKit.duration({ hours: 1, minutes: 30 });

// Between two dates
const meeting = Duration.between(
  new Date("2024-03-15T10:00:00Z"),
  new Date("2024-03-15T11:30:00Z")
);
meeting.asMinutes(); // 90
```

---

### Conversions

Convert durations to different units:

```typescript
const duration = new Duration(90, "minutes");

duration.asMilliseconds(); // 5400000
duration.asSeconds();      // 5400
duration.asMinutes();      // 90
duration.asHours();        // 1.5
duration.asDays();         // 0.0625
duration.asWeeks();        // 0.00893...

// Approximate conversions
duration.asMonths();       // ~0.00205 (using 30.44 days/month)
duration.asYears();        // ~0.00017 (using 365.25 days/year)

// Get structured object
const complex = new Duration({ days: 2, hours: 5, minutes: 30 });
complex.toObject();
// → { years: 0, months: 0, days: 2, hours: 5, minutes: 30, seconds: 0, milliseconds: 0 }
```

---

### Humanize

Human-readable duration strings:

```typescript
new Duration(30, "seconds").humanize();     // "a few seconds"
new Duration(1, "minutes").humanize();      // "a minute"
new Duration(45, "minutes").humanize();     // "an hour"
new Duration(5, "hours").humanize();        // "5 hours"
new Duration(24, "hours").humanize();       // "a day"
new Duration(35, "days").humanize();        // "a month"
new Duration(400, "days").humanize();       // "a year"
new Duration(3, "years").humanize();        // "3 years"
```

---

### Duration Arithmetic

Combine durations:

```typescript
const hour = new Duration(1, "hours");
const halfHour = new Duration(30, "minutes");

// Addition
hour.add(halfHour).asMinutes();    // 90

// Subtraction
hour.subtract(halfHour).asMinutes(); // 30

// Chaining
new Duration(2, "hours")
  .add(new Duration(45, "minutes"))
  .subtract(new Duration(15, "minutes"))
  .asMinutes(); // 150
```

---

## 🔧 Conversion Methods

Transform DateKit instances:

| Method | Returns | Description |
|--------|---------|-------------|
| `toDate()` | `Date` | Native Date object (copy) |
| `toISOString()` | `string` | ISO 8601 format |
| `toUnix()` | `number` | Unix timestamp (seconds) |
| `valueOf()` | `number` | Unix timestamp (milliseconds) |
| `toArray()` | `number[]` | `[year, month, date, hour, min, sec, ms]` |
| `toObject()` | `object` | Structured date components |
| `toJSON()` | `string` | ISO string (for serialization) |
| `toString()` | `string` | Native Date string |

```typescript
const date = new DateKit("2024-03-15T14:30:45.123Z");

date.toDate();       // Date object
date.toISOString();  // "2024-03-15T14:30:45.123Z"
date.toUnix();       // 1710513045
date.valueOf();      // 1710513045123
date.toArray();      // [2024, 2, 15, 14, 30, 45, 123]
date.toObject();     // { year: 2024, month: 2, date: 15, ... }
```

---

## 📋 Format Tokens Reference

| Category | Token | Output | Example |
|----------|-------|--------|---------|
| **Year** | `YYYY` | 4-digit year | `2024` |
| | `YY` | 2-digit year | `24` |
| **Quarter** | `Q` | Quarter number | `1` - `4` |
| | `Qo` | Quarter ordinal | `1st`, `2nd` |
| **Month** | `MMMM` | Full name | `March` |
| | `MMM` | Short name | `Mar` |
| | `MM` | 2-digit | `03` |
| | `M` | Number | `3` |
| | `Mo` | Ordinal | `3rd` |
| **Week** | `W` / `WW` | ISO week | `11` / `11` |
| | `Wo` | Week ordinal | `11th` |
| **Day of Year** | `DDD` | Day number | `75` |
| | `DDDD` | Padded | `075` |
| | `DDDo` | Ordinal | `75th` |
| **Day of Month** | `DD` | 2-digit | `15` |
| | `D` | Number | `15` |
| | `Do` | Ordinal | `15th` |
| **Day of Week** | `dddd` | Full name | `Friday` |
| | `ddd` | Short name | `Fri` |
| | `dd` | Min name | `Fr` |
| | `d` | Number (Sun=0) | `5` |
| | `do` | Ordinal | `5th` |
| **Hour** | `HH` / `H` | 24-hour | `14` / `14` |
| | `hh` / `h` | 12-hour | `02` / `2` |
| **Minute** | `mm` / `m` | Minutes | `30` / `30` |
| **Second** | `ss` / `s` | Seconds | `45` / `45` |
| **Millisecond** | `SSS` | 3-digit | `123` |
| | `SS` | 2-digit | `12` |
| | `S` | 1-digit | `1` |
| **AM/PM** | `A` | Uppercase | `PM` |
| | `a` | Lowercase | `pm` |
| **Timezone** | `Z` | With colon | `+00:00` |
| | `ZZ` | Compact | `+0000` |
| **Unix** | `X` | Seconds | `1710513045` |
| | `x` | Milliseconds | `1710513045123` |

---

## 📝 TypeScript Types

All types are exported for use in your projects:

```typescript
import type {
  DateInput,
  TimeUnit,
  DateKitConfig,
  SetDateValues,
  DateInterval,
  DurationObject,
  LocaleConfig,
  QuarterNumber,
  DayOfWeek,
} from "@subrotosaha/datekit";
```

<details>
<summary><strong>View Type Definitions</strong></summary>

```typescript
// Accepted date input formats
type DateInput = Date | string | number;

// Time manipulation units
type TimeUnit =
  | "millisecond" | "second" | "minute" | "hour"
  | "day" | "week" | "month" | "quarter" | "year";

// Days of the week (0 = Sunday)
type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

// Quarter numbers
type QuarterNumber = 1 | 2 | 3 | 4;

// Configuration options
interface DateKitConfig {
  locale?: string;              // Locale code (e.g., "en", "es")
  weekStartsOn?: DayOfWeek;     // First day of week
  timezone?: string;            // IANA timezone
  strictParsing?: boolean;      // Strict date parsing
}

// For set() method
interface SetDateValues {
  year?: number;
  month?: number;       // 0-indexed
  date?: number;
  hour?: number;
  minute?: number;
  second?: number;
  millisecond?: number;
}

// For interval methods
interface DateInterval {
  start: DateInput;
  end: DateInput;
}

// Duration object structure
interface DurationObject {
  years?: number;
  months?: number;
  weeks?: number;
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
  milliseconds?: number;
}

// Locale configuration
interface LocaleConfig {
  name: string;
  weekdays: string[];
  weekdaysShort: string[];
  weekdaysMin: string[];
  months: string[];
  monthsShort: string[];
  ordinal: (n: number) => string;
  relativeTime: { /* ... */ };
  calendar: { /* ... */ };
}
```

</details>

---

## 💡 Real-World Examples

### International Meeting Scheduler

```typescript
const meetingTime = "2024-06-15T14:00:00"; // 2 PM in source timezone

const timezones = [
  { city: "Dhaka", tz: "Asia/Dhaka" },
  { city: "New York", tz: "America/New_York" },
  { city: "London", tz: "Europe/London" },
  { city: "Tokyo", tz: "Asia/Tokyo" },
  { city: "Sydney", tz: "Australia/Sydney" },
];

console.log("Meeting scheduled for 2 PM Dhaka time:");
timezones.forEach(({ city, tz }) => {
  const time = DateKit.convertTimezone(
    meetingTime,
    "Asia/Dhaka",
    tz,
    "h:mm A"
  );
  console.log(`  ${city}: ${time}`);
});
```

### Date Range Picker

```typescript
function getWeekDates(date: DateKit) {
  const start = date.startOf("week");
  return DateKit.eachDayOfInterval({
    start: start.toISOString(),
    end: start.add(6, "day").toISOString()
  });
}

const thisWeek = getWeekDates(DateKit.now());
thisWeek.forEach(day => {
  console.log(day.format("ddd, MMM D"), 
    day.isToday() ? "(today)" : "",
    day.isWeekend() ? "🌴" : ""
  );
});
```

### Business Hours Calculator

```typescript
function getNextBusinessDay(date: DateKit): DateKit {
  let next = date.add(1, "day");
  while (!next.isBusinessDay()) {
    next = next.add(1, "day");
  }
  return next;
}

function calculateDeliveryDate(orderDate: DateKit, businessDays: number): DateKit {
  return orderDate.addBusinessDays(businessDays);
}

const order = DateKit.now();
const delivery = calculateDeliveryDate(order, 5);

console.log(`Ordered: ${order.format("dddd, MMMM D")}`);
console.log(`Estimated Delivery: ${delivery.format("dddd, MMMM D")}`);
console.log(`(${order.businessDaysUntil(delivery.toISOString())} business days)`);
```

### Age Calculator

```typescript
function formatAge(birthdate: DateKit): string {
  const years = birthdate.age();
  const months = DateKit.now().diff(birthdate.add(years, "year"), "month");
  const days = DateKit.now().diff(
    birthdate.add(years, "year").add(months, "month"), 
    "day"
  );
  
  return `${years} years, ${months} months, ${days} days`;
}

const birthday = new DateKit("1990-05-15");
console.log(`Age: ${formatAge(birthday)}`);
console.log(`Days until next birthday: ${
  birthday.setYear(DateKit.now().year() + 1).diff(DateKit.now(), "day")
}`);
```

---

## ⚠️ Important Notes

### UTC-First Philosophy

DateKit uses UTC internally to prevent timezone-related bugs:

```typescript
// ✅ ISO strings with Z suffix are unambiguous
new DateKit("2024-03-15T14:30:00Z");

// ⚠️ Without Z, parsing depends on environment
new DateKit("2024-03-15T14:30:00");

// ✅ Use timezone methods for local time handling
DateKit.fromTimezone(2024, 3, 15, 14, 30, 0, "Asia/Dhaka");
```

### Immutability

All "mutating" methods return new instances:

```typescript
const original = new DateKit("2024-03-15");
const modified = original.add(1, "day");

original.format("YYYY-MM-DD");  // "2024-03-15" (unchanged!)
modified.format("YYYY-MM-DD");  // "2024-03-16"
```

### Month Overflow

JavaScript Date rules apply when adding months:

```typescript
// January 31 + 1 month = March 2 (or March 3 in leap years)
new DateKit("2024-01-31").add(1, "month").format("YYYY-MM-DD");
// → "2024-03-02" (February doesn't have 31 days)
```

### DST Handling

Daylight Saving Time is handled automatically in timezone conversions:

```typescript
// EDT (summer) vs EST (winter)
DateKit.getTimezoneOffset("America/New_York", new Date("2024-07-15")); // -240 (EDT)
DateKit.getTimezoneOffset("America/New_York", new Date("2024-01-15")); // -300 (EST)
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

MIT License © 2024 [Subroto Saha](https://github.com/subrotosaha)

---

<div align="center">

**Made with ❤️ for developers who value clean date handling**

[⬆ Back to Top](#-datekit)

</div>
