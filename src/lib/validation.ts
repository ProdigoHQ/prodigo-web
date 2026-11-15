import type { z } from "zod";

/**
 * Flattens a Zod error into the first message per field, ready to spread into a
 * form's error state.
 */
export function toFieldErrors(error: z.ZodError): Record<string, string> {
  const result: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "");
    if (key && !(key in result)) result[key] = issue.message;
  }
  return result;
}
