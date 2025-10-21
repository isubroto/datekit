import { DurationObject } from "./types";

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
    if (obj.years) ms += obj.years * 365.25 * 86400000;
    if (obj.months) ms += obj.months * 30.44 * 86400000;
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
    return this._milliseconds / (30.44 * 86400000);
  }

  asYears(): number {
    return this._milliseconds / (365.25 * 86400000);
  }

  humanize(locale: string = "en"): string {
    const seconds = Math.abs(this.asSeconds());
    const minutes = Math.abs(this.asMinutes());
    const hours = Math.abs(this.asHours());
    const days = Math.abs(this.asDays());
    const months = Math.abs(this.asMonths());
    const years = Math.abs(this.asYears());

    if (seconds < 45) return "a few seconds";
    if (seconds < 90) return "a minute";
    if (minutes < 45) return `${Math.round(minutes)} minutes`;
    if (minutes < 90) return "an hour";
    if (hours < 22) return `${Math.round(hours)} hours`;
    if (hours < 36) return "a day";
    if (days < 25) return `${Math.round(days)} days`;
    if (days < 45) return "a month";
    if (days < 345) return `${Math.round(months)} months`;
    if (years < 1.5) return "a year";
    return `${Math.round(years)} years`;
  }

  toObject(): DurationObject {
    let remaining = Math.abs(this._milliseconds);

    const years = Math.floor(remaining / (365.25 * 86400000));
    remaining -= years * 365.25 * 86400000;

    const months = Math.floor(remaining / (30.44 * 86400000));
    remaining -= months * 30.44 * 86400000;

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
