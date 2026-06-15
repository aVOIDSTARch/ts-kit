import type { Block } from "./DocumentContent.js";
// ---------------------------------------------------------------------------
// Comments & tracked changes
// ---------------------------------------------------------------------------

export interface Comment {
  id: string;
  author: string;
  date: Date;
  blockId: string; // which block this anchors to
  rangeStart?: number; // character offset within the block
  rangeEnd?: number;
  body: string;
  resolved?: boolean;
  replies?: Comment[];
}

// ---------------------------------------------------------------------------
// Cross-references & bookmarks
// ---------------------------------------------------------------------------

export interface CrossReference {
  id: string;
  label: string; // "Figure 3", "Chapter 2", "Table 1"
  targetBlockId: string;
}

// ---------------------------------------------------------------------------
// Numbered list definitions
// ---------------------------------------------------------------------------

export type NumberingFormat =
  | "decimal"       // 1, 2, 3
  | "lowerAlpha"    // a, b, c
  | "upperAlpha"    // A, B, C
  | "lowerRoman"    // i, ii, iii
  | "upperRoman"    // I, II, III
  | "legal"         // 1.1.1
  | "outline";      // I.A.1

export interface NumberingLevel {
  format: NumberingFormat;
  start: number;
  indent: number; // mm
  suffix?: "." | ")" | "none";
}

export interface NumberingDefinition {
  id: string;
  levels: NumberingLevel[]; // index 0 = top level
  restart?: boolean; // restart from start value on each use
}

// ---------------------------------------------------------------------------
// Assets (images, fonts, attachments)
// ---------------------------------------------------------------------------

export type AssetType = "image" | "font" | "attachment";

export interface Asset {
  id: string;
  type: AssetType;
  mimeType: string;
  data?: Buffer; // inline binary
  src?: string; // external URI / local path
  alt?: string; // accessibility text (primarily for images)
  filename?: string;
}

// ---------------------------------------------------------------------------
// Bidirectional text
// ---------------------------------------------------------------------------

export type TextDirection = "ltr" | "rtl" | "auto";

// ---------------------------------------------------------------------------
// Revision history
// ---------------------------------------------------------------------------

export interface ChangeLogEntry {
  date: Date;
  author: string;
  summary: string;
}

export interface RevisionInfo {
  previousVersionId?: string;
  changeLog?: ChangeLogEntry[];
}

// ---------------------------------------------------------------------------
// EPUB / multi-file document relationships
// ---------------------------------------------------------------------------

export interface SpineItem {
  blockId: string; // references a SectionBlock id
  linear?: boolean; // false for non-linear spine items (e.g. cover, toc)
}

export interface DocumentRelationships {
  spine?: SpineItem[]; // reading order for EPUB
  ncxTitle?: string; // navigation document title
}
