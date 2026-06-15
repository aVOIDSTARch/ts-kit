# Universal Document Type System

A TypeScript type library defining a single intermediate format for representing any text-based document — regardless of its source or target file format.

---

## The Problem

Every document format — `.docx`, `.pdf`, `.epub`, `.md`, `.xlsx`, plain text — has its own model for expressing the same three things: **what the content is**, **how it should look**, and **what it's about**. Building a program that reads, manipulates, or converts between these formats without a shared intermediate means writing N² translation paths. Ten formats means ninety conversion pairs. Every new format added doubles the problem.

The naive alternative — keeping separate data objects for text, metadata, and formatting — recreates the fragmentation at the application layer. They drift out of sync, require their own synchronization logic, and make transformation ambiguous.

---

## The Solution

One intermediate object: `UniversalDocument`.

Any format adapter parses its source format into a `UniversalDocument`, and any other format adapter serializes a `UniversalDocument` into its target format. The conversion graph collapses from N² pairs to 2N adapters — one parser and one serializer per format, independent of every other format.

```
.docx ──► parse ──►┐
.epub ──► parse ──►│
.md   ──► parse ──►├──► UniversalDocument ──►┬──► serialize ──► .pdf
.pdf  ──► parse ──►│                         ├──► serialize ──► .docx
.txt  ──► parse ──►┘                         └──► serialize ──► .epub
```

---

## Structure

A `UniversalDocument` has three core namespaces and a set of supplementary stores.

### Core namespaces

#### `metadata` — `DocumentMetadata`
Format-agnostic facts about the document: title, authorship, timestamps, language, version, rights. An escape hatch (`custom: Record<string, unknown>`) captures format-specific metadata that has no universal equivalent.

#### `content` — `DocumentContent`
The document body as an ordered array of typed `Block` objects. Each block represents a structural unit: paragraph, heading, list, table, code block, image, section (chapter/part/appendix), blockquote, footnote, page break, or horizontal rule.

Inline formatting lives in `Run` objects within blocks. A `Run` is a span of text carrying its own formatting properties — bold, italic, font, color, link, and so on — independently of the surrounding block's structure.

Keeping inline formatting inside runs rather than in the block itself is what makes the content layer portable. A paragraph is always a paragraph; only the visual interpretation of its runs changes between formats.

#### `formatting` — `DocumentFormatting`
Everything presentational that is independent of content: page size and margins, named styles, typography defaults, header and footer templates, color theme, and table of contents configuration. Blocks and runs can reference named styles by key rather than repeating inline values, mirroring how Word's style system and CSS classes work.

### Supplementary stores

These are optional arrays attached to the root document, referenced by ID from within the content tree rather than embedded directly.

| Field | Type | Purpose |
|---|---|---|
| `assets` | `Asset[]` | Images, fonts, attachments. `ImageBlock` references an asset by `id` rather than embedding binary data inline. |
| `comments` | `Comment[]` | Review annotations anchored to a block by `blockId`, with character offsets and threaded replies. |
| `crossReferences` | `CrossReference[]` | Named internal links — "Figure 3", "Chapter 2" — resolved against block `id` fields. |
| `numberingDefinitions` | `NumberingDefinition[]` | Named list counter configurations supporting decimal, alpha, roman, legal (`1.1.1`), and outline (`I.A.1`) formats with per-level indent and restart rules. |
| `revisions` | `RevisionInfo` | Previous version pointer and change log for documents that are persisted over time. |
| `relationships` | `DocumentRelationships` | EPUB spine and NCX navigation data for multi-file formats. |

---

## File Layout

```
universal-document/
├── index.ts                  # Barrel — import everything from here
├── UniversalDocument.ts      # Root type composing all namespaces
├── DocumentMetadata.ts       # Identity, authorship, timestamps, rights
├── DocumentContent.ts        # Block union, Run, and all block variants
├── DocumentFormatting.ts     # Page layout, styles, typography, header/footer
├── DocumentSupplementary.ts  # Comments, cross-refs, assets, numbering, BiDi, EPUB
└── FormatAdapter.ts          # The two-method adapter contract
```

The dependency graph is acyclic. `DocumentContent`, `DocumentMetadata`, and `DocumentFormatting` are leaf modules with no internal imports. `DocumentSupplementary` imports only from `DocumentContent`. `UniversalDocument` imports from all of them. `FormatAdapter` imports only `UniversalDocument`.

---

## Usage

### Importing

```typescript
import type {
  UniversalDocument,
  DocumentMetadata,
  DocumentContent,
  DocumentFormatting,
  Block,
  Run,
  FormatAdapter,
} from "./universal-document";
```

### Implementing a format adapter

Every adapter implements the `FormatAdapter` interface: two async methods, `parse` and `serialize`.

```typescript
import type { FormatAdapter, UniversalDocument } from "./universal-document";

export const MarkdownAdapter: FormatAdapter = {
  format: "md",
  mimeTypes: ["text/markdown"],
  extensions: ["md", "markdown"],

  async parse(input: Buffer | string): Promise<UniversalDocument> {
    const src = typeof input === "string" ? input : input.toString("utf-8");
    // ... parse markdown into blocks, extract frontmatter into metadata
    return {
      metadata: { title: extractTitle(src) },
      content: { blocks: parseBlocks(src) },
      formatting: defaultFormatting(),
    };
  },

  async serialize(doc: UniversalDocument): Promise<string> {
    // ... walk doc.content.blocks, emit markdown syntax
    return renderMarkdown(doc);
  },
};
```

### Handling format-specific data

If a source format contains data that has no universal equivalent, write it into `metadata.custom` on parse. On serialize, read it back from `metadata.custom` if the target format supports it, and discard it silently if not. This keeps the core schema clean while avoiding silent data loss on round-trips to the same format.

```typescript
// On parse from .docx
metadata.custom = {
  docx: {
    revisionCount: 14,
    lastSavedBy: "Jane Smith",
    compatibilityMode: 15,
  },
};

// On serialize back to .docx
const docxMeta = doc.metadata.custom?.["docx"] as DocxCustomMeta | undefined;
```

### Referencing assets

Images and other binary resources are stored in `doc.assets`, not embedded in the content tree. An `ImageBlock` holds only the asset ID:

```typescript
// Content block
const block: ImageBlock = {
  type: "image",
  assetId: "img-001",
  alt: "Architecture diagram",
  caption: [{ text: "Figure 1: System overview" }],
};

// Asset store entry
const asset: Asset = {
  id: "img-001",
  type: "image",
  mimeType: "image/png",
  data: pngBuffer, // or src: "./figures/system-overview.png"
};
```

### Referencing named styles

Rather than repeating formatting values on every run, define a named style in `formatting.styles` and reference it by key:

```typescript
// In formatting
formatting.styles["body-emphasis"] = {
  italic: true,
  color: "#2a2a2a",
};

// In a run
const run: Run = {
  text: "This is important.",
  styleRef: "body-emphasis",
};
```

---

## Design Decisions

**Why one object, not three?** Separate objects for text, metadata, and formatting require synchronization logic, drift over time, and make transformation ambiguous. One object with three namespaces gives the same separation of concerns without the coordination overhead.

**Why separate formatting from content?** Because the same content renders differently in every format. A paragraph is a paragraph everywhere; its margins and font are a presentation concern. Conflating them — as raw HTML often does — makes format conversion require re-parsing content to strip presentation.

**Why blocks and runs rather than a flat string?** Because structure is information. Knowing that a span of text is a heading, a list item, or a table cell cell is what allows a serializer to emit the correct output for any target format. A flat string throws that structure away and cannot be recovered.

**Why async adapters?** Parsing large files and writing binary formats (PDF, EPUB) involves I/O. Synchronous adapters block the event loop. All adapters are async by contract so the pattern is consistent even when a specific implementation is synchronous.

---

## What This Library Is Not

This is a **type definition library**, not a runtime engine. It defines the shape of data; it does not ship any parsers or serializers. Those are format-specific adapters you implement against the `FormatAdapter` interface. The library's job is to ensure every adapter agrees on what a document looks like in memory.
