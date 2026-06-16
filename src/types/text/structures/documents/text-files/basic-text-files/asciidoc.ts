/**
 * AsciiDoc (.adoc) — structural document model (types only)
 * Created: 2026-06-15  |  Schema version: 1.0.0
 *
 * A reconstructable model of an AsciiDoc document: header (title, authors,
 * attributes), and a block tree (sections, paragraphs, lists, tables, delimited
 * blocks, admonitions) with inline text kept as raw spans. No functions.
 *
 * Spec: AsciiDoc Language (Asciidoctor)
 */
import type { SchemaVersion } from "../../../../versioning.js";

export type SchemaVersion = "1.0.0";

export interface AsciiDocDocument {
  meta: AsciiDocMeta;
  header?: AsciiDocHeader;
  blocks: AsciiDocBlock[];
}
export interface AsciiDocMeta extends SchemaVersion {
  schemaVersion: SchemaVersion;
  lineEnding?: "\n" | "\r\n";
}
export interface AsciiDocHeader {
  title?: string;
  authors?: Array<{ name: string; email?: string }>;
  revision?: { version?: string; date?: string; remark?: string };
  attributes?: Record<string, string>; // :name: value
}

export type AsciiDocBlock =
  | AsciiDocSection
  | { type: "paragraph"; roles?: string[]; text: string }
  | { type: "list"; variant: "unordered" | "ordered" | "description"; items: AsciiDocListItem[] }
  | {
      type: "listing" | "literal" | "sidebar" | "example" | "quote" | "passthrough" | "open";
      delimiter?: string;
      title?: string;
      lang?: string;
      value: string;
    }
  | {
      type: "admonition";
      name: "NOTE" | "TIP" | "IMPORTANT" | "WARNING" | "CAUTION" | string;
      text: string;
    }
  | { type: "table"; attributes?: string; rows: string[][]; raw?: string }
  | { type: "image"; target: string; alt?: string; attributes?: Record<string, string> }
  | { type: "comment"; value: string }
  | { type: "raw"; value: string };
export interface AsciiDocSection {
  type: "section";
  level: number; // == level (1..)
  title: string;
  id?: string;
  blocks: AsciiDocBlock[];
}
export interface AsciiDocListItem {
  marker?: string;
  term?: string; // for description lists
  text: string;
  children?: AsciiDocBlock[];
}
