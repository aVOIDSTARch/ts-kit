import type { Formatter } from "../../types/text/index.js";
/** The filePath's EXTENSION selects the language; the name is arbitrary.
 *  Biome does not throw on malformed input, so we surface error diagnostics
 *  as a thrown Error by default (matching Prettier) — disable with throwOnError: false. */
export declare function biomeFormatter(filePath: string, opts?: {
    throwOnError?: boolean;
}): Formatter;
