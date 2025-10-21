import { getLocale } from "../locales";

export function formatDate(
  date: Date,
  formatStr: string,
  locale: string = "en"
): string {
  const localeConfig = getLocale(locale);

  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const day = date.getUTCDate();
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const seconds = date.getUTCSeconds();
  const milliseconds = date.getUTCMilliseconds();
  const dayOfWeek = date.getUTCDay();

  // Calculate day of year
  const startOfYear = new Date(Date.UTC(year, 0, 1));
  const dayOfYear =
    Math.floor((date.getTime() - startOfYear.getTime()) / 86400000) + 1;

  // Calculate quarter
  const quarter = Math.floor(month / 3) + 1;

  // Calculate ISO week
  const isoWeek = getISOWeek(date);

  // Create a map of tokens to values
  const tokenMap = new Map<string, string>();
  const placeholders = new Map<string, string>();

  // Define all tokens with their values
  const tokens: Record<string, string> = {
    // Year
    YYYY: year.toString(),
    YY: year.toString().slice(-2),

    // Quarter
    Qo: localeConfig.ordinal(quarter),
    Q: quarter.toString(),

    // Month
    MMMM: localeConfig.months[month],
    MMM: localeConfig.monthsShort[month],
    Mo: localeConfig.ordinal(month + 1),
    MM: (month + 1).toString().padStart(2, "0"),
    M: (month + 1).toString(),

    // Week
    Wo: localeConfig.ordinal(isoWeek),
    WW: isoWeek.toString().padStart(2, "0"),
    W: isoWeek.toString(),

    // Day of Year
    DDDo: localeConfig.ordinal(dayOfYear),
    DDDD: dayOfYear.toString().padStart(3, "0"),
    DDD: dayOfYear.toString(),

    // Day
    Do: localeConfig.ordinal(day),
    DD: day.toString().padStart(2, "0"),
    D: day.toString(),

    // Weekday
    dddd: localeConfig.weekdays[dayOfWeek],
    ddd: localeConfig.weekdaysShort[dayOfWeek],
    do: localeConfig.ordinal(dayOfWeek),
    dd: localeConfig.weekdaysMin[dayOfWeek],
    d: dayOfWeek.toString(),

    // Hour
    HH: hours.toString().padStart(2, "0"),
    H: hours.toString(),
    hh: (hours % 12 || 12).toString().padStart(2, "0"),
    h: (hours % 12 || 12).toString(),

    // Minute
    mm: minutes.toString().padStart(2, "0"),
    m: minutes.toString(),

    // Second
    ss: seconds.toString().padStart(2, "0"),
    s: seconds.toString(),

    // Millisecond
    SSS: milliseconds.toString().padStart(3, "0"),
    SS: milliseconds.toString().padStart(2, "0").slice(0, 2),
    S: Math.floor(milliseconds / 100).toString(),

    // AM/PM
    A: hours >= 12 ? "PM" : "AM",
    a: hours >= 12 ? "pm" : "am",

    // Timezone
    Z: formatTimezoneOffset(date.getTimezoneOffset()),
    ZZ: formatTimezoneOffset(date.getTimezoneOffset()).replace(":", ""),

    // Unix
    X: Math.floor(date.getTime() / 1000).toString(),
    x: date.getTime().toString(),
  };

  let result = formatStr;

  // Sort tokens by length (descending) to replace longer tokens first
  const sortedTokens = Object.keys(tokens).sort((a, b) => b.length - a.length);

  // First pass: Replace tokens with unique placeholders
  sortedTokens.forEach((token, index) => {
    const placeholder = `\x00${index}\x00`; // Use null character as delimiter
    const regex = new RegExp(token, "g");
    result = result.replace(regex, placeholder);
    placeholders.set(placeholder, tokens[token]);
  });

  // Second pass: Replace placeholders with actual values
  placeholders.forEach((value, placeholder) => {
    result = result.replace(new RegExp(placeholder, "g"), value);
  });

  return result;
}

function getISOWeek(date: Date): number {
  const target = new Date(date.getTime());
  target.setUTCHours(0, 0, 0, 0);
  target.setUTCDate(target.getUTCDate() + 4 - (target.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
  return Math.ceil(
    ((target.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
  );
}

function formatTimezoneOffset(offset: number): string {
  const sign = offset <= 0 ? "+" : "-";
  const absOffset = Math.abs(offset);
  const hours = Math.floor(absOffset / 60);
  const minutes = absOffset % 60;
  return `${sign}${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
}
