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

  // Simple template replacement
  format = format
    .replace("[", "")
    .replace("]", "")
    .replace("LT", dk.format("HH:mm"))
    .replace("L", dk.format("MM/DD/YYYY"))
    .replace("dddd", localeConfig.weekdays[date.getUTCDay()]);

  return format;
}
