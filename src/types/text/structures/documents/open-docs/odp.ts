/**
 * ODP (OpenDocument Presentation) — structural model (types only)
 * Created: 2026-06-15  |  Schema version: 1.0.0
 *
 * ODF container (see ./odf) + a high-level deck (pages -> frames -> text/images).
 * content.xml authoritative via raw. No functions.
 *
 * Spec: OpenDocument 1.3 — Presentation
 */
import type { OdfContainer } from "./odf.js";

export type SchemaVersion = "1.0.0";

export interface OdpDocument {
  meta: { schemaVersion: SchemaVersion };
  container: OdfContainer;
  pages?: OdpPage[];
}
export interface OdpPage {
  name?: string;
  masterPageName?: string;
  frames: OdpFrame[];
  raw?: string;
}
export interface OdpFrame {
  type: "text" | "image" | "other";
  width?: string;
  height?: string;
  x?: string;
  y?: string;
  /** For text frames: paragraphs of spans. */
  paragraphs?: Array<{ spans: Array<{ text: string; styleName?: string }> }>;
  imageHref?: string; // for image frames
  raw?: string;
}
