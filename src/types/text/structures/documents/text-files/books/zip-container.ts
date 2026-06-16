/**
 * ZIP container primitives — shared by archive-based formats (e.g. EPUB).
 */

export interface ZipEntry {
  /** Archive-relative path (e.g. "OEBPS/content.opf"). */
  path: string;
  compression: "stored" | "deflated";
  data: Uint8Array | string;
}
