import { getLocale } from "../locales";

/** Resolves a relativeTime entry that may be a string template or a function. */
function resolveRelativeEntry(
  entry: string | ((n: number) => string),
  n: number
): string {
  if (typeof entry === "function") return entry(n);
  return entry.replace("%d", String(n));
}

export function formatRelativeTime(
  milliseconds: number,
  locale: string = "en",
  withoutSuffix: boolean = false
): string {
  const localeConfig = getLocale(locale);
  const isFuture = milliseconds < 0;
  const absMs = Math.abs(milliseconds);

  const seconds = absMs / 1000;
  const minutes = seconds / 60;
  const hours = minutes / 60;
  const days = hours / 24;
  const months = days / 30.44;
  const years = days / 365.25;

  let result: string;

  if (seconds < 45) {
    result = localeConfig.relativeTime.s;
  } else if (seconds < 90) {
    result = localeConfig.relativeTime.m;
  } else if (minutes < 45) {
    result = resolveRelativeEntry(
      localeConfig.relativeTime.mm,
      Math.round(minutes)
    );
  } else if (minutes < 90) {
    result = localeConfig.relativeTime.h;
  } else if (hours < 22) {
    result = resolveRelativeEntry(
      localeConfig.relativeTime.hh,
      Math.round(hours)
    );
  } else if (hours < 36) {
    result = localeConfig.relativeTime.d;
  } else if (days < 25) {
    result = resolveRelativeEntry(
      localeConfig.relativeTime.dd,
      Math.round(days)
    );
  } else if (days < 45) {
    result = localeConfig.relativeTime.M;
  } else if (days < 345) {
    result = resolveRelativeEntry(
      localeConfig.relativeTime.MM,
      Math.round(months)
    );
  } else if (years < 1.5) {
    result = localeConfig.relativeTime.y;
  } else {
    result = resolveRelativeEntry(
      localeConfig.relativeTime.yy,
      Math.round(years)
    );
  }

  if (withoutSuffix) {
    return result;
  }

  const template = isFuture
    ? localeConfig.relativeTime.future
    : localeConfig.relativeTime.past;
  return template.replace("%s", result);
}
