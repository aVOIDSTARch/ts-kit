import type { Piece, Formatter, FileWriter } from "../../../../../../../types/text/text.js";
import { ensureTrailingNewline } from "../../../../strings/strings.js";
import { resolve } from "../../../../pieces/resolve.js";

/** No-op formatter: returns text unchanged. */
export const identity: Formatter = async (s) => s;

/** Pure core: resolve pieces → join with newlines → format → ensure trailing newline.
 *  No I/O, no required runtime deps; runs on any JS runtime. */
export async function build(pieces: Piece[], format: Formatter = identity): Promise<string> {
  return ensureTrailingNewline(await format((await resolve(pieces)).join("\n")));
}

/** Pick a formatter from a table keyed by file extension (e.g. ".ts"). */
export function formatterForPath(path: string, table: Record<string, Formatter>): Formatter {
  const i = path.lastIndexOf(".");
  const ext = i < 0 ? "" : path.slice(i);
  return table[ext] ?? identity;
}

/** Curry a FileWriter (Node/Deno/Bun/in-memory/S3/...) into a writer that
 *  builds pieces and commits them. The only side-effecting seam. */
export function writeFileWith(writer: FileWriter) {
  return async (
    path: string,
    pieces: Piece[],
    opts?: { formatter?: Formatter; formatters?: Record<string, Formatter> },
  ): Promise<void> => {
    const format =
      opts?.formatter ?? (opts?.formatters ? formatterForPath(path, opts.formatters) : identity);
    await writer(path, await build(pieces, format));
  };
}

/** Node file sink. Imported lazily so the core stays runtime-agnostic. */
export const nodeWriter: FileWriter = async (p, c) =>
  (await import("node:fs/promises")).writeFile(p, c, "utf-8");
