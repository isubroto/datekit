export type DateInput = Date | string | number;

export type TimeUnit =
  | "millisecond"
  | "second"
  | "minute"
  | "hour"
  | "day"
  | "week"
  | "month"
  | "quarter"
  | "year";

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type QuarterNumber = 1 | 2 | 3 | 4;

export type RoundingMode = "trunc" | "floor" | "ceil" | "halfExpand";

export interface DiffOptions {
  roundingMode?: RoundingMode;
}

export interface DateKitConfig {
  locale?: string;
  weekStartsOn?: DayOfWeek;
  timezone?: string;
  strictParsing?: boolean;
}

export interface SetDateValues {
  year?: number;
  month?: number;
  date?: number;
  hour?: number;
  minute?: number;
  second?: number;
  millisecond?: number;
}

export interface LocaleConfig {
  name: string;
  /** Text direction. Use this to apply CSS `direction` automatically for RTL languages (ar, ur). */
  dir?: "ltr" | "rtl";
  weekdays: string[];
  weekdaysShort: string[];
  weekdaysMin: string[];
  months: string[];
  monthsShort: string[];
  ordinal: (n: number) => string;
  /**
   * Relative-time strings. Multi-unit keys (mm, hh, dd, MM, yy) may be either
   * a `string` with a `%d` placeholder OR a `(n: number) => string` function
   * for languages with complex plural rules (e.g. Russian).
   */
  relativeTime: {
    future: string;
    past: string;
    s: string;
    m: string;
    mm: string | ((n: number) => string);
    h: string;
    hh: string | ((n: number) => string);
    d: string;
    dd: string | ((n: number) => string);
    M: string;
    MM: string | ((n: number) => string);
    y: string;
    yy: string | ((n: number) => string);
  };
  calendar: {
    sameDay: string;
    nextDay: string;
    nextWeek: string;
    lastDay: string;
    lastWeek: string;
    sameElse: string;
  };
}

export interface DateInterval {
  start: DateInput;
  end: DateInput;
}

export interface DurationObject {
  years?: number;
  months?: number;
  weeks?: number;
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
  milliseconds?: number;
}
