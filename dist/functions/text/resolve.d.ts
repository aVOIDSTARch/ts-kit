import type { Piece } from "../../types/text/index.js";
/** Flatten an ordered tree of Pieces into a string[], in order.
 *  - drops false/null/undefined (but keeps "" — a deliberate blank line)
 *  - recurses into arrays
 *  - calls thunks and re-resolves their result (string, array, or thunk) */
export declare function resolve(pieces: Piece[]): Promise<string[]>;
