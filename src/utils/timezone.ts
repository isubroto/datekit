export function getTimezoneOffset(
  timezone: string,
  date: Date = new Date()
): number {
  const utcDate = new Date(date.toLocaleString("en-US", { timeZone: "UTC" }));
  const tzDate = new Date(date.toLocaleString("en-US", { timeZone: timezone }));
  return (tzDate.getTime() - utcDate.getTime()) / 60000; // in minutes
}

export function convertTimezone(
  date: Date,
  fromTz: string,
  toTz: string
): Date {
  const utcDate = new Date(date.toLocaleString("en-US", { timeZone: fromTz }));
  const targetDate = new Date(
    utcDate.toLocaleString("en-US", { timeZone: toTz })
  );
  return targetDate;
}

export function formatTimezoneOffset(offset: number): string {
  const sign = offset >= 0 ? "+" : "-";
  const absOffset = Math.abs(offset);
  const hours = Math.floor(absOffset / 60);
  const minutes = absOffset % 60;
  return `${sign}${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
}
