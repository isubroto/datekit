import { LocaleConfig } from "../types";
import { en } from "./en";
import { es } from "./es";
import { fr } from "./fr";
import { de } from "./de";
import { ar } from "./ar";
import { zh } from "./zh";
import { hi } from "./hi";
import { bn } from "./bn";
import { ur } from "./ur";
import { pt } from "./pt";
import { ja } from "./ja";
import { ko } from "./ko";
import { ru } from "./ru";

const locales: Record<string, LocaleConfig> = {
  en,
  es,
  fr,
  de,
  ar,
  zh,
  hi,
  bn,
  ur,
  pt,
  ja,
  ko,
  ru,
};

export function getLocale(name: string): LocaleConfig {
  if (!(name in locales)) {
    console.warn(
      `[DateKit] Locale "${name}" is not registered. Falling back to "en". ` +
        `Register it with registerLocale() or import it from "datekit/locales/${name}".`
    );
  }
  return locales[name] || locales.en;
}

export function registerLocale(locale: LocaleConfig): void {
  locales[locale.name] = locale;
}

export { en, es, fr, de, ar, zh, hi, bn, ur, pt, ja, ko, ru };
