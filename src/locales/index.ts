import { LocaleConfig } from "../types";
import { en } from "./en";
import { es } from "./es";

const locales: Record<string, LocaleConfig> = {
  en,
  es,
};

export function getLocale(name: string): LocaleConfig {
  return locales[name] || locales.en;
}

export function registerLocale(locale: LocaleConfig): void {
  locales[locale.name] = locale;
}

export { en, es };
