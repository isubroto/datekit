import { getLocale } from "../locales";

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
    result = localeConfig.relativeTime.mm.replace(
      "%d",
      Math.round(minutes).toString()
    );
  } else if (minutes < 90) {
    result = localeConfig.relativeTime.h;
  } else if (hours < 22) {
    result = localeConfig.relativeTime.hh.replace(
      "%d",
      Math.round(hours).toString()
    );
  } else if (hours < 36) {
    result = localeConfig.relativeTime.d;
  } else if (days < 25) {
    result = localeConfig.relativeTime.dd.replace(
      "%d",
      Math.round(days).toString()
    );
  } else if (days < 45) {
    result = localeConfig.relativeTime.M;
  } else if (days < 345) {
    result = localeConfig.relativeTime.MM.replace(
      "%d",
      Math.round(months).toString()
    );
  } else if (years < 1.5) {
    result = localeConfig.relativeTime.y;
  } else {
    result = localeConfig.relativeTime.yy.replace(
      "%d",
      Math.round(years).toString()
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
