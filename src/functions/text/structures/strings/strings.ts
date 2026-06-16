// "strings" category — text tools for working with strings

/** Ensure a string ends with exactly one trailing newline. */
export function ensureTrailingNewline(s: string): string {
  return s.endsWith("\n") ? s : s + "\n";
}

// Custom String.format function
/**
const template = "Visit {0} for {1} articles.";
const website = "GeeksforGeeks";
const topic = "Programming";

const result = formatString(template, website, topic);
console.log(result);
 */
export function formatString(template: string, ...args: any[]): string {
  return template.replace(/{(\d+)}/g, (match, index) => {
    return typeof args[index] !== "undefined" ? args[index] : match;
  });
}
