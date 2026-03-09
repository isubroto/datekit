import { DurationObject } from "./types";
import { formatRelativeTime } from "./utils/relative";

// Shared integer constants — exact values, no floating-point drift.
// 365.25 days/year × 86 400 000 ms/day  = 31 557 600 000 (exact integer)
// 365.25 / 12 days/month × 86 400 000 ms/day = 2 629 800 000 (exact integer)
const AVG_MS_PER_YEAR = 31_557_600_000;
const AVG_MS_PER_MONTH = 2_629_800_000;

export class Duration {
  private _milliseconds: number;

  constructor(value: number | DurationObject, unit: string = "milliseconds") {
    if (typeof value === "number") {
      this._milliseconds = this.convertToMilliseconds(value, unit);
    } else {
      this._milliseconds = this.objectToMilliseconds(value);
    }
  }

  private convertToMilliseconds(value: number, unit: string): number {
    const conversions: Record<string, number> = {
      milliseconds: 1,
      seconds: 1000,
      minutes: 60000,
      hours: 3600000,
      days: 86400000,
      weeks: 604800000,
    };
    return value * (conversions[unit] || 1);
  }

  private objectToMilliseconds(obj: DurationObject): number {
    let ms = 0;
    if (obj.years) ms += obj.years * AVG_MS_PER_YEAR;
    if (obj.months) ms += obj.months * AVG_MS_PER_MONTH;
    if (obj.weeks) ms += obj.weeks * 604800000;
    if (obj.days) ms += obj.days * 86400000;
    if (obj.hours) ms += obj.hours * 3600000;
    if (obj.minutes) ms += obj.minutes * 60000;
    if (obj.seconds) ms += obj.seconds * 1000;
    if (obj.milliseconds) ms += obj.milliseconds;
    return ms;
  }

  asMilliseconds(): number {
    return this._milliseconds;
  }

  asSeconds(): number {
    return this._milliseconds / 1000;
  }

  asMinutes(): number {
    return this._milliseconds / 60000;
  }

  asHours(): number {
    return this._milliseconds / 3600000;
  }

  asDays(): number {
    return this._milliseconds / 86400000;
  }

  asWeeks(): number {
    return this._milliseconds / 604800000;
  }

  asMonths(): number {
    return this._milliseconds / AVG_MS_PER_MONTH;
  }

  asYears(): number {
    return this._milliseconds / AVG_MS_PER_YEAR;
  }

  /**
   * Returns a human-readable representation of this duration in the given locale.
   * Delegates to the same locale-aware formatRelativeTime() used by fromNow()/toNow(),
   * so all registered locales work automatically.
   * Pass withoutSuffix=true to get "5 minutes" instead of "in 5 minutes" / "5 minutes ago".
   */
  humanize(locale: string = "en", withoutSuffix: boolean = true): string {
    return formatRelativeTime(this._milliseconds, locale, withoutSuffix);
  }

  toObject(): DurationObject {
    // Use integer constants throughout so each subtraction is exact
    // and no floating-point drift accumulates across the decomposition.
    let remaining = Math.abs(this._milliseconds);

    const years = Math.floor(remaining / AVG_MS_PER_YEAR);
    remaining -= years * AVG_MS_PER_YEAR;

    const months = Math.floor(remaining / AVG_MS_PER_MONTH);
    remaining -= months * AVG_MS_PER_MONTH;

    const days = Math.floor(remaining / 86400000);
    remaining -= days * 86400000;

    const hours = Math.floor(remaining / 3600000);
    remaining -= hours * 3600000;

    const minutes = Math.floor(remaining / 60000);
    remaining -= minutes * 60000;

    const seconds = Math.floor(remaining / 1000);
    remaining -= seconds * 1000;

    const milliseconds = Math.floor(remaining);

    return { years, months, days, hours, minutes, seconds, milliseconds };
  }

  add(duration: Duration): Duration {
    return new Duration(this._milliseconds + duration.asMilliseconds());
  }

  subtract(duration: Duration): Duration {
    return new Duration(this._milliseconds - duration.asMilliseconds());
  }

  static between(date1: Date, date2: Date): Duration {
    return new Duration(Math.abs(date2.getTime() - date1.getTime()));
  }
}
