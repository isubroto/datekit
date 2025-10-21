# DateKit – A TypeScript toolkit for dates, times, and durations

DateKit is a lightweight, chainable, UTC-first date/time library for TypeScript and JavaScript, inspired by Moment, date-fns, and Day.js.

- Immutable operations (methods return new instances)
- Strict typing
- Consistent UTC-based behavior to avoid local timezone surprises
- Clean, chainable API
- Rich formatting, manipulation, comparison, durations, business-day
- utilities, calendar/relative time, locales, and helpful static utilities

Note on timezone philosophy:

- DateKit uses UTC for formatting and calculations (e.g., getUTCHours).
- Prefer ISO strings with “Z” for consistent parsing: 2024-03-15T14:30:00Z

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Design Notes](#design-notes)
- [API Overview](#api-overview)
- [DateKit Usage](#datekit-usage)
  - [Constructors](#constructors)
  - [Formatting](#formatting)
  - [Timezone Support](#timezone-support)
  - [Getters / Converters](#getters--converters)
  - [Individual Unit Getters](#individual-unit-getters)
  - [Setters](#setters)
  - [Manipulation](#manipulation)
  - [Start/End of Units](#startend-of-units)
  - [Comparison](#comparison)
  - [Query helpers](#query-helpers)
  - [Differences](#differences)
  - [Relative Time](#relative-time)
  - [Calendar Time](#calendar-time)
  - [Utilities](#utilities)
  - [Business Days](#business-days)
  - [Locale](#locale)
  - [Ranges/Intervals](#rangesintervals)
  - [Static Methods](#static-methods)
- [Duration Usage](#duration-usage)
  - [Constructors](#constructors)
  - [Conversions](#conversions)
  - [Humanize](#humanize)
  - [To Object](#to-object)
  - [Arithmetic](#arithmetic)
  - [Duration Between Dates](#duration-between-dates)
- [Formatting Tokens Reference](#formatting-tokens-reference)
- [Locales](#locales)
- [TypeScript Types](#typescript-types)
- [Edge Cases & Tips](#edge-cases--tips)
- [License](#license)

## Installation

```bash
npm install @subrotosaha/datekit
# or
yarn add @subrotosaha/datekit
# or
pnpm add @subrotosaha/datekit
```

## Quick Start

```typescript
import { DateKit, Duration } from "@subrotosaha/datekit";

const dk = new DateKit("2024-03-15T14:30:45.123Z");
console.log(dk.format("YYYY-MM-DD HH:mm:ss")); // 2024-03-15 14:30:45

// Chain operations (immutable)
const endOfWeek = dk.startOf("month").add(2, "week").endOf("week");
console.log(endOfWeek.format("YYYY-MM-DD")); // e.g., 2024-03-16

// Duration
const dur = new Duration({ hours: 2, minutes: 30 });
console.log(dur.asMinutes()); // 150
console.log(dur.humanize()); // "2 hours, 30 minutes"
```

## Design Notes

- UTC by default: DateKit uses UTC get/set/format for consistency across environments.
- Immutable design: All mutating methods (add, subtract, set, startOf, endOf, etc.) return new DateKit instances.
- Strict types:
  - DateInput = `Date | string | number`
  - TimeUnit includes: `'millisecond' | 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year'`.

## API Overview

DateKit (core)

- Constructors: `new DateKit(date?: DateInput, config?: DateKitConfig)`
- Formatting: `format(pattern)`
- Timezone Support: `formatInTimezone`, `convertTimezone`, `fromTimezone`, `getTimezoneOffset`, `formatFromTimezoneString`
- Getters/Converters: `toDate`, `toISOString`, `toUnix`, `valueOf`, `toArray`, `toObject`, `toJSON`, `toString`
- Individual Unit Getters: `year`, `month`, `getDate`, `day`, `hour`, `minute`, `second`, `millisecond`, `quarter`, `week`, `isoWeek`, `weekday`, `isoWeekday`, `dayOfYear`, `weekYear`
- Setters: `set({})`, `setYear`, `setMonth`, `setDate`, `setHour`, `setMinute`, `setSecond`, `setMillisecond`, `setQuarter`
- Manipulation: `add(value, unit)`, `subtract(value, unit)`
- Start/End: `startOf(unit)`, `endOf(unit)`
- Comparison: `isBefore`, `isAfter`, `isSame`, `isSameOrBefore`, `isSameOrAfter`, `isBetween`
- Queries: `isToday`, `isTomorrow`, `isYesterday`, `isThisWeek`, `isThisMonth`, `isThisQuarter`, `isThisYear`, `isWeekend`, `isWeekday`, `isLeapYear`, `isDST`
- Differences: `diff(date, unit='millisecond', precise=false)`
- Relative time: `fromNow`, `toNow`, `from(date)`, `to(date)`
- Calendar time: `calendar(referenceDate?)`
- Utilities: `daysInMonth`, `weeksInYear`, `age(toDate?)`, `clone`
- Business Days: `isBusinessDay`, `addBusinessDays`, `subtractBusinessDays`, `businessDaysUntil`
- Locale: `locale()` getter and `locale(name)` setter
- Range/Interval: `DateKit.eachDayOfInterval`, `eachWeekOfInterval`, `eachMonthOfInterval`
- Static: `now`, `utc`, `unix`, `isValid`, `max`, `min`, `isDuration`, `duration` factory
  Duration (time spans)

- Constructors: `new Duration(number, unit)` `or new Duration({obj})`, `DateKit.duration(...)`
- Conversions: `asMilliseconds`, `asSeconds`, `asMinutes`, `asHours`, `asDays`, `asWeeks`, `asMonths`, `asYears`
- Humanize: `humanize()` (e.g., “5 days”)
- Object: `toObject()`
- Arithmetic: `add(other)`, `subtract(other)`
- Between: `Duration.between(date1, date2)`

## DateKit Usage

### Constructors

Create a new DateKit wrapping an internal Date (UTC-based ops).

```typescript
const a = new DateKit(); // now
const b = new DateKit("2024-03-15T14:30:45.123Z");
const c = new DateKit(new Date("2024-03-15T14:30:45.123Z"));
const d = new DateKit(1705329045123); // timestamp ms

// Config (locale, weekStartsOn)
const es = new DateKit("2024-01-15", { locale: "es", weekStartsOn: 1 });
```

### Formatting

Formats using tokens (UTC).

```typescript
const dk = new DateKit("2024-03-15T14:30:45.123Z");

dk.format("YYYY-MM-DD"); // 2024-03-15
dk.format("HH:mm:ss"); // 14:30:45
dk.format("dddd, MMMM D, YYYY"); // Friday, March 15, 2024
dk.format("YYYY-MM-DD HH:mm:ss.SSS"); // 2024-03-15 14:30:45.123
dk.format("YYYY [escaped] MM"); // 2024 escaped 03
```

### Timezone Support

DateKit provides comprehensive IANA timezone support for working with dates across different timezones. All methods handle Daylight Saving Time (DST) automatically.

#### formatInTimezone

Display a UTC date in any IANA timezone:

```typescript
const utcDate = new Date("2025-08-31T12:00:00Z");

DateKit.formatInTimezone(utcDate, "Asia/Dhaka", "DD-MM-YYYY HH:mm");
// '31-08-2025 18:00' (UTC+6)

DateKit.formatInTimezone(utcDate, "America/New_York", "DD-MM-YYYY HH:mm");
// '31-08-2025 08:00' (EDT: UTC-4)

DateKit.formatInTimezone(utcDate, "Europe/London", "DD-MM-YYYY HH:mm");
// '31-08-2025 13:00' (BST: UTC+1)
```

#### convertTimezone

Convert dates between different timezones:

```typescript
const localTime = "2025-08-31T14:30:00";

// Convert from Asia/Dhaka to America/New_York
DateKit.convertTimezone(
  localTime,
  "Asia/Dhaka",
  "America/New_York",
  "DD-MM-YYYY HH:mm"
);
// '31-08-2025 04:30'

// Convert from America/Los_Angeles to Asia/Tokyo
DateKit.convertTimezone(
  "2025-08-31T09:00:00",
  "America/Los_Angeles",
  "Asia/Tokyo",
  "DD-MM-YYYY HH:mm"
);
// '01-09-2025 01:00'
```

#### fromTimezone

Create a DateKit instance from date components in a specific timezone:

```typescript
// Create date representing 14:30 in Bangladesh time
const dhakaDate = DateKit.fromTimezone(2025, 8, 31, 14, 30, 0, "Asia/Dhaka");
dhakaDate.toISOString(); // '2025-08-31T08:30:00.000Z' (stored as UTC)

// Create date representing 14:30 in New York time
const nyDate = DateKit.fromTimezone(2025, 8, 31, 14, 30, 0, "America/New_York");
nyDate.toISOString(); // '2025-08-31T18:30:00.000Z' (stored as UTC)
```

#### getTimezoneOffset

Get the timezone offset in minutes for any IANA timezone:

```typescript
DateKit.getTimezoneOffset("Asia/Dhaka"); // 360 (UTC+6)
DateKit.getTimezoneOffset("America/New_York"); // -240 (EDT) or -300 (EST)
DateKit.getTimezoneOffset("Asia/Kolkata"); // 330 (UTC+5:30)
DateKit.getTimezoneOffset("Asia/Kathmandu"); // 345 (UTC+5:45)

// Check offset at specific date (for DST handling)
const summerDate = new Date("2025-08-15T12:00:00Z");
const winterDate = new Date("2025-01-15T12:00:00Z");

DateKit.getTimezoneOffset("America/New_York", summerDate); // -240 (EDT)
DateKit.getTimezoneOffset("America/New_York", winterDate); // -300 (EST)
```

#### formatFromTimezoneString

Parse and format timezone-aware date strings (like browser's `toString()` output):

```typescript
const dateString =
  "Sun Aug 31 2025 00:00:00 GMT+0600 (Bangladesh Standard Time)";

DateKit.formatFromTimezoneString(dateString, "DD-MM-YYYY");
// '31-08-2025' (preserves the date in original timezone)

DateKit.formatFromTimezoneString(dateString, "YYYY-MM-DD HH:mm:ss");
// '2025-08-31 00:00:00'
```

#### Common Use Cases

**International Meeting Scheduler:**

```typescript
const meetingTime = "2025-09-15T14:00:00"; // Scheduled in Asia/Dhaka

console.log("Meeting scheduled at:", meetingTime, "(Asia/Dhaka)");
console.log(
  "Team in New York:",
  DateKit.convertTimezone(
    meetingTime,
    "Asia/Dhaka",
    "America/New_York",
    "HH:mm"
  )
);
console.log(
  "Team in London:",
  DateKit.convertTimezone(meetingTime, "Asia/Dhaka", "Europe/London", "HH:mm")
);
console.log(
  "Team in Tokyo:",
  DateKit.convertTimezone(meetingTime, "Asia/Dhaka", "Asia/Tokyo", "HH:mm")
);
```

**Display Event in User's Timezone:**

```typescript
const eventUtc = new Date("2025-12-25T00:00:00Z");
const userTimezone = "America/Chicago";

DateKit.formatInTimezone(eventUtc, userTimezone, "dddd, MMMM DD, YYYY HH:mm");
// 'Wednesday, December 24, 2025 18:00'
```

**Store User Input as UTC:**

```typescript
// User enters: 2025-10-15 09:30 in America/Chicago
const utcDate = DateKit.fromTimezone(2025, 10, 15, 9, 30, 0, "America/Chicago");
// Store in database
const dbValue = utcDate.toISOString(); // '2025-10-15T14:30:00.000Z'

// Display back to user
DateKit.formatInTimezone(
  utcDate.toDate(),
  "America/Chicago",
  "YYYY-MM-DD HH:mm"
);
// '2025-10-15 09:30'
```

### Getters / Converters

Return various representations.

```typescript
const dk = new DateKit("2024-01-15T14:30:45.123Z");

dk.toDate(); // JS Date copy
dk.toISOString(); // '2024-01-15T14:30:45.123Z'
dk.toUnix(); // 1705329045 (seconds)
dk.valueOf(); // 1705329045123 (ms)
dk.toArray(); // [2024, 0, 15, 14, 30, 45, 123]
dk.toObject(); // { year, month, date, hour, minute, second, millisecond }
dk.toJSON(); // ISO string
dk.toString(); // Native Date string
```

### Individual Unit Getters

UTC getters for parts of the date.

```typescript
const dk = new DateKit("2024-03-15T14:30:45.123Z");
dk.year(); // 2024
dk.month(); // 2 (0-indexed: Jan=0)
dk.getDate(); // 15
dk.day(); // 5 (Fri, 0=Sun)
dk.hour(); // 14
dk.minute(); // 30
dk.second(); // 45
dk.millisecond(); // 123
dk.quarter(); // 1
dk.week(); // 11 (ISO week)
dk.isoWeek(); // 11
dk.weekday(); // 5 (locale-aware, weekStartsOn in config)
dk.isoWeekday(); // 5 (Mon=1..Sun=7)
dk.dayOfYear(); // 75
dk.weekYear(); // 2024
```

### Setters

Return new DateKit with units set (UTC).

```typescript
const base = new DateKit("2024-01-15T10:30:45.123Z");
base.setYear(2025).year(); // 2025
base.setMonth(11).month(); // 11 (December)
base.setDate(25).getDate(); // 25
base.setHour(15).hour(); // 15
base.setMinute(45).minute(); // 45
base.setSecond(30).second(); // 30
base.setMillisecond(500).millisecond(); // 500
base.setQuarter(3).quarter(); // 3

// Multi-set
base
  .set({ year: 2025, month: 11, date: 25, hour: 15 })
  .format("YYYY-MM-DD HH:mm"); // 2025-12-25 15:30
```

### Manipulation

Adds/subtracts amounts in UTC; returns new instance.

```typescript
const dk = new DateKit("2024-01-15T10:00:00Z");
dk.add(5, "day").format("YYYY-MM-DD"); // 2024-01-20
dk.add(2, "month").format("YYYY-MM-DD"); // 2024-03-15
dk.add(1, "year").format("YYYY-MM-DD"); // 2025-01-15
dk.add(3, "hour").format("HH:mm:ss"); // 13:00:00

dk.subtract(5, "day").format("YYYY-MM-DD"); // 2024-01-10
dk.subtract(3, "hour").format("HH:mm"); // 07:00
dk.subtract(1, "month").format("YYYY-MM-DD"); // 2023-12-15
dk.subtract(1, "year").format("YYYY-MM-DD"); // 2023-01-15
```

### Start/End of Units

Snap to start/end of a unit (UTC).

```typescript
const dk = new DateKit("2024-03-15T14:30:45.123Z");
dk.startOf("day").format("YYYY-MM-DD HH:mm:ss"); // 2024-03-15 00:00:00
dk.endOf("day").format("YYYY-MM-DD HH:mm:ss"); // 2024-03-15 23:59:59
dk.startOf("week").format("YYYY-MM-DD"); // Start of week (Sunday by default)
dk.startOf("month").format("YYYY-MM-DD"); // 2024-03-01
dk.endOf("month").format("YYYY-MM-DD"); // 2024-03-31
dk.startOf("quarter").format("YYYY-MM-DD"); // 2024-01-01
dk.endOf("year").format("YYYY-MM-DD"); // 2024-12-31
dk.startOf("hour").format("HH:mm:ss.SSS"); // 14:00:00.000
dk.endOf("minute").format("HH:mm:ss.SSS"); // 14:30:59.999
```

### Comparison

Compare times or by unit buckets.

```typescript
const a = new DateKit("2024-01-15");
const b = new DateKit("2024-01-20");

a.isBefore(b); // true (absolute ms)
b.isAfter(a); // true
a.isSame("2024-01-15"); // true
a.isSame(b, "month"); // true (both Jan 2024)
a.isSameOrBefore(b); // true
b.isSameOrAfter(a); // true

// isBetween(start, end, unit?, inclusivity)
const x = new DateKit("2024-01-15");
x.isBetween("2024-01-10", "2024-01-20"); // true (exclusive, '()')
x.isBetween("2024-01-15", "2024-01-20", undefined, "[]"); // true (inclusive)
x.isBetween("2024-01-10", "2024-01-15", "day", "[)"); // true
```

### Query helpers

Boolean checks for common date queries.

```typescript
const today = DateKit.now();
const tomorrow = DateKit.now().add(1, "day");
const yesterday = DateKit.now().subtract(1, "day");

today.isToday(); // true
tomorrow.isTomorrow(); // true
yesterday.isYesterday(); // true

today.isThisWeek(); // true
today.isThisMonth(); // true
today.isThisQuarter(); // true
today.isThisYear(); // true

new DateKit("2024-01-13").isWeekend(); // true (Saturday)
new DateKit("2024-01-15").isWeekday(); // true (Monday)
new DateKit("2024-02-01").isLeapYear(); // 2024 is leap, true
DateKit.now().isDST(); // depends on environment/timezone
```

### Differences

Signed difference; floored unless `precise=true` or `unit='millisecond'`.

```typescript
const a = new DateKit("2024-01-20T14:30:00Z");
const b = new DateKit("2024-01-15T10:00:00Z");

a.diff(b, "day"); // 5
a.diff(b, "hour"); // 124
a.diff(b, "minute"); // 7470
a.diff(b, "millisecond"); // exact ms

// Precise (floating)
new DateKit("2024-01-15T12:00:00Z").diff("2024-01-15T00:00:00Z", "day", true); // 0.5
new DateKit("2024-01-31").diff("2024-01-01", "month", true); // ~0.9677
```

### Relative Time

Human-friendly “ago/in” strings.

```typescript
DateKit.now().subtract(5, "minute").fromNow(); // "5 minutes ago"
DateKit.now().add(2, "hour").toNow(); // "in 2 hours"

const start = new DateKit("2024-01-15");
const end = new DateKit("2024-01-20");
start.from(end); // "in 5 days" (or "5 days ago" depending orientation)
end.to(start); // "5 days ago"
```

### Calendar Time

Human-friendly calendar strings.

```typescript
DateKit.now().calendar(); // "Today at 14:30"
DateKit.now().add(1, "day").calendar(); // "Tomorrow at 14:30"
DateKit.now().subtract(1, "day").calendar(); // "Yesterday at 14:30"
new DateKit("2024-01-10").calendar(); // "Jan 10, 2024"
new DateKit("2023-12-25").calendar(); // "Dec 25, 2023"
new DateKit("2024-01-15T10:00:00Z").calendar(DateKit.now().add(3, "day")); // "on Jan 15, 2024"
```

### Utilities

Various helpful static and instance utilities.

```typescript
new DateKit("2024-02-15").daysInMonth(); // 29 (leap)
new DateKit("2024-01-01").weeksInYear(); // 52 or 53
new DateKit("1990-05-15").age("2024-06-15"); // 34 (accurate to birthday)
const copy = new DateKit("2024-01-15").clone(); // independent copy
```

### Business Days

Business day calculations (Mon-Fri).

```typescript
const monday = new DateKit("2024-01-15");
monday.isBusinessDay(); // true

const friday = new DateKit("2024-01-12"); // Friday
friday.addBusinessDays(1).format("YYYY-MM-DD"); // Monday 2024-01-15

const holidays = [new Date("2024-01-15")];
new DateKit("2024-01-11").addBusinessDays(2, holidays).format("YYYY-MM-DD"); // 2024-01-16

new DateKit("2024-01-15").businessDaysUntil("2024-01-19"); // 5
new DateKit("2024-01-19").businessDaysUntil("2024-01-15"); // -5
```

### Locale

Get/set locale for formatting.

```typescript
const dk = new DateKit("2024-03-15T14:30:00Z"); // default 'en'
dk.format("dddd, MMMM D, YYYY"); // Friday, March 15, 2024

const es = dk.locale("es") as DateKit;
es.format("dddd, D [de] MMMM [de] YYYY"); // Viernes, 15 de Marzo de 2024

// Get current locale name
dk.locale(); // 'en'
es.locale(); // 'es'
```

### Ranges/Intervals

Static helpers to iterate over date ranges.

```typescript
const days = DateKit.eachDayOfInterval({
  start: "2024-01-01",
  end: "2024-01-07",
});
days.map((d) => d.format("YYYY-MM-DD")); // 2024-01-01 ... 2024-01-07

const weeks = DateKit.eachWeekOfInterval({
  start: "2024-01-01",
  end: "2024-01-31",
});

const months = DateKit.eachMonthOfInterval({
  start: "2024-01-01",
  end: "2024-06-30",
});
months.map((m) => m.format("YYYY-MM")); // 2024-01 ... 2024-06
```

## Static Methods

```typescript
DateKit.now(); // DateKit(now)
DateKit.utc("2024-01-15"); // DateKit at that UTC date/time
DateKit.unix(1705329045); // From unix seconds
DateKit.isValid("2024-01-15"); // true/false
DateKit.max("2024-01-01", "2024-06-15", "2024-03-20").format("YYYY-MM-DD"); // 2024-06-15
DateKit.min("2024-01-01", "2024-06-15", "2024-03-20").format("YYYY-MM-DD"); // 2024-01-01

// Timezone methods
DateKit.formatInTimezone(date, "Asia/Dhaka", "DD-MM-YYYY HH:mm");
DateKit.convertTimezone(
  date,
  "Asia/Dhaka",
  "America/New_York",
  "DD-MM-YYYY HH:mm"
);
DateKit.fromTimezone(2025, 8, 31, 14, 30, 0, "Asia/Dhaka");
DateKit.getTimezoneOffset("Asia/Dhaka"); // 360 (UTC+6)
DateKit.formatFromTimezoneString(
  "Sun Aug 31 2025 00:00:00 GMT+0600",
  "DD-MM-YYYY"
);

import { Duration } from "@yourname/datekit";
DateKit.isDuration(new Duration(5, "days")); // true
DateKit.duration(5, "days").asDays(); // 5
DateKit.duration({ hours: 2, minutes: 30 }).asMinutes(); // 150
```

## Duration Usage

```typescript
import { Duration } from "@yourname/datekit";

new Duration(5, "days").asDays(); // 5
new Duration({ hours: 2, minutes: 30, seconds: 45 }).asMinutes(); // ~150.75

// via factory
import { DateKit } from "@yourname/datekit";
DateKit.duration(90, "minutes").asHours(); // 1.5
DateKit.duration({ weeks: 2 }).asDays(); // ~14

// Between two dates
const d1 = new Date("2024-01-01T00:00:00Z");
const d2 = new Date("2024-01-01T02:30:00Z");
Duration.between(d1, d2).asHours(); // 2.5
```

## Conversions

```typescript
const dur = new Duration(90, "minutes");
dur.asMilliseconds(); // 5400000
dur.asSeconds(); // 5400
dur.asMinutes(); // 90
dur.asHours(); // 1.5
dur.asDays(); // 0.0625
dur.asWeeks(); // ~0.00893
dur.asMonths(); // approx (30.44 days/month)
dur.asYears(); // approx (365.25 days/year)
```

### Humanize

```typescript
new Duration(30, "seconds").humanize(); // 'a few seconds'
new Duration(1, "minutes").humanize(); // 'a minute'
new Duration(5, "hours").humanize(); // '5 hours'
new Duration(35, "days").humanize(); // 'a month'
new Duration(400, "days").humanize(); // 'a year'
new Duration({ days: 2, hours: 5, minutes: 30 }).humanize(); // '2 days, 5 hours, 30 minutes'
```

### To Object

```typescript
new Duration({ days: 2, hours: 5, minutes: 30 }).toObject();
// { years, months, days, hours, minutes, seconds, milliseconds }
```

### Arithmetic

```typescript
const a = new Duration(1, "hours");
const b = new Duration(30, "minutes");
a.add(b).asMinutes(); // 90

new Duration(2, "hours").subtract(b).asMinutes(); // 90
```

### Duration Between Dates

```typescript
new DateKit("2024-01-15T10:00:00Z").duration("2024-01-15T12:30:00Z").asHours(); // 2.5
new DateKit("2024-01-01").duration("2024-02-01").asDays(); // 31
```

## Formatting Tokens Reference

| Group       | Token | Example/Meaning       |
| ----------- | ----- | --------------------- |
| Year        | YYYY  | 2024                  |
|             | YY    | 24                    |
| Quarter     | Q     | 1..4                  |
|             | Qo    | 1st, 2nd, …           |
| Month       | MMMM  | March                 |
|             | MMM   | Mar                   |
|             | MM    | 01..12                |
|             | M     | 1..12                 |
|             | Mo    | 1st..12th             |
| Week        | W     | ISO week              |
|             | WW    | 2-digit ISO week      |
|             | Wo    | ISO week with ordinal |
| Day of Year | DDD   | 1..366                |
|             | DDDD  | 001..366              |
|             | DDDo  | 75th…                 |
| Day         | DD    | 01..31                |
|             | D     | 1..31                 |
|             | Do    | 1st..31st             |
| Weekday     | dddd  | Friday                |
|             | ddd   | Fri                   |
|             | dd    | Fr                    |
|             | d     | 0..6 (Sun=0)          |
|             | do    | 0th..6th              |
| Hour (24h)  | HH    | 00..23                |
|             | H     | 0..23                 |
| Hour (12h)  | hh    | 01..12                |
|             | h     | 1..12                 |
| Minute      | mm    | 00..59                |
|             | m     | 0..59                 |
| Second      | ss    | 00..59                |
|             | s     | 0..59                 |
| Millisecond | SSS   | 000..999              |
|             | SS    | 00..99 (ms 2 digits)  |
|             | S     | 0..9 (decisecond)     |
| AM/PM       | A     | AM/PM                 |
|             | a     | am/pm                 |
| Timezone    | Z     | +00:00                |
|             | ZZ    | +0000                 |
| Unix        | X     | Unix seconds          |
|             | x     | Unix milliseconds     |

## Locales

Built-in: `en` (English), `es` (Spanish)

Switching:

```typescript
const dk = new DateKit("2024-03-15T14:30:00Z");
dk.format("MMMM"); // March

const es = dk.locale("es") as DateKit;
es.format("MMMM"); // Marzo
```

You can register custom locales (see source for `registerLocale` and `LocaleConfig`), providing:

- `name`, `months`, `monthsShort`, `weekdays`, `weekdaysShort`, `weekdaysMin`
- `ordinal(n)`, `relativeTime` (strings/templates), `calendar` (templates)

## TypeScript Types

```typescript
type DateInput = Date | string | number;

type TimeUnit =
  | "millisecond"
  | "second"
  | "minute"
  | "hour"
  | "day"
  | "week"
  | "month"
  | "quarter"
  | "year";

interface DateKitConfig {
  locale?: string;
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  timezone?: string;
  strictParsing?: boolean;
}

interface SetDateValues {
  year?: number;
  month?: number;
  date?: number;
  hour?: number;
  minute?: number;
  second?: number;
  millisecond?: number;
}

interface DateInterval {
  start: DateInput;
  end: DateInput;
}

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
```

## Edge Cases & Tips

- **Timezone**: Formatting and math use UTC by default to prevent locale/timezone drift. Use the timezone methods (`formatInTimezone`, `convertTimezone`, etc.) for IANA timezone support.
- **IANA Timezones**: Full support for IANA timezone database (e.g., `Asia/Dhaka`, `America/New_York`). DST is handled automatically.
- **Prefer ISO "Z" inputs**: For UTC dates, use ISO strings with "Z" suffix for consistency.
- **Month overflow**: Native `Date` rules apply (e.g., Jan 31 + 1 month may roll).
- **Weeks in year**: ISO rules — some years have 53 weeks.
- **DST**: `isDST()` result depends on your environment's timezone rules. For IANA timezones, use `getTimezoneOffset()` with a specific date.
- **Immutability**: All "changing" methods return new DateKit instances - originals do not change.
- **Parsing**: String parsing uses native `Date`. Invalid inputs throw "Invalid date provided".

## License

MIT License © 2024 Subroto Saha
