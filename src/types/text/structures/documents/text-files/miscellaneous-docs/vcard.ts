/**
 * vCard (.vcf) — structural model (types only)
 * Created: 2026-06-15  |  Schema version: 1.0.0
 *
 * A reconstructable model of a vCard stream: one or more cards, each a list of
 * content lines (property + params + value), preserving group prefixes, param
 * order and exact value text. Sibling to ics.ts. No functions.
 *
 * Spec: RFC 6350 (vCard 4.0) / 2426 (3.0)
 */
import type { SchemaVersion } from "../../../../versioning.js";

export type SchemaVersion = "1.0.0";

export interface VCardStream {
  meta: VCardMeta;
  cards: VCard[];
}
export interface VCardMeta extends SchemaVersion {
  schemaVersion: SchemaVersion;
  lineEnding?: "\r\n" | "\n";
}

export interface VCard {
  version: string; // "4.0" | "3.0" | "2.1"
  properties: VCardProperty[];
}
export interface VCardProperty {
  group?: string; // optional "group." prefix
  name: string; // "FN", "N", "EMAIL", "TEL", "X-..."
  params: VCardParam[]; // TYPE, PREF, VALUE, ...
  value: string; // exact value text (may be ';'/','-structured)
  valueType?: string; // hint: text, uri, date, ...
  raw?: string; // original unfolded line
}
export interface VCardParam {
  name: string;
  values: string[];
}
