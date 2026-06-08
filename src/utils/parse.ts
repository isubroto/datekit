import { DateInput, OverflowMode } from "../types";

interface DateComponents {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  ms: number;
}

function isLeapYear(year: number): boolean {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

function daysInMonth(year: number, month: number): number {
  if (month === 2) return isLeapYear(year) ? 29 : 28;
  return [4, 6, 9, 11].includes(month) ? 30 : 31;
}

function constrain(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function createUtcDate(components: DateComponents): Date {
  const date = new Date(0);
  date.setUTCFullYear(components.year, components.month - 1, components.day);
  date.setUTCHours(
    components.hour,
    components.minute,
    components.second,
    components.ms
  );
  return date;
}

function createLocalDate(components: DateComponents): Date {
  const date = new Date(0);
  date.setFullYear(components.year, components.month - 1, components.day);
  date.setHours(
    components.hour,
    components.minute,
    components.second,
    components.ms
  );
  return date;
}

function componentsMatch(date: Date, expected: DateComponents): boolean {
  return (
    date.getUTCFullYear() === expected.year &&
    date.getUTCMonth() + 1 === expected.month &&
    date.getUTCDate() === expected.day &&
    date.getUTCHours() === expected.hour &&
    date.getUTCMinutes() === expected.minute &&
    date.getUTCSeconds() === expected.second &&
    date.getUTCMilliseconds() === expected.ms
  );
}

function normalizeComponents(
  components: DateComponents,
  overflow: OverflowMode,
  source: string
): DateComponents {
  if (overflow === "balance") return components;

  if (overflow === "constrain") {
    const month = constrain(components.month, 1, 12);
    return {
      year: components.year,
      month,
      day: constrain(components.day, 1, daysInMonth(components.year, month)),
      hour: constrain(components.hour, 0, 23),
      minute: constrain(components.minute, 0, 59),
      second: constrain(components.second, 0, 59),
      ms: constrain(components.ms, 0, 999),
    };
  }

  const valid =
    components.year >= 0 &&
    components.month >= 1 &&
    components.month <= 12 &&
    components.day >= 1 &&
    components.day <= daysInMonth(components.year, components.month) &&
    components.hour >= 0 &&
    components.hour <= 23 &&
    components.minute >= 0 &&
    components.minute <= 59 &&
    components.second >= 0 &&
    components.second <= 59 &&
    components.ms >= 0 &&
    components.ms <= 999;

  if (!valid) {
    throw new Error(`DateKit.parse: "${source}" contains invalid date values.`);
  }

  const date = createUtcDate(components);
  if (!componentsMatch(date, components)) {
    throw new Error(`DateKit.parse: "${source}" contains invalid date values.`);
  }

  return components;
}

/**
 * Token definitions for format-string parsing.
 * Maps token name → regex capturing group that matches its value.
 */
const PARSE_TOKENS: { token: string; regex: string; key: string }[] = [
  { token: "YYYY", regex: "(\\d{4})", key: "year" },
  { token: "YY", regex: "(\\d{2})", key: "year2" },
  { token: "MM", regex: "(\\d{1,2})", key: "month" },
  { token: "M", regex: "(\\d{1,2})", key: "month" },
  { token: "DD", regex: "(\\d{1,2})", key: "day" },
  { token: "D", regex: "(\\d{1,2})", key: "day" },
  { token: "HH", regex: "(\\d{1,2})", key: "hour" },
  { token: "H", regex: "(\\d{1,2})", key: "hour" },
  { token: "hh", regex: "(\\d{1,2})", key: "hour12" },
  { token: "h", regex: "(\\d{1,2})", key: "hour12" },
  { token: "mm", regex: "(\\d{1,2})", key: "minute" },
  { token: "m", regex: "(\\d{1,2})", key: "minute" },
  { token: "ss", regex: "(\\d{1,2})", key: "second" },
  { token: "s", regex: "(\\d{1,2})", key: "second" },
  { token: "SSS", regex: "(\\d{1,3})", key: "ms" },
  { token: "A", regex: "(AM|PM)", key: "ampm" },
  { token: "a", regex: "(am|pm)", key: "ampm" },
];

// Sorted longest-first so e.g. "YYYY" matches before "YY"
const SORTED_PARSE_TOKENS = [...PARSE_TOKENS].sort(
  (a, b) => b.token.length - a.token.length
);

/**
 * Parses a date string using an explicit format, e.g.:
 *   parseDateFromFormat("15/08/2025", "DD/MM/YYYY")
 *   parseDateFromFormat("08-31-2025 14:30", "MM-DD-YYYY HH:mm")
 *
 * Returns a Date built from UTC components.
 * Throws if the string doesn't match the format.
 */
export function parseDateFromFormat(
  dateStr: string,
  formatStr: string,
  overflow: OverflowMode = "reject"
): Date {
  // Step 1: Escape literal [...] sections in the format and record them
  const literals: string[] = [];
  const fmtWithPlaceholders = formatStr.replace(
    /\[([^\]]*?)\]/g,
    (_, lit: string) => {
      const key = `\x02${literals.length}\x02`;
      literals.push(lit.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")); // escape for regex later
      return key;
    }
  );

  // Step 2: Build a regex from the format string by substituting known tokens
  let regexStr = fmtWithPlaceholders;
  // Escape non-token, non-placeholder characters that are regex special
  regexStr = regexStr.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const keyOrder: string[] = [];
  // Replace tokens (already escaped above? No — we escape the whole string,
  // which also escapes \x02 placeholders. We need to work differently.)
  // Better approach: build the regex piece by piece.

  // Rebuild: walk the format char by char, matching tokens greedily.
  let regexParts: string[] = [];
  let remaining = fmtWithPlaceholders;
  while (remaining.length > 0) {
    // Check for literal placeholder \x02N\x02
    const litMatch = remaining.match(/^\x02(\d+)\x02/);
    if (litMatch) {
      regexParts.push(literals[parseInt(litMatch[1])]);
      remaining = remaining.slice(litMatch[0].length);
      continue;
    }

    // Try each token (sorted longest first)
    let matched = false;
    for (const { token, regex, key } of SORTED_PARSE_TOKENS) {
      if (remaining.startsWith(token)) {
        regexParts.push(regex);
        keyOrder.push(key);
        remaining = remaining.slice(token.length);
        matched = true;
        break;
      }
    }

    if (!matched) {
      // Literal character — escape it for the regex
      const ch = remaining[0];
      regexParts.push(ch.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
      remaining = remaining.slice(1);
    }
  }

  const fullRegex = new RegExp(`^${regexParts.join("")}$`);
  const match = dateStr.trim().match(fullRegex);

  if (!match) {
    throw new Error(
      `DateKit.parse: "${dateStr}" does not match format "${formatStr}".`
    );
  }

  // Step 3: Extract parsed values
  const parsed: Record<string, number> = {
    year: 1970,
    month: 1,
    day: 1,
    hour: 0,
    minute: 0,
    second: 0,
    ms: 0,
  };
  let ampm = "";

  keyOrder.forEach((key, i) => {
    const val = match[i + 1];
    if (key === "ampm") {
      ampm = val.toUpperCase();
    } else if (key === "year2") {
      const n = parseInt(val, 10);
      parsed["year"] = n >= 70 ? 1900 + n : 2000 + n;
    } else {
      parsed[key] = parseInt(val, 10);
    }
  });

  if ("hour12" in parsed) {
    if (
      overflow === "reject" &&
      (parsed["hour12"] < 1 || parsed["hour12"] > 12)
    ) {
      throw new Error(
        `DateKit.parse: "${dateStr}" contains invalid date values.`
      );
    }
    if (overflow === "constrain") {
      parsed["hour12"] = constrain(parsed["hour12"], 1, 12);
    }
  }

  // Resolve 12-hour clock
  if ("hour12" in parsed || ampm) {
    let h = parsed["hour12"] ?? parsed["hour"];
    if (ampm === "PM" && h < 12) h += 12;
    if (ampm === "AM" && h === 12) h = 0;
    parsed["hour"] = h;
    delete parsed["hour12"];
  }

  const components = normalizeComponents(
    {
      year: parsed["year"],
      month: parsed["month"],
      day: parsed["day"],
      hour: parsed["hour"] ?? 0,
      minute: parsed["minute"] ?? 0,
      second: parsed["second"] ?? 0,
      ms: parsed["ms"] ?? 0,
    },
    overflow,
    dateStr
  );

  return createUtcDate(components);
}

/**
 * ISO 8601 patterns considered unambiguous:
 *   2025-08-31                          (date only)
 *   2025-08-31T14:30                    (date + time, no tz)
 *   2025-08-31T14:30:00                 (with seconds)
 *   2025-08-31T14:30:00.123             (with ms)
 *   2025-08-31T14:30:00Z                (UTC)
 *   2025-08-31T14:30:00+06:00           (offset)
 */
const ISO_PATTERN =
  /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d+))?)?(Z|([+-])(\d{2}):?(\d{2}))?)?$/;

function parseIsoDate(input: string, overflow: OverflowMode): Date {
  const match = input.match(ISO_PATTERN);
  if (!match) {
    throw new Error(
      `Strict parsing failed: "${input}" is not an unambiguous ISO 8601 date string. ` +
        `Use a format like "YYYY-MM-DD" or "YYYY-MM-DDTHH:mm:ssZ", ` +
        `or disable strict mode.`
    );
  }

  const components = normalizeComponents(
    {
      year: parseInt(match[1], 10),
      month: parseInt(match[2], 10),
      day: parseInt(match[3], 10),
      hour: match[4] ? parseInt(match[4], 10) : 0,
      minute: match[5] ? parseInt(match[5], 10) : 0,
      second: match[6] ? parseInt(match[6], 10) : 0,
      ms: match[7]
        ? parseInt(match[7].slice(0, 3).padEnd(3, "0"), 10)
        : 0,
    },
    overflow,
    input
  );

  if (!match[4] || match[8]) {
    const date = createUtcDate(components);
    if (match[8] && match[8] !== "Z") {
      let offsetHour = parseInt(match[10], 10);
      let offsetMinute = parseInt(match[11], 10);

      if (overflow === "reject" && (offsetHour > 23 || offsetMinute > 59)) {
        throw new Error(
          `DateKit.parse: "${input}" contains invalid date values.`
        );
      }
      if (overflow === "constrain") {
        offsetHour = constrain(offsetHour, 0, 23);
        offsetMinute = constrain(offsetMinute, 0, 59);
      }

      const sign = match[9] === "+" ? 1 : -1;
      date.setTime(
        date.getTime() - sign * (offsetHour * 60 + offsetMinute) * 60_000
      );
    }
    return date;
  }

  return createLocalDate(components);
}

export function parseDate(
  input: DateInput,
  strict?: boolean,
  overflow?: OverflowMode
): Date {
  if (input instanceof Date) {
    return new Date(input);
  }

  if (typeof input === "number") {
    return new Date(input);
  }

  if (typeof input === "string") {
    const trimmed = input.trim();
    if (strict || overflow) {
      if (strict || ISO_PATTERN.test(trimmed)) {
        return parseIsoDate(trimmed, strict ? "reject" : overflow ?? "balance");
      }
    }
    return new Date(input);
  }

  throw new Error("Invalid date input");
}
