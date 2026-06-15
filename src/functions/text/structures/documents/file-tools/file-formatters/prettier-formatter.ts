import type { Formatter } from "../../../../../../types/all-types.js";

/** Formatter backed by Prettier's programmatic API. Verified with Prettier 3.8.
 *  `prettier` is an OPTIONAL PEER dependency — only needed if you use this.
 *  The parser is inferred from the filePath's extension (symmetric with
 *  biomeFormatter), and Prettier throws on malformed input — a free syntax check. */
export function prettierFormatter(filePath: string): Formatter {
  return async (src) => {
    const { format } = await import("prettier"); // lazy: core never loads prettier
    return format(src, { filepath: filePath });
  };
}
