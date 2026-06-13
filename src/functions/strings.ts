// "strings" category — small and flat, so it stays a single FILE (no folder needed).

/** Ensure a string ends with exactly one trailing newline. */
export function ensureTrailingNewline(s: string): string {
  return s.endsWith("\n") ? s : s + "\n";
}
