export const MILLISECONDS_IN_SECOND = 1000;
export const MILLISECONDS_IN_MINUTE = 60 * 1000;
export const MILLISECONDS_IN_HOUR = 60 * 60 * 1000;
export const MILLISECONDS_IN_DAY = 24 * 60 * 60 * 1000;
export const MILLISECONDS_IN_WEEK = 7 * 24 * 60 * 60 * 1000;

export const DAYS_IN_WEEK = 7;
export const MONTHS_IN_YEAR = 12;
export const QUARTERS_IN_YEAR = 4;

export const DEFAULT_LOCALE = "en";

export const FORMAT_TOKENS = {
  // Year
  YYYY: "Full year (4 digits)",
  YY: "2-digit year",
  // Quarter
  Q: "Quarter (1-4)",
  Qo: "Quarter with ordinal",
  // Month
  MMMM: "Full month name",
  MMM: "Short month name",
  MM: "2-digit month",
  M: "Month number",
  Mo: "Month with ordinal",
  // Week
  W: "ISO week",
  Wo: "ISO week with ordinal",
  WW: "2-digit ISO week",
  w: "Week of year",
  wo: "Week with ordinal",
  ww: "2-digit week",
  // Day
  DDDD: "Day of year (001-365)",
  DDDo: "Day of year with ordinal",
  DDD: "Day of year (1-365)",
  DD: "2-digit day",
  Do: "Day with ordinal",
  D: "Day of month",
  dddd: "Full weekday name",
  ddd: "Short weekday name",
  dd: "Min weekday name",
  d: "Day of week (0-6)",
  do: "Day of week with ordinal",
  // Hour
  HH: "2-digit hour (00-23)",
  H: "Hour (0-23)",
  hh: "2-digit hour (01-12)",
  h: "Hour (1-12)",
  // Minute
  mm: "2-digit minute",
  m: "Minute",
  // Second
  ss: "2-digit second",
  s: "Second",
  // Millisecond
  SSS: "3-digit millisecond",
  SS: "2-digit millisecond",
  S: "Millisecond",
  // AM/PM
  A: "Uppercase AM/PM",
  a: "Lowercase am/pm",
  // Timezone
  Z: "Timezone offset (+00:00)",
  ZZ: "Timezone offset (+0000)",
  // Unix
  X: "Unix timestamp (seconds)",
  x: "Unix timestamp (milliseconds)",
};

export const BUSINESS_DAYS = [1, 2, 3, 4, 5]; // Monday to Friday
