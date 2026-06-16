/**
 * ODS (OpenDocument Spreadsheet) — structural model (types only)
 * Created: 2026-06-15  |  Schema version: 1.0.0
 *
 * ODF container (see ./odf) + a high-level spreadsheet (tables -> rows -> typed
 * cells with formulas). content.xml authoritative via raw. No functions.
 *
 * Spec: OpenDocument 1.3 — Spreadsheet
 */
import type { OdfContainer } from "./odf.js";

export type SchemaVersion = "1.0.0";

export interface OdsDocument {
  meta: { schemaVersion: SchemaVersion };
  container: OdfContainer;
  tables?: OdsTable[];
}
export interface OdsTable {
  name: string;
  rows: OdsRow[];
  raw?: string;
}
export interface OdsRow {
  cells: OdsCell[];
  repeated?: number;
}
export interface OdsCell {
  /** office:value-type */
  valueType?: "float" | "percentage" | "currency" | "date" | "time" | "boolean" | "string";
  value?: string | number | boolean; // typed value
  text?: string; // displayed text
  formula?: string; // table:formula (e.g. "of:=SUM(...)")
  repeated?: number; // number-columns-repeated
  styleName?: string;
}
