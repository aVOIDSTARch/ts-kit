import { ensureTrailingNewline } from "../strings.js";
import { resolve } from "./resolve.js";
/** No-op formatter: returns text unchanged. */
export const identity = async (s) => s;
/** Pure core: resolve pieces → join with newlines → format → ensure trailing newline.
 *  No I/O, no required runtime deps; runs on any JS runtime. */
export async function build(pieces, format = identity) {
    return ensureTrailingNewline(await format((await resolve(pieces)).join("\n")));
}
/** Pick a formatter from a table keyed by file extension (e.g. ".ts"). */
export function formatterForPath(path, table) {
    const i = path.lastIndexOf(".");
    const ext = i < 0 ? "" : path.slice(i);
    return table[ext] ?? identity;
}
/** Curry a FileWriter (Node/Deno/Bun/in-memory/S3/...) into a writer that
 *  builds pieces and commits them. The only side-effecting seam. */
export function writeFileWith(writer) {
    return async (path, pieces, opts) => {
        const format = opts?.formatter ??
            (opts?.formatters ? formatterForPath(path, opts.formatters) : identity);
        await writer(path, await build(pieces, format));
    };
}
/** Node file sink. Imported lazily so the core stays runtime-agnostic. */
export const nodeWriter = async (p, c) => (await import("node:fs/promises")).writeFile(p, c, "utf-8");
