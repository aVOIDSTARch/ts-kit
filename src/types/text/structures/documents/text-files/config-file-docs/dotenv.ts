/**
 * dotenv (.env) — structural document model (types only)
 * Created: 2026-06-15  |  Schema version: 1.0.0
 *
 * A round-trippable representation of a .env file: ordered lines preserving
 * comments, blank lines, `export` prefixes, quote styles and inline comments.
 * No functions.
 */

import type { SchemaVersion } from "../../../../versioning.js";

export interface DotenvDocument {
  meta: DotenvMeta;
  lines: DotenvLine[]; // ordered; preserves blanks & comments
}

export interface DotenvMeta extends SchemaVersion {
  lineEnding?: "\n" | "\r\n";
  trailingNewline?: boolean;
}

export type DotenvLine = DotenvEntry | DotenvComment | DotenvBlank;

export interface DotenvEntry {
  type: "entry";
  /** A leading `export ` keyword (dotenv-expand / shell compatibility). */
  exported?: boolean;
  key: string;
  value: string; // decoded value (after unquoting/expansion-as-written)
  quote?: "none" | "single" | "double" | "backtick";
  /** Comment trailing the entry on the same line (after the value). */
  inlineComment?: string;
  raw?: string;
}
export interface DotenvComment {
  type: "comment";
  value: string; // text after the leading '#'
}
export interface DotenvBlank {
  type: "blank";
}
