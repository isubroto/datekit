import { DateInput } from "../types";

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
export function parseDateFromFormat(dateStr: string, formatStr: string): Date {
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

  // Resolve 12-hour clock
  if ("hour12" in parsed || ampm) {
    let h = parsed["hour12"] ?? parsed["hour"];
    if (ampm === "PM" && h < 12) h += 12;
    if (ampm === "AM" && h === 12) h = 0;
    parsed["hour"] = h;
    delete parsed["hour12"];
  }

  return new Date(
    Date.UTC(
      parsed["year"],
      parsed["month"] - 1,
      parsed["day"],
      parsed["hour"] ?? 0,
      parsed["minute"] ?? 0,
      parsed["second"] ?? 0,
      parsed["ms"] ?? 0
    )
  );
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
  /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:?\d{2})?)?$/;

export function parseDate(input: DateInput, strict?: boolean): Date {
  if (input instanceof Date) {
    return new Date(input);
  }

  if (typeof input === "number") {
    return new Date(input);
  }

  if (typeof input === "string") {
    if (strict && !ISO_PATTERN.test(input.trim())) {
      throw new Error(
        `Strict parsing failed: "${input}" is not an unambiguous ISO 8601 date string. ` +
          `Use a format like "YYYY-MM-DD" or "YYYY-MM-DDTHH:mm:ssZ", ` +
          `or disable strict mode.`
      );
    }
    return new Date(input);
  }

  throw new Error("Invalid date input");
}
