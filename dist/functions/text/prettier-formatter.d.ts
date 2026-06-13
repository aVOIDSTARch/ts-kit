import type { Formatter } from "../../types/text/index.js";
/** Formatter backed by Prettier's programmatic API. Verified with Prettier 3.8.
 *  `prettier` is an OPTIONAL PEER dependency — only needed if you use this.
 *  The parser is inferred from the filePath's extension (symmetric with
 *  biomeFormatter), and Prettier throws on malformed input — a free syntax check. */
export declare function prettierFormatter(filePath: string): Formatter;
