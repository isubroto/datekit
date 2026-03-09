import { BUSINESS_DAYS } from "../constants";

export function isBusinessDay(date: Date, holidays: Date[] = []): boolean {
  const dayOfWeek = date.getUTCDay();

  // Check if it's a weekend
  if (!BUSINESS_DAYS.includes(dayOfWeek)) {
    return false;
  }

  // Check if it's a holiday
  const dateStr = date.toISOString().split("T")[0];
  return !holidays.some(
    (holiday) => holiday.toISOString().split("T")[0] === dateStr
  );
}

export function addBusinessDays(
  date: Date,
  days: number,
  holidays: Date[] = []
): Date {
  const result = new Date(date);
  let remainingDays = Math.abs(days);
  const direction = days > 0 ? 1 : -1;

  while (remainingDays > 0) {
    result.setUTCDate(result.getUTCDate() + direction);
    if (isBusinessDay(result, holidays)) {
      remainingDays--;
    }
  }

  return result;
}

/**
 * Returns the number of business days between two dates.
 *
 * Follows the open-start / closed-end convention (consistent with diff()):
 * the start date is excluded and the end date is included.
 * e.g. businessDaysBetween(Mon, Wed) = 2  (Tue, Wed)
 */
export function businessDaysBetween(
  startDate: Date,
  endDate: Date,
  holidays: Date[] = []
): number {
  let count = 0;
  // Clone and advance by one day to exclude the start date
  const current = new Date(startDate);
  current.setUTCDate(current.getUTCDate() + 1);
  const end = new Date(endDate);

  while (current <= end) {
    if (isBusinessDay(current, holidays)) {
      count++;
    }
    current.setUTCDate(current.getUTCDate() + 1);
  }

  return count;
}
