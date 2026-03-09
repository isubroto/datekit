import { DateKit } from "../DateKit";
import { getLocale } from "../locales";

export function formatCalendar(
  date: Date,
  referenceDate: Date = new Date(),
  locale: string = "en"
): string {
  const localeConfig = getLocale(locale);
  const dk = new DateKit(date);
  const ref = new DateKit(referenceDate);

  const dayDiff = dk.startOf("day").diff(ref.startOf("day").toDate(), "day");

  let format: string;

  if (dayDiff === 0) {
    format = localeConfig.calendar.sameDay;
  } else if (dayDiff === 1) {
    format = localeConfig.calendar.nextDay;
  } else if (dayDiff === -1) {
    format = localeConfig.calendar.lastDay;
  } else if (dayDiff > 1 && dayDiff <= 7) {
    format = localeConfig.calendar.nextWeek;
  } else if (dayDiff < -1 && dayDiff >= -7) {
    format = localeConfig.calendar.lastWeek;
  } else {
    format = localeConfig.calendar.sameElse;
  }

  // Replace all [literal text] bracket pairs, then substitute tokens.
  // LT and L are replaced with whole-word regexes (LT first, so "L" can't
  // accidentally eat the first char of "LT"). /g handles multiple occurrences.
  format = format
    .replace(/\[([^\]]*?)\]/g, "$1")
    .replace(/\bLT\b/g, dk.format("HH:mm"))
    .replace(/\bL\b/g, dk.format("MM/DD/YYYY"))
    .replace(/\bdddd\b/g, localeConfig.weekdays[date.getUTCDay()]);

  return format;
}
