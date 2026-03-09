export function getTimezoneOffset(
  timezone: string,
  date: Date = new Date()
): number {
  // Use tzOffsetMs (Intl.DateTimeFormat-based) for DST-safe offset resolution.
  return tzOffsetMs(date, timezone) / 60000;
}

/**
 * Returns the wall-clock offset (in ms) for a given IANA timezone at a
 * specific UTC instant.  Uses Intl.DateTimeFormat.formatToParts which is
 * reliable across DST boundaries, unlike toLocaleString().
 *
 * Exported so consumers (e.g. DateKit) can reuse the same DST-safe logic.
 */
export function tzOffsetMs(d: Date, tz: string): number {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const parts = fmt.formatToParts(d);
  const get = (type: string) =>
    parseInt(parts.find((p) => p.type === type)?.value ?? "0");
  let h = get("hour");
  if (h === 24) h = 0; // some locales report midnight as 24
  const localMs = Date.UTC(
    get("year"),
    get("month") - 1,
    get("day"),
    h,
    get("minute"),
    get("second")
  );
  // offset = local_as_if_utc − actual_utc  (positive = east of UTC)
  // Subtract only the whole-second part of d to avoid sub-second drift
  // (Intl.DateTimeFormat has no ms precision).
  return localMs - (d.getTime() - d.getUTCMilliseconds());
}

/**
 * Converts a Date from one IANA timezone to another.
 *
 * The input `date` is treated as a wall-clock time in `fromTz`.
 * The function finds the true UTC instant for that local time, then
 * returns a new Date whose UTC components equal the wall-clock time
 * in `toTz` — safe to use directly with DateKit's UTC-based getters.
 *
 * Uses Intl.DateTimeFormat for offset resolution, which is correct
 * across DST boundaries (unlike the toLocaleString approach).
 */
export function convertTimezone(
  date: Date,
  fromTz: string,
  toTz: string
): Date {
  // Step 1: find the UTC instant corresponding to the wall-clock time in fromTz.
  // Iterative solve: t_utc ≈ date.getTime() − tzOffsetMs(t_utc, fromTz)
  let utcMs = date.getTime() - tzOffsetMs(date, fromTz);
  // One refinement step handles the DST ambiguity window correctly.
  utcMs = date.getTime() - tzOffsetMs(new Date(utcMs), fromTz);
  const utcInstant = new Date(utcMs);

  // Step 2: return a Date whose UTC components equal the wall-clock time in toTz.
  const toOffsetMs = tzOffsetMs(utcInstant, toTz);
  return new Date(utcMs + toOffsetMs);
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
