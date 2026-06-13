import type { Piece, Formatter, FileWriter } from "../../types/text/index.js";
/** No-op formatter: returns text unchanged. */
export declare const identity: Formatter;
/** Pure core: resolve pieces → join with newlines → format → ensure trailing newline.
 *  No I/O, no required runtime deps; runs on any JS runtime. */
export declare function build(pieces: Piece[], format?: Formatter): Promise<string>;
/** Pick a formatter from a table keyed by file extension (e.g. ".ts"). */
export declare function formatterForPath(path: string, table: Record<string, Formatter>): Formatter;
/** Curry a FileWriter (Node/Deno/Bun/in-memory/S3/...) into a writer that
 *  builds pieces and commits them. The only side-effecting seam. */
export declare function writeFileWith(writer: FileWriter): (path: string, pieces: Piece[], opts?: {
    formatter?: Formatter;
    formatters?: Record<string, Formatter>;
}) => Promise<void>;
/** Node file sink. Imported lazily so the core stays runtime-agnostic. */
export declare const nodeWriter: FileWriter;
