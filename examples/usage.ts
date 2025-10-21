import { DateKit, Duration, registerLocale } from "../src";

// Basic usage
const now = DateKit.now();
console.log(now.format("YYYY-MM-DD HH:mm:ss"));

// Relative time
console.log(now.fromNow()); // "a few seconds ago"
console.log(now.add(2, "hour").fromNow()); // "in 2 hours"

// Calendar time
console.log(now.calendar()); // "Today at 14:30"
console.log(now.add(1, "day").calendar()); // "Tomorrow at 14:30"

// Locale support
const spanish = now.locale("es");
console.log(spanish.format("dddd, D [de] MMMM [de] YYYY")); // "Lunes, 15 de Enero de 2024"
console.log(spanish.fromNow()); // "hace unos segundos"

// Query methods
console.log(now.isToday()); // true
console.log(now.isWeekend()); // false
console.log(now.isBusinessDay()); // true

// Week and quarter
console.log(now.week()); // 3
console.log(now.quarter()); // 1
console.log(now.isoWeek()); // 3

// Business days
const nextBusinessDay = now.addBusinessDays(5);
console.log(nextBusinessDay.format("YYYY-MM-DD"));

// Durations
const duration = Duration.between(
  new Date("2024-01-01"),
  new Date("2024-01-15")
);
console.log(duration.humanize()); // "14 days"
console.log(duration.asDays()); // 14

// Custom duration
const customDuration = DateKit.duration({ hours: 2, minutes: 30 });
console.log(customDuration.humanize()); // "3 hours"

// Range operations
const days = DateKit.eachDayOfInterval({
  start: "2024-01-01",
  end: "2024-01-07",
});
console.log(days.length); // 7
days.forEach((day) => console.log(day.format("YYYY-MM-DD")));

// Chaining
const result = DateKit.now()
  .startOf("month")
  .add(1, "week")
  .endOf("week")
  .format("YYYY-MM-DD");
console.log(result);

// Set methods
const date = DateKit.now().set({ year: 2025, month: 11, date: 25 });
console.log(date.format("YYYY-MM-DD")); // "2025-12-25"

// Age calculation
const birthDate = new DateKit("1990-05-15");
console.log(birthDate.age()); // Accurate age

// Advanced formatting
console.log(now.format("dddd, MMMM Do YYYY, h:mm:ss a")); // "Monday, January 15th 2024, 2:30:45 pm"
console.log(now.format("Q [Q] YYYY")); // "1 Q 2024"
console.log(now.format("[Today is] dddd")); // "Today is Monday"
