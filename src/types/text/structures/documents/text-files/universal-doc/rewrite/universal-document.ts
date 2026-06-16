/**
 * Universal Document — the pivot IR for the translation hub (types only)
 * Created: 2026-06-15  |  Schema version: 1.0.0
 *
 * The single intermediate representation every format adapter converts to and
 * from. With N adapters (format <-> universal) you get N-to-N translation
 * WITHOUT an O(N^2) mesh of direct converters — the same hub-and-spoke design
 * Pandoc uses (one document AST, many readers/writers).
 *
 *   <format A> --toUniversal--> [ UniversalDocument ] --fromUniversal--> <format B>
 *
 * SEPARATION OF PARTS (the load-bearing design): a document is split into four
 * independent concerns so an adapter can extract/emit each cleanly:
 *   1. meta       — descriptive metadata (title, authors, dates, identifiers...)
 *   2. resources  — binary/external assets (images, fonts, media), addressed by id
 *   3. body       — content + structure (the block/inline tree, incl. chapters)
 *   4. original   — a per-format sidecar of residue that didn't map, so re-export
 *                   to the SAME format can be near-lossless
 *
 * LOSSLESSNESS, honestly: content (text/images), structure (sections/chapters)
 * and metadata can be kept near-lossless. Format-specific *styling* is best-effort
 * across formats; the `original` sidecar + per-node `source` recover same-format
 * fidelity. No functions — this defines the shape; adapters live in their own files.
 */
import type { SchemaVersion } from "../../../../versioning.js";

export type SchemaVersion = "1.0.0";

export interface UniversalDocument {
  meta: DocMeta;
  resources: Resource[];
  body: Block[];
  /**
   * Per-format residue keyed by format id (e.g. "docx", "pdf"). An adapter may
   * stash anything it couldn't represent universally so its own fromUniversal()
   * can restore it. Cross-format conversions simply ignore foreign keys.
   */
  original?: Record<string, unknown>;
}

/* =============================== 1. META =============================== */
export interface DocMeta extends SchemaVersion {
  title?: string;
  subtitle?: string;
  authors?: Person[];
  contributors?: Person[];
  language?: string; // BCP-47, e.g. "en-US"
  description?: string;
  keywords?: string[];
  publisher?: string;
  rights?: string; // license / copyright
  identifiers?: Array<{ scheme?: string; value: string }>; // ISBN, DOI, UUID...
  dates?: {
    created?: string; // ISO 8601
    modified?: string;
    published?: string;
  };
  /** Anything format-specific but still descriptive (kept portable as strings). */
  custom?: Record<string, string>;
}
export interface Person {
  name: string;
  sortAs?: string; // "Last, First"
  role?: string; // author, editor, translator...
  email?: string;
  uri?: string;
}

/* ============================= 2. RESOURCES =========================== */
/** Assets referenced from the body by `id` — never inlined into content nodes. */
export interface Resource {
  id: string;
  mediaType: string; // e.g. "image/png", "font/woff2"
  role?: "image" | "font" | "audio" | "video" | "stylesheet" | "other";
  /** Provide exactly one: embedded bytes (base64) or an external/relative href. */
  data?: string; // base64
  href?: string;
  name?: string; // original filename / path
  width?: number; // px, for images
  height?: number;
  /** Residue (e.g. EXIF, color-profile) for same-format fidelity. */
  source?: Record<string, unknown>;
}

/* ===================== 3. BODY: structure + content ================== */
/** Attributes carried by most nodes (id/classes/k-v) + a residue sidecar. */
export interface Attr {
  id?: string;
  classes?: string[];
  attributes?: Record<string, string>;
  /** Per-node format-specific residue for near-lossless same-format export. */
  source?: Record<string, unknown>;
}

export type Block =
  | Section
  | Heading
  | Paragraph
  | BlockList
  | DefinitionList
  | Table
  | CodeBlock
  | BlockQuote
  | Figure
  | ThematicBreak
  | MathBlock
  | RawBlock;

/** A chapter/section: a heading-bearing container. This is how structure
 *  (chapters, nesting) is represented independently of heading levels. */
export interface Section {
  type: "section";
  level: number; // 1 = top-level chapter
  heading?: Inline[]; // the section title (omit for unlabeled)
  content: Block[];
  attr?: Attr;
}
export interface Heading {
  type: "heading";
  level: 1 | 2 | 3 | 4 | 5 | 6;
  content: Inline[];
  attr?: Attr;
}
export interface Paragraph {
  type: "paragraph";
  content: Inline[];
  attr?: Attr;
}
export interface BlockList {
  type: "list";
  ordered: boolean;
  start?: number; // ordered lists
  tight?: boolean;
  items: ListItem[];
  attr?: Attr;
}
export interface ListItem {
  /** Task-list state; undefined = not a task item. */
  checked?: boolean;
  content: Block[];
}
export interface DefinitionList {
  type: "definitionList";
  items: Array<{ term: Inline[]; definitions: Block[][] }>;
  attr?: Attr;
}
export interface Table {
  type: "table";
  caption?: Inline[];
  /** Column alignments, one per column. */
  align?: Array<"left" | "center" | "right" | "default">;
  head?: TableRow[];
  body: TableRow[];
  foot?: TableRow[];
  attr?: Attr;
}
export interface TableRow {
  cells: TableCell[];
}
export interface TableCell {
  content: Block[];
  colspan?: number;
  rowspan?: number;
  align?: "left" | "center" | "right" | "default";
}
export interface CodeBlock {
  type: "codeBlock";
  language?: string;
  code: string;
  attr?: Attr;
}
export interface BlockQuote {
  type: "blockQuote";
  content: Block[];
  attr?: Attr;
}
/** An image (or other resource) as a block, with an optional caption. */
export interface Figure {
  type: "figure";
  resourceRef: string; // -> Resource.id
  caption?: Inline[];
  alt?: string;
  attr?: Attr;
}
export interface ThematicBreak {
  type: "thematicBreak";
}
export interface MathBlock {
  type: "mathBlock";
  value: string;
  notation?: "tex" | "mathml" | string;
}
/** Passthrough for a target format that can't be modeled universally. */
export interface RawBlock {
  type: "rawBlock";
  format: string;
  value: string;
}

/* ----------------------------- inline ------------------------------- */
export type Inline =
  | TextRun
  | Styled
  | CodeSpan
  | LinkSpan
  | ImageSpan
  | LineBreak
  | MathInline
  | FootnoteRef
  | RawInline
  | GenericSpan;

export interface TextRun {
  type: "text";
  value: string;
}
/** Inline styling via nesting (Pandoc-style), so marks compose. */
export interface Styled {
  type:
    | "emphasis"
    | "strong"
    | "strikethrough"
    | "underline"
    | "subscript"
    | "superscript"
    | "smallcaps";
  content: Inline[];
}
export interface CodeSpan {
  type: "code";
  value: string;
  attr?: Attr;
}
export interface LinkSpan {
  type: "link";
  href: string;
  title?: string;
  content: Inline[];
  attr?: Attr;
}
export interface ImageSpan {
  type: "image";
  resourceRef: string; // -> Resource.id
  alt?: string;
  title?: string;
  attr?: Attr;
}
export interface LineBreak {
  type: "lineBreak";
  hard?: boolean;
}
export interface MathInline {
  type: "mathInline";
  value: string;
  notation?: "tex" | "mathml" | string;
}
export interface FootnoteRef {
  type: "footnote";
  /** Footnote content lives inline so the IR stays self-contained. */
  content: Block[];
  identifier?: string;
}
export interface RawInline {
  type: "rawInline";
  format: string;
  value: string;
}
/** A generic styled span carrying arbitrary attrs (maps to HTML span, etc.). */
export interface GenericSpan {
  type: "span";
  content: Inline[];
  attr?: Attr;
}

/* ============================ ADAPTER CONTRACT ======================= */
/**
 * The spoke. Implement ONE of these per format (in its own file). The pair of
 * pure-ish conversions is all the hub needs; converting A->B is just
 * adapterB.fromUniversal(adapterA.toUniversal(a)).
 *
 * Types only — the implementations (with their parsing/serialization) are yours.
 */
export interface DocumentAdapter<TSpecific> {
  /** Stable format id, e.g. "docx", "markdown", "epub". */
  format: string;
  /** File extensions handled, e.g. [".md", ".markdown"]. */
  extensions?: string[];
  /** Lift a format-specific model into the universal IR. */
  toUniversal(doc: TSpecific): UniversalDocument;
  /** Lower the universal IR back into the format-specific model. */
  fromUniversal(doc: UniversalDocument): TSpecific;
}

/** Optional registry shape if you want to look adapters up by format id. */
export type AdapterRegistry = Record<string, DocumentAdapter<unknown>>;
