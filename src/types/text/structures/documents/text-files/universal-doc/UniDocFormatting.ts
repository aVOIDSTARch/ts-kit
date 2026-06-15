import type { Run } from "./UniDocContent.js";

// ---------------------------------------------------------------------------
// Named style definition
// ---------------------------------------------------------------------------

export interface Style {
  fontFamily?: string;
  fontSize?: number; // pt
  bold?: boolean;
  italic?: boolean;
  color?: string; // hex
  lineHeight?: number; // multiplier, e.g. 1.5
  spaceBefore?: number; // pt
  spaceAfter?: number; // pt
  indent?: number; // mm
  textTransform?: "uppercase" | "lowercase" | "capitalize" | "none";
  borderBottom?: string; // e.g. "1px solid #000" for heading underlines
}

// ---------------------------------------------------------------------------
// Header / footer
// ---------------------------------------------------------------------------

export interface HeaderFooter {
  left?: Run[];
  center?: Run[];
  right?: Run[];
  includePageNumber?: boolean;
  pageNumberFormat?: "arabic" | "roman" | "alpha";
}

// ---------------------------------------------------------------------------
// Page layout
// ---------------------------------------------------------------------------

export type PageSize = "A4" | "A5" | "letter" | "legal" | "custom";

export interface PageMargins {
  top: number; // mm
  bottom: number; // mm
  left: number; // mm
  right: number; // mm
  gutter?: number; // mm — for bound documents
}

export interface PageLayout {
  size: PageSize;
  width?: number; // mm — required when size is "custom"
  height?: number; // mm — required when size is "custom"
  orientation: "portrait" | "landscape";
  margins: PageMargins;
}

// ---------------------------------------------------------------------------
// Typography defaults
// ---------------------------------------------------------------------------

export interface Typography {
  defaultFontFamily: string;
  defaultFontSize: number; // pt
  lineHeight: number; // multiplier, e.g. 1.5
  paragraphSpacing: number; // pt after each paragraph
}

// ---------------------------------------------------------------------------
// Color theme
// ---------------------------------------------------------------------------

export interface ColorTheme {
  primary?: string; // hex
  accent?: string; // hex
  text?: string; // hex
  background?: string; // hex
}

// ---------------------------------------------------------------------------
// Table of contents config
// ---------------------------------------------------------------------------

export interface TocConfig {
  maxDepth: number;
  title?: string;
}

// ---------------------------------------------------------------------------
// Top-level formatting container
// ---------------------------------------------------------------------------

export interface DocumentFormatting {
  page: PageLayout;
  styles: Record<string, Style>; // named styles; keys are style names
  typography: Typography;
  header?: HeaderFooter;
  footer?: HeaderFooter;
  toc?: TocConfig;
  colors?: ColorTheme;
}
