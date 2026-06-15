// ---------------------------------------------------------------------------
// Inline
// ---------------------------------------------------------------------------

export interface Run {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  superscript?: boolean;
  subscript?: boolean;
  code?: boolean; // inline code
  link?: string; // href
  color?: string; // hex
  highlight?: string; // hex
  fontFamily?: string;
  fontSize?: number; // pt
  styleRef?: string; // reference to a named style
}

// ---------------------------------------------------------------------------
// Block union
// ---------------------------------------------------------------------------

export type Block =
  | ParagraphBlock
  | HeadingBlock
  | ListBlock
  | TableBlock
  | CodeBlock
  | ImageBlock
  | PageBreakBlock
  | HorizontalRuleBlock
  | FootnoteBlock
  | BlockquoteBlock
  | SectionBlock;

// ---------------------------------------------------------------------------
// Block types
// ---------------------------------------------------------------------------

export interface ParagraphBlock {
  type: "paragraph";
  id?: string; // for cross-references
  runs: Run[];
  alignment?: "left" | "center" | "right" | "justify";
  role?: "body" | "caption" | "footnote" | "pullquote";
}

export interface HeadingBlock {
  type: "heading";
  level: 1 | 2 | 3 | 4 | 5 | 6;
  runs: Run[];
  id?: string; // anchor for TOC links
  numbering?: string; // "1.2.3" if explicit
}

export interface ListItem {
  runs: Run[];
  children?: ListBlock; // nested lists
}

export interface ListBlock {
  type: "list";
  ordered: boolean;
  items: ListItem[];
}

export interface TableCell {
  blocks: Block[]; // cells can contain anything
  colspan?: number;
  rowspan?: number;
  alignment?: "left" | "center" | "right";
}

export interface TableRow {
  cells: TableCell[];
  isHeader?: boolean;
}

export interface TableBlock {
  type: "table";
  rows: TableRow[];
  caption?: Run[];
}

export interface CodeBlock {
  type: "code";
  language?: string;
  content: string; // raw — no runs needed
  filename?: string;
}

export interface ImageBlock {
  type: "image";
  assetId: string; // reference into the Asset store
  alt?: string;
  caption?: Run[];
  width?: number; // mm
  height?: number; // mm
}

export interface PageBreakBlock {
  type: "pageBreak";
}

export interface HorizontalRuleBlock {
  type: "horizontalRule";
}

export interface FootnoteBlock {
  type: "footnote";
  id: string;
  blocks: Block[];
}

export interface BlockquoteBlock {
  type: "blockquote";
  blocks: Block[];
  attribution?: Run[];
}

export interface SectionBlock {
  type: "section";
  role: "chapter" | "part" | "appendix" | "section";
  heading?: HeadingBlock;
  blocks: Block[];
}

// ---------------------------------------------------------------------------
// Top-level content container
// ---------------------------------------------------------------------------

export interface DocumentContent {
  blocks: Block[];
}
