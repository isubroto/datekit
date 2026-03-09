import { LocaleConfig } from "../types";

// Russian has complex plural rules:
//   1 → singular  (1 минута)
//   2-4 → few     (2 минуты)
//   5-20 → many   (5 минут)
//   21 → singular (21 минута), etc.
function pluralRu(n: number, one: string, few: string, many: string): string {
  const abs = Math.abs(Math.round(n));
  const mod10 = abs % 10;
  const mod100 = abs % 100;
  if (mod100 >= 11 && mod100 <= 19) return `${n} ${many}`;
  if (mod10 === 1) return `${n} ${one}`;
  if (mod10 >= 2 && mod10 <= 4) return `${n} ${few}`;
  return `${n} ${many}`;
}

export const ru: LocaleConfig = {
  name: "ru",
  dir: "ltr",
  weekdays: [
    "Воскресенье",
    "Понедельник",
    "Вторник",
    "Среда",
    "Четверг",
    "Пятница",
    "Суббота",
  ],
  weekdaysShort: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
  weekdaysMin: ["вс", "пн", "вт", "ср", "чт", "пт", "сб"],
  months: [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
  ],
  monthsShort: [
    "Янв",
    "Фев",
    "Мар",
    "Апр",
    "Май",
    "Июн",
    "Июл",
    "Авг",
    "Сен",
    "Окт",
    "Ноя",
    "Дек",
  ],
  ordinal: (n: number) => `${n}-й`,
  relativeTime: {
    future: "через %s",
    past: "%s назад",
    s: "несколько секунд",
    m: "минуту",
    // For mm/hh/dd/MM/yy the %d placeholder is replaced by the caller;
    // the plural helper is encoded directly as a tagged template trick:
    // we abuse the fact that formatRelativeTime replaces %d before returning.
    mm: (n: number) => pluralRu(n, "минута", "минуты", "минут"),
    h: "час",
    hh: (n: number) => pluralRu(n, "час", "часа", "часов"),
    d: "день",
    dd: (n: number) => pluralRu(n, "день", "дня", "дней"),
    M: "месяц",
    MM: (n: number) => pluralRu(n, "месяц", "месяца", "месяцев"),
    y: "год",
    yy: (n: number) => pluralRu(n, "год", "года", "лет"),
  },
  calendar: {
    sameDay: "[Сегодня в] LT",
    nextDay: "[Завтра в] LT",
    nextWeek: "dddd [в] LT",
    lastDay: "[Вчера в] LT",
    lastWeek: "[В прошлый] dddd [в] LT",
    sameElse: "L",
  },
};
