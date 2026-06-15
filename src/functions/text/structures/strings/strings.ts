// "strings" category — text tools for working with strings

/** Ensure a string ends with exactly one trailing newline. */
export function ensureTrailingNewline(s: string): string {
  return s.endsWith("\n") ? s : s + "\n";
}
