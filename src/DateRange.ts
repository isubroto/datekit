import { DateInput, TimeUnit } from "./types";
import { DateKit } from "./DateKit";
import { Duration } from "./Duration";
import { parseDate } from "./utils/parse";

/**
 * Represents an inclusive date range [start, end].
 *
 * @example
 * const range = new DateRange("2025-01-01", "2025-12-31");
 * range.contains("2025-06-15");  // true
 * range.duration().asDays();     // 364
 */
export class DateRange {
  readonly start: DateKit;
  readonly end: DateKit;

  constructor(start: DateInput, end: DateInput) {
    this.start = new DateKit(start);
    this.end = new DateKit(end);

    if (this.start.valueOf() > this.end.valueOf()) {
      throw new RangeError(
        `DateRange: start must not be after end. ` +
          `start=${this.start.toISOString()}, end=${this.end.toISOString()}`
      );
    }
  }

  // ─── Predicates ─────────────────────────────────────────────────────────────

  /** Returns true if the given date falls within [start, end] (inclusive). */
  contains(date: DateInput): boolean {
    const t = parseDate(date).getTime();
    return t >= this.start.valueOf() && t <= this.end.valueOf();
  }

  /**
   * Returns true if this range overlaps with another.
   * Two ranges overlap unless one ends before the other starts.
   */
  overlaps(other: DateRange): boolean {
    return (
      this.start.valueOf() <= other.end.valueOf() &&
      this.end.valueOf() >= other.start.valueOf()
    );
  }

  // ─── Set operations ──────────────────────────────────────────────────────────

  /**
   * Returns the overlapping range, or null if there is none.
   */
  intersection(other: DateRange): DateRange | null {
    const s = Math.max(this.start.valueOf(), other.start.valueOf());
    const e = Math.min(this.end.valueOf(), other.end.valueOf());
    if (s > e) return null;
    return new DateRange(s, e);
  }

  /**
   * Returns the smallest range that covers both this range and other.
   */
  union(other: DateRange): DateRange {
    const s = Math.min(this.start.valueOf(), other.start.valueOf());
    const e = Math.max(this.end.valueOf(), other.end.valueOf());
    return new DateRange(s, e);
  }

  // ─── Metrics ─────────────────────────────────────────────────────────────────

  /** Duration of the range. */
  duration(): Duration {
    return Duration.between(this.start.toDate(), this.end.toDate());
  }

  /**
   * Returns every DateKit in the range at the given step size.
   * Defaults to 1 day.
   *
   * @example
   * range.toArray("month")  // first day of each month in range
   */
  toArray(unit: TimeUnit = "day"): DateKit[] {
    const result: DateKit[] = [];
    let current = this.start.startOf(unit);

    while (current.valueOf() <= this.end.valueOf()) {
      result.push(current.clone());
      current = current.add(1, unit);
    }

    return result;
  }

  // ─── Formatting ──────────────────────────────────────────────────────────────

  /** Number of whole days in the range. */
  days(): number {
    return Math.floor(this.duration().asDays());
  }

  toString(): string {
    return `[${this.start.toISOString()} / ${this.end.toISOString()}]`;
  }

  toJSON(): { start: string; end: string } {
    return { start: this.start.toISOString(), end: this.end.toISOString() };
  }
}
