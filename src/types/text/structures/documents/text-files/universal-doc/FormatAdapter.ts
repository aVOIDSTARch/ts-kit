import type { UniversalDocument } from "./UniversalDocument.js";

/**
 * Every format adapter implements exactly two functions.
 *
 * parse()     — scraper: takes raw file bytes or string, returns a UniversalDocument
 * serialize() — writer:  takes a UniversalDocument, returns raw file bytes or string
 *
 * Anything format-specific with no universal equivalent should be stored in
 * metadata.custom on parse() and re-emitted from there on serialize() when the
 * target format supports it. That is the lossy-but-honest escape hatch.
 */
export interface FormatAdapter {
  /** The canonical format identifier, e.g. "docx", "pdf", "epub", "md" */
  readonly format: string;

  /** Supported MIME types for this format */
  readonly mimeTypes: string[];

  /** Supported file extensions (without leading dot) */
  readonly extensions: string[];

  /**
   * Parse a raw file into a UniversalDocument.
   * @param input - Raw file content as Buffer (binary) or string (text-based formats)
   * @returns A fully populated UniversalDocument
   */
  parse(input: Buffer | string): Promise<UniversalDocument>;

  /**
   * Serialize a UniversalDocument back to raw file content.
   * @param doc - The document to serialize
   * @returns Raw file content as Buffer (binary) or string (text-based formats)
   */
  serialize(doc: UniversalDocument): Promise<Buffer | string>;
}
