import { DateInput } from "../types";

export function parseDate(input: DateInput): Date {
  if (input instanceof Date) {
    return new Date(input);
  }

  if (typeof input === "number") {
    return new Date(input);
  }

  if (typeof input === "string") {
    return new Date(input);
  }

  throw new Error("Invalid date input");
}
