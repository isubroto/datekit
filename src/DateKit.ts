import {
  DateInput,
  TimeUnit,
  DateKitConfig,
  SetDateValues,
  DateInterval,
  DurationObject,
  QuarterNumber,
} from "./types";
import { formatDate } from "./utils/format";
import { parseDate } from "./utils/parse";
import { isValidDate } from "./utils/validators";
import { formatRelativeTime } from "./utils/relative";
import { formatCalendar } from "./utils/calendar";
import {
  isBusinessDay,
  addBusinessDays as addBizDays,
  businessDaysBetween,
} from "./utils/businessDays";
import { Duration } from "./Duration";
import { getLocale } from "./locales";

export class DateKit {
  private date: Date;
  private config: DateKitConfig;

  constructor(date?: DateInput, config?: DateKitConfig) {
    this.config = {
      locale: "en",
      weekStartsOn: 0,
      strictParsing: false,
      ...config,
    };

    this.date = date ? parseDate(date) : new Date();

    if (!isValidDate(this.date)) {
      throw new Error("Invalid date provided");
    }
  }

  // ============================================
  // GETTERS & CONVERTERS
  // ============================================

  toDate(): Date {
    return new Date(this.date);
  }

  toISOString(): string {
    return this.date.toISOString();
  }

  toUnix(): number {
    return Math.floor(this.date.getTime() / 1000);
  }

  valueOf(): number {
    return this.date.getTime();
  }

  toArray(): number[] {
    return [
      this.date.getUTCFullYear(),
      this.date.getUTCMonth(),
      this.date.getUTCDate(),
      this.date.getUTCHours(),
      this.date.getUTCMinutes(),
      this.date.getUTCSeconds(),
      this.date.getUTCMilliseconds(),
    ];
  }

  toObject(): {
    year: number;
    month: number;
    date: number;
    hour: number;
    minute: number;
    second: number;
    millisecond: number;
  } {
    return {
      year: this.date.getUTCFullYear(),
      month: this.date.getUTCMonth(),
      date: this.date.getUTCDate(),
      hour: this.date.getUTCHours(),
      minute: this.date.getUTCMinutes(),
      second: this.date.getUTCSeconds(),
      millisecond: this.date.getUTCMilliseconds(),
    };
  }

  toJSON(): string {
    return this.toISOString();
  }

  toString(): string {
    return this.date.toString();
  }

  // ============================================
  // FORMATTING
  // ============================================

  format(formatStr: string): string {
    return formatDate(this.date, formatStr, this.config.locale);
  }

  /**
   * Parses a timezone-aware date string and formats it in the original timezone
   * without applying timezone conversion. This ensures the local date components
   * remain unchanged regardless of the timezone offset.
   *
   * @param dateString - The timezone-aware date string (e.g., "Sun Aug 31 2025 00:00:00 GMT+0600 (Bangladesh Standard Time)")
   * @param formatStr - The format string for the output (e.g., "DD-MM-YYYY")
   * @returns The formatted date string preserving the original timezone's date
   *
   * @example
   * DateKit.formatFromTimezoneString("Sun Aug 31 2025 00:00:00 GMT+0600 (Bangladesh Standard Time)", "DD-MM-YYYY")
   * // Returns: "31-08-2025"
   */
  static formatFromTimezoneString(
    dateString: string,
    formatStr: string
  ): string {
    // Parse the date string - JavaScript Date constructor handles various timezone formats
    const parsedDate = new Date(dateString);

    if (isNaN(parsedDate.getTime())) {
      throw new Error("Invalid date string provided");
    }

    // Extract timezone offset from the original string
    // Common formats: GMT+0600, GMT-0500, UTC+05:30, etc.
    const timezoneMatch = dateString.match(
      /GMT([+-]\d{2}):?(\d{2})|UTC([+-]\d{2}):?(\d{2})/i
    );

    let offsetMinutes = 0;

    if (timezoneMatch) {
      // Extract hours and minutes from the matched groups
      const sign = (timezoneMatch[1] || timezoneMatch[3])[0];
      const hours = parseInt(
        (timezoneMatch[1] || timezoneMatch[3]).substring(1)
      );
      const minutes = parseInt(timezoneMatch[2] || timezoneMatch[4] || "0");

      offsetMinutes = (hours * 60 + minutes) * (sign === "+" ? 1 : -1);
    } else {
      // If no explicit timezone found, try to extract from the parsed date
      // by comparing with UTC
      offsetMinutes = -parsedDate.getTimezoneOffset();
    }

    // Get the UTC time
    const utcTime = parsedDate.getTime();

    // Calculate the time in the original timezone
    // We add the offset because we want to adjust from UTC to local time
    const localTime = utcTime + offsetMinutes * 60 * 1000;

    // Create a new Date object representing the local time as UTC
    // This way, when we extract components, we get the original timezone's values
    const localDate = new Date(localTime);

    // Get date components in UTC (which are actually the local timezone components)
    const year = localDate.getUTCFullYear();
    const month = localDate.getUTCMonth();
    const day = localDate.getUTCDate();
    const hours = localDate.getUTCHours();
    const minutes = localDate.getUTCMinutes();
    const seconds = localDate.getUTCSeconds();
    const milliseconds = localDate.getUTCMilliseconds();

    // Create a DateKit instance using UTC components
    const dateKit = new DateKit(
      Date.UTC(year, month, day, hours, minutes, seconds, milliseconds)
    );

    return dateKit.format(formatStr);
  }

  /**
   * Static method: Formats a timezone-aware date string with explicit GMT offset.
   * Preserves the local date components from the specified timezone.
   *
   * @param input - The timezone-aware date string with GMT offset (e.g., "Sun Aug 31 2025 00:00:00 GMT+0600")
   * @param outputFormat - The format string for the output (default: "DD-MM-YYYY")
   * @param locale - The locale for formatting (default: "en")
   * @returns The formatted date string preserving the original timezone's date
   *
   * @example
   * DateKit.formatZonedDate("Sun Aug 31 2025 00:00:00 GMT+0600 (Bangladesh Standard Time)", "DD-MM-YYYY")
   * // Returns: "31-08-2025"
   */
  static formatZonedDate(
    input: string,
    outputFormat: string = "DD-MM-YYYY",
    locale: string = "en"
  ): string {
    if (typeof input !== "string") {
      throw new Error(
        "formatZonedDate expects input as a string with explicit GMT offset"
      );
    }

    // Match "GMT+0600" or "GMT-0530" or "GMT+06:00"
    const m = input.match(/GMT([+-])(\d{2}):?(\d{2})/i);
    const parsed = new Date(input);

    if (isNaN(parsed.getTime())) {
      throw new Error("Invalid date input for formatZonedDate");
    }

    // If GMT offset present, compute minutes
    let zonedDate = parsed;
    if (m) {
      const sign = m[1] === "-" ? -1 : 1;
      const hh = parseInt(m[2], 10);
      const mm = parseInt(m[3], 10);
      const offsetMinutes = sign * (hh * 60 + mm);

      // Adjust the UTC epoch by the offset to reconstruct the "local" components
      // Example: 2025-08-30T18:00Z + 360 minutes = 2025-08-31T00:00Z
      const localMs = parsed.getTime() + offsetMinutes * 60_000;
      zonedDate = new Date(localMs);
    }

    // Use existing formatter (UTC-based), now fed with adjusted date to preserve local day
    return formatDate(zonedDate, outputFormat, locale);
  }

  /**
   * Instance method: Formats a timezone-aware date string using the instance's locale.
   * Convenience wrapper around the static formatZonedDate method.
   *
   * @param input - The timezone-aware date string with GMT offset
   * @param outputFormat - The format string for the output (default: "DD-MM-YYYY")
   * @returns The formatted date string preserving the original timezone's date
   *
   * @example
   * const dk = new DateKit('2025-01-15', { locale: 'es' });
   * dk.formatZonedDate("Sun Aug 31 2025 00:00:00 GMT+0600", "DD-MM-YYYY")
   * // Returns: "31-08-2025" (uses 'es' locale from instance)
   */
  formatZonedDate(input: string, outputFormat: string = "DD-MM-YYYY"): string {
    const locale = this.config?.locale ?? "en";
    return DateKit.formatZonedDate(input, outputFormat, locale);
  }

  /**
   * Converts a date from one IANA timezone to another and formats it.
   *
   * @param date - The input date (can be Date, string, or number)
   * @param fromTimezone - The source IANA timezone (e.g., "America/New_York", "Asia/Dhaka")
   * @param toTimezone - The target IANA timezone (e.g., "Europe/London", "UTC")
   * @param formatStr - The format string for the output
   * @returns The formatted date string in the target timezone
   *
   * @example
   * DateKit.convertTimezone("2025-08-31 14:30:00", "Asia/Dhaka", "America/New_York", "DD-MM-YYYY HH:mm")
   * // Returns: "31-08-2025 04:30" (converts from Bangladesh time to Eastern time)
   */
  static convertTimezone(
    date: DateInput,
    fromTimezone: string,
    toTimezone: string,
    formatStr: string
  ): string {
    const parsedDate = parseDate(date);

    if (!isValidDate(parsedDate)) {
      throw new Error("Invalid date provided");
    }

    // Interpret the input date as being in the fromTimezone
    // First, parse the date components
    let year: number,
      month: number,
      day: number,
      hour: number,
      minute: number,
      second: number;

    if (
      typeof date === "string" &&
      !date.includes("Z") &&
      !date.includes("+") &&
      !date.includes("GMT")
    ) {
      // If it's a string without timezone info, parse it directly
      const parts = date.match(
        /(\d{4})-(\d{2})-(\d{2})[T\s](\d{2}):(\d{2}):(\d{2})/
      );
      if (parts) {
        year = parseInt(parts[1]);
        month = parseInt(parts[2]);
        day = parseInt(parts[3]);
        hour = parseInt(parts[4]);
        minute = parseInt(parts[5]);
        second = parseInt(parts[6]);
      } else {
        // Fallback to parsing as UTC
        year = parsedDate.getUTCFullYear();
        month = parsedDate.getUTCMonth() + 1;
        day = parsedDate.getUTCDate();
        hour = parsedDate.getUTCHours();
        minute = parsedDate.getUTCMinutes();
        second = parsedDate.getUTCSeconds();
      }

      // Create a date representing this moment in the fromTimezone
      const localDateString = `${year}-${month
        .toString()
        .padStart(2, "0")}-${day.toString().padStart(2, "0")}T${hour
        .toString()
        .padStart(2, "0")}:${minute.toString().padStart(2, "0")}:${second
        .toString()
        .padStart(2, "0")}`;

      // Get UTC timestamp for this local time in fromTimezone
      const utcDate = new Date(
        Date.UTC(year, month - 1, day, hour, minute, second)
      );
      const fromTzDate = new Date(
        utcDate.toLocaleString("en-US", { timeZone: fromTimezone })
      );
      const utcCheck = new Date(
        utcDate.toLocaleString("en-US", { timeZone: "UTC" })
      );
      const offset = fromTzDate.getTime() - utcCheck.getTime();
      const actualUtcTime = utcDate.getTime() - offset;

      // Now convert this UTC time to the target timezone
      const targetDate = new Date(actualUtcTime);
      return DateKit.formatInTimezone(targetDate, toTimezone, formatStr);
    } else {
      // If date has timezone info or is a Date object, just format it in target timezone
      return DateKit.formatInTimezone(parsedDate, toTimezone, formatStr);
    }
  }
  /**
   * Formats a date in a specific IANA timezone without conversion.
   * Useful when you have a UTC date and want to display it in a specific timezone.
   *
   * @param date - The input date (can be Date, string, or number)
   * @param timezone - The IANA timezone (e.g., "Asia/Dhaka", "America/Los_Angeles")
   * @param formatStr - The format string for the output
   * @returns The formatted date string in the specified timezone
   *
   * @example
   * DateKit.formatInTimezone(new Date("2025-08-31T00:00:00Z"), "Asia/Dhaka", "DD-MM-YYYY HH:mm")
   * // Returns: "31-08-2025 06:00" (UTC midnight becomes 6 AM in Dhaka, which is GMT+6)
   */
  static formatInTimezone(
    date: DateInput,
    timezone: string,
    formatStr: string
  ): string {
    const parsedDate = parseDate(date);

    if (!isValidDate(parsedDate)) {
      throw new Error("Invalid date provided");
    }

    // Format the date in the specified timezone
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    const parts = formatter.formatToParts(parsedDate);
    const dateParts: any = {};
    parts.forEach((part) => {
      if (part.type !== "literal") {
        dateParts[part.type] = part.value;
      }
    });

    // Create DateKit instance with the timezone-adjusted date
    const dateKit = new DateKit(
      Date.UTC(
        parseInt(dateParts.year),
        parseInt(dateParts.month) - 1,
        parseInt(dateParts.day),
        parseInt(dateParts.hour),
        parseInt(dateParts.minute),
        parseInt(dateParts.second)
      )
    );

    return dateKit.format(formatStr);
  }

  /**
   * Creates a DateKit instance from date components in a specific IANA timezone.
   *
   * @param year - The year
   * @param month - The month (1-12)
   * @param day - The day of the month
   * @param hour - The hour (0-23)
   * @param minute - The minute (0-59)
   * @param second - The second (0-59)
   * @param timezone - The IANA timezone (e.g., "Asia/Dhaka")
   * @returns A new DateKit instance representing that moment in UTC
   *
   * @example
   * const dk = DateKit.fromTimezone(2025, 8, 31, 14, 30, 0, "Asia/Dhaka");
   * console.log(dk.toISOString()); // Shows the UTC equivalent of 2025-08-31 14:30 Dhaka time
   */
  static fromTimezone(
    year: number,
    month: number,
    day: number,
    hour: number = 0,
    minute: number = 0,
    second: number = 0,
    timezone: string = "UTC"
  ): DateKit {
    // Create a date string in the specified timezone
    const dateString = `${year}-${month.toString().padStart(2, "0")}-${day
      .toString()
      .padStart(2, "0")}T${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}:${second.toString().padStart(2, "0")}`;

    // Parse it as if it's in the specified timezone
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    // Create a temporary date to get the offset
    const tempDate = new Date(dateString);

    // Get UTC representation
    const utcDate = new Date(
      Date.UTC(year, month - 1, day, hour, minute, second)
    );

    // Get the offset for this timezone at this date
    const tzDate = new Date(
      utcDate.toLocaleString("en-US", { timeZone: timezone })
    );
    const utcDateCheck = new Date(
      utcDate.toLocaleString("en-US", { timeZone: "UTC" })
    );

    const offset = tzDate.getTime() - utcDateCheck.getTime();

    // Adjust the UTC date by the offset to get the actual UTC time
    const actualUtcTime = utcDate.getTime() - offset;

    return new DateKit(actualUtcTime);
  }

  /**
   * Gets the timezone offset in minutes for a specific IANA timezone at a given date.
   *
   * @param timezone - The IANA timezone (e.g., "Asia/Dhaka")
   * @param date - The date to check (defaults to current date)
   * @returns The offset in minutes (positive for east of UTC, negative for west)
   *
   * @example
   * DateKit.getTimezoneOffset("Asia/Dhaka"); // Returns 360 (GMT+6)
   * DateKit.getTimezoneOffset("America/New_York"); // Returns -300 or -240 depending on DST
   */
  static getTimezoneOffset(timezone: string, date: Date = new Date()): number {
    const utcDate = new Date(date.toLocaleString("en-US", { timeZone: "UTC" }));
    const tzDate = new Date(
      date.toLocaleString("en-US", { timeZone: timezone })
    );
    return (tzDate.getTime() - utcDate.getTime()) / 60000; // in minutes
  }

  // ============================================
  // GETTERS (individual units)
  // ============================================

  year(): number {
    return this.date.getUTCFullYear();
  }

  month(): number {
    return this.date.getUTCMonth();
  }

  getDate(): number {
    return this.date.getUTCDate();
  }

  day(): number {
    return this.date.getUTCDay();
  }

  hour(): number {
    return this.date.getUTCHours();
  }

  minute(): number {
    return this.date.getUTCMinutes();
  }

  second(): number {
    return this.date.getUTCSeconds();
  }

  millisecond(): number {
    return this.date.getUTCMilliseconds();
  }

  quarter(): QuarterNumber {
    return (Math.floor(this.date.getUTCMonth() / 3) + 1) as QuarterNumber;
  }

  week(): number {
    return this.isoWeek();
  }

  isoWeek(): number {
    const target = new Date(this.date.getTime());
    target.setUTCHours(0, 0, 0, 0);
    target.setUTCDate(target.getUTCDate() + 4 - (target.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
    return Math.ceil(
      ((target.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
    );
  }

  weekday(): number {
    return (this.date.getUTCDay() + 7 - this.config.weekStartsOn!) % 7;
  }

  isoWeekday(): number {
    return this.date.getUTCDay() || 7;
  }

  dayOfYear(): number {
    const startOfYear = new Date(Date.UTC(this.date.getUTCFullYear(), 0, 1));
    return (
      Math.floor((this.date.getTime() - startOfYear.getTime()) / 86400000) + 1
    );
  }

  weekYear(): number {
    const target = new Date(this.date.getTime());
    target.setUTCDate(target.getUTCDate() + 4 - (target.getUTCDay() || 7));
    return target.getUTCFullYear();
  }

  // ============================================
  // SETTERS
  // ============================================

  set(values: SetDateValues): DateKit {
    const newDate = new Date(this.date);

    if (values.year !== undefined) newDate.setUTCFullYear(values.year);
    if (values.month !== undefined) newDate.setUTCMonth(values.month);
    if (values.date !== undefined) newDate.setUTCDate(values.date);
    if (values.hour !== undefined) newDate.setUTCHours(values.hour);
    if (values.minute !== undefined) newDate.setUTCMinutes(values.minute);
    if (values.second !== undefined) newDate.setUTCSeconds(values.second);
    if (values.millisecond !== undefined)
      newDate.setUTCMilliseconds(values.millisecond);

    return new DateKit(newDate, this.config);
  }

  setYear(year: number): DateKit {
    return this.set({ year });
  }

  setMonth(month: number): DateKit {
    return this.set({ month });
  }

  setDate(date: number): DateKit {
    return this.set({ date });
  }

  setHour(hour: number): DateKit {
    return this.set({ hour });
  }

  setMinute(minute: number): DateKit {
    return this.set({ minute });
  }

  setSecond(second: number): DateKit {
    return this.set({ second });
  }

  setMillisecond(millisecond: number): DateKit {
    return this.set({ millisecond });
  }

  setQuarter(quarter: QuarterNumber): DateKit {
    const month = (quarter - 1) * 3;
    return this.set({ month });
  }

  // ============================================
  // MANIPULATION
  // ============================================

  add(value: number, unit: TimeUnit): DateKit {
    const newDate = new Date(this.date);

    switch (unit) {
      case "millisecond":
        newDate.setUTCMilliseconds(newDate.getUTCMilliseconds() + value);
        break;
      case "second":
        newDate.setUTCSeconds(newDate.getUTCSeconds() + value);
        break;
      case "minute":
        newDate.setUTCMinutes(newDate.getUTCMinutes() + value);
        break;
      case "hour":
        newDate.setUTCHours(newDate.getUTCHours() + value);
        break;
      case "day":
        newDate.setUTCDate(newDate.getUTCDate() + value);
        break;
      case "week":
        newDate.setUTCDate(newDate.getUTCDate() + value * 7);
        break;
      case "month":
        newDate.setUTCMonth(newDate.getUTCMonth() + value);
        break;
      case "quarter":
        newDate.setUTCMonth(newDate.getUTCMonth() + value * 3);
        break;
      case "year":
        newDate.setUTCFullYear(newDate.getUTCFullYear() + value);
        break;
    }

    return new DateKit(newDate, this.config);
  }

  subtract(value: number, unit: TimeUnit): DateKit {
    return this.add(-value, unit);
  }

  // ============================================
  // START/END OF UNITS
  // ============================================

  startOf(unit: TimeUnit): DateKit {
    const newDate = new Date(this.date);

    switch (unit) {
      case "year":
        newDate.setUTCMonth(0);
      case "quarter":
        if (unit === "quarter") {
          const currentQuarter = this.quarter();
          newDate.setUTCMonth((currentQuarter - 1) * 3);
        }
      case "month":
        newDate.setUTCDate(1);
      case "day":
        newDate.setUTCHours(0);
      case "hour":
        newDate.setUTCMinutes(0);
      case "minute":
        newDate.setUTCSeconds(0);
      case "second":
        newDate.setUTCMilliseconds(0);
        break;
      case "week":
        const day = newDate.getUTCDay();
        const diff =
          (day < this.config.weekStartsOn! ? 7 : 0) +
          day -
          this.config.weekStartsOn!;
        newDate.setUTCDate(newDate.getUTCDate() - diff);
        newDate.setUTCHours(0, 0, 0, 0);
        break;
    }

    return new DateKit(newDate, this.config);
  }

  endOf(unit: TimeUnit): DateKit {
    return this.startOf(unit).add(1, unit).subtract(1, "millisecond");
  }

  // ============================================
  // COMPARISON
  // ============================================

  isBefore(date: DateInput, unit?: TimeUnit): boolean {
    if (unit) {
      return (
        this.startOf(unit).valueOf() < new DateKit(date).startOf(unit).valueOf()
      );
    }
    return this.date.getTime() < parseDate(date).getTime();
  }

  isAfter(date: DateInput, unit?: TimeUnit): boolean {
    if (unit) {
      return (
        this.startOf(unit).valueOf() > new DateKit(date).startOf(unit).valueOf()
      );
    }
    return this.date.getTime() > parseDate(date).getTime();
  }

  isSame(date: DateInput, unit?: TimeUnit): boolean {
    if (!unit) {
      return this.date.getTime() === parseDate(date).getTime();
    }

    const thisStart = this.startOf(unit);
    const otherStart = new DateKit(date, this.config).startOf(unit);
    return thisStart.date.getTime() === otherStart.date.getTime();
  }

  isSameOrBefore(date: DateInput, unit?: TimeUnit): boolean {
    return this.isSame(date, unit) || this.isBefore(date, unit);
  }

  isSameOrAfter(date: DateInput, unit?: TimeUnit): boolean {
    return this.isSame(date, unit) || this.isAfter(date, unit);
  }

  isBetween(
    start: DateInput,
    end: DateInput,
    unit?: TimeUnit,
    inclusivity: "()" | "[]" | "[)" | "(]" = "()"
  ): boolean {
    const startTime = unit
      ? new DateKit(start).startOf(unit).valueOf()
      : parseDate(start).getTime();
    const endTime = unit
      ? new DateKit(end).startOf(unit).valueOf()
      : parseDate(end).getTime();
    const thisTime = unit ? this.startOf(unit).valueOf() : this.date.getTime();

    const afterStart =
      inclusivity[0] === "[" ? thisTime >= startTime : thisTime > startTime;

    const beforeEnd =
      inclusivity[1] === "]" ? thisTime <= endTime : thisTime < endTime;

    return afterStart && beforeEnd;
  }

  // ============================================
  // QUERY METHODS
  // ============================================

  isToday(): boolean {
    return this.isSame(new Date(), "day");
  }

  isTomorrow(): boolean {
    const tomorrow = new DateKit().add(1, "day");
    return this.isSame(tomorrow.toDate(), "day");
  }

  isYesterday(): boolean {
    const yesterday = new DateKit().subtract(1, "day");
    return this.isSame(yesterday.toDate(), "day");
  }

  isThisWeek(): boolean {
    return this.isSame(new Date(), "week");
  }

  isThisMonth(): boolean {
    return this.isSame(new Date(), "month");
  }

  isThisQuarter(): boolean {
    return this.isSame(new Date(), "quarter");
  }

  isThisYear(): boolean {
    return this.isSame(new Date(), "year");
  }

  isWeekend(): boolean {
    const day = this.date.getUTCDay();
    return day === 0 || day === 6;
  }

  isWeekday(): boolean {
    return !this.isWeekend();
  }

  isLeapYear(): boolean {
    const year = this.date.getUTCFullYear();
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }

  isDST(): boolean {
    const jan = new Date(this.year(), 0, 1);
    const jul = new Date(this.year(), 6, 1);
    const stdOffset = Math.max(
      jan.getTimezoneOffset(),
      jul.getTimezoneOffset()
    );
    return this.date.getTimezoneOffset() < stdOffset;
  }

  // ============================================
  // DIFFERENCE
  // ============================================

  diff(
    date: DateInput,
    unit: TimeUnit = "millisecond",
    precise: boolean = false
  ): number {
    const otherDate = parseDate(date);
    const diff = this.date.getTime() - otherDate.getTime();

    let divisor = 1;

    switch (unit) {
      case "millisecond":
        return diff;
      case "second":
        divisor = 1000;
        break;
      case "minute":
        divisor = 1000 * 60;
        break;
      case "hour":
        divisor = 1000 * 60 * 60;
        break;
      case "day":
        divisor = 1000 * 60 * 60 * 24;
        break;
      case "week":
        divisor = 1000 * 60 * 60 * 24 * 7;
        break;
      case "month":
        return precise
          ? diff / (1000 * 60 * 60 * 24 * 30.436875)
          : this.diffMonth(otherDate);
      case "quarter":
        return precise
          ? diff / (1000 * 60 * 60 * 24 * 91.3125)
          : Math.floor(this.diffMonth(otherDate) / 3);
      case "year":
        return precise
          ? diff / (1000 * 60 * 60 * 24 * 365.25)
          : this.diffYear(otherDate);
    }

    const result = diff / divisor;
    return precise ? result : Math.floor(result);
  }

  private diffMonth(otherDate: Date): number {
    const yearDiff = this.date.getUTCFullYear() - otherDate.getUTCFullYear();
    const monthDiff = this.date.getUTCMonth() - otherDate.getUTCMonth();
    return yearDiff * 12 + monthDiff;
  }

  private diffYear(otherDate: Date): number {
    return this.date.getUTCFullYear() - otherDate.getUTCFullYear();
  }

  // ============================================
  // RELATIVE TIME
  // ============================================

  fromNow(withoutSuffix: boolean = false): string {
    const diff = Date.now() - this.date.getTime();
    return formatRelativeTime(diff, this.config.locale, withoutSuffix);
  }

  toNow(withoutSuffix: boolean = false): string {
    const diff = this.date.getTime() - Date.now();
    return formatRelativeTime(diff, this.config.locale, withoutSuffix);
  }

  from(date: DateInput, withoutSuffix: boolean = false): string {
    const diff = parseDate(date).getTime() - this.date.getTime();
    return formatRelativeTime(diff, this.config.locale, withoutSuffix);
  }

  to(date: DateInput, withoutSuffix: boolean = false): string {
    const diff = this.date.getTime() - parseDate(date).getTime();
    return formatRelativeTime(diff, this.config.locale, withoutSuffix);
  }

  // ============================================
  // CALENDAR TIME
  // ============================================

  calendar(referenceDate?: DateInput): string {
    const ref = referenceDate ? parseDate(referenceDate) : new Date();
    return formatCalendar(this.date, ref, this.config.locale);
  }

  // ============================================
  // DURATION
  // ============================================

  duration(date?: DateInput): Duration {
    if (date) {
      return Duration.between(this.date, parseDate(date));
    }
    return new Duration(this.date.getTime());
  }

  // ============================================
  // UTILITIES
  // ============================================

  daysInMonth(): number {
    return new Date(
      Date.UTC(this.date.getUTCFullYear(), this.date.getUTCMonth() + 1, 0)
    ).getUTCDate();
  }

  weeksInYear(): number {
    const lastDayOfYear = new Date(Date.UTC(this.year(), 11, 31));
    const lastWeek = new DateKit(lastDayOfYear);
    const week = lastWeek.isoWeek();

    // If week is 1, the year has 52 weeks
    return week === 1 ? 52 : week;
  }

  age(toDate?: DateInput): number {
    const to = toDate ? parseDate(toDate) : new Date();
    const birthDate = this.date;

    let years = to.getUTCFullYear() - birthDate.getUTCFullYear();

    const birthMonth = birthDate.getUTCMonth();
    const birthDay = birthDate.getUTCDate();
    const currentMonth = to.getUTCMonth();
    const currentDay = to.getUTCDate();

    if (
      currentMonth < birthMonth ||
      (currentMonth === birthMonth && currentDay < birthDay)
    ) {
      years--;
    }

    return years;
  }

  clone(): DateKit {
    return new DateKit(this.date, this.config);
  }

  // ============================================
  // BUSINESS DAYS
  // ============================================

  isBusinessDay(holidays: Date[] = []): boolean {
    return isBusinessDay(this.date, holidays);
  }

  addBusinessDays(days: number, holidays: Date[] = []): DateKit {
    return new DateKit(addBizDays(this.date, days, holidays), this.config);
  }

  subtractBusinessDays(days: number, holidays: Date[] = []): DateKit {
    return new DateKit(addBizDays(this.date, -days, holidays), this.config);
  }

  businessDaysUntil(date: DateInput, holidays: Date[] = []): number {
    return businessDaysBetween(this.date, parseDate(date), holidays);
  }

  // ============================================
  // LOCALE
  // ============================================

  locale(name?: string): string | DateKit {
    if (name === undefined) {
      return this.config.locale!;
    }
    return new DateKit(this.date, { ...this.config, locale: name });
  }

  // ============================================
  // ARRAY/RANGE OPERATIONS
  // ============================================

  static eachDayOfInterval(interval: DateInterval): DateKit[] {
    const start = new DateKit(interval.start);
    const end = new DateKit(interval.end);
    const days: DateKit[] = [];

    let current = start.clone();
    while (current.isSameOrBefore(end.toDate(), "day")) {
      days.push(current.clone());
      current = current.add(1, "day");
    }

    return days;
  }

  static eachWeekOfInterval(interval: DateInterval): DateKit[] {
    const start = new DateKit(interval.start).startOf("week");
    const end = new DateKit(interval.end);
    const weeks: DateKit[] = [];

    let current = start.clone();
    while (current.isSameOrBefore(end.toDate(), "week")) {
      weeks.push(current.clone());
      current = current.add(1, "week");
    }

    return weeks;
  }

  static eachMonthOfInterval(interval: DateInterval): DateKit[] {
    const start = new DateKit(interval.start).startOf("month");
    const end = new DateKit(interval.end);
    const months: DateKit[] = [];

    let current = start.clone();
    while (current.isSameOrBefore(end.toDate(), "month")) {
      months.push(current.clone());
      current = current.add(1, "month");
    }

    return months;
  }

  // ============================================
  // STATIC METHODS
  // ============================================

  static now(): DateKit {
    return new DateKit();
  }

  static utc(date?: DateInput): DateKit {
    if (!date) {
      return new DateKit(new Date());
    }
    return new DateKit(date);
  }

  static unix(timestamp: number): DateKit {
    return new DateKit(timestamp * 1000);
  }

  static isValid(date: DateInput): boolean {
    try {
      return isValidDate(parseDate(date));
    } catch {
      return false;
    }
  }

  static max(...dates: DateInput[]): DateKit {
    const times = dates.map((d) => parseDate(d).getTime());
    return new DateKit(Math.max(...times));
  }

  static min(...dates: DateInput[]): DateKit {
    const times = dates.map((d) => parseDate(d).getTime());
    return new DateKit(Math.min(...times));
  }

  static isDuration(obj: any): obj is Duration {
    return obj instanceof Duration;
  }

  static duration(value: number | DurationObject, unit?: string): Duration {
    if (typeof value === "number" && unit) {
      return new Duration(value, unit);
    }
    return new Duration(value as DurationObject);
  }
}
