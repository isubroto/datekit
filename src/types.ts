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
  weekdays: string[];
  weekdaysShort: string[];
  weekdaysMin: string[];
  months: string[];
  monthsShort: string[];
  ordinal: (n: number) => string;
  relativeTime: {
    future: string;
    past: string;
    s: string;
    m: string;
    mm: string;
    h: string;
    hh: string;
    d: string;
    dd: string;
    M: string;
    MM: string;
    y: string;
    yy: string;
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
