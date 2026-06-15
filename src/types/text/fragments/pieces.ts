/** A unit of content that resolves to text. Invariant blocks stay whole.
 *  A thunk may return any Piece (string, array, another thunk, or falsy),
 *  so it is resolved recursively. Falsy entries (false/null/undefined) are
 *  dropped, which lets optional sections disappear cleanly. */
export type Piece = string | (() => Piece | Promise<Piece>) | Piece[] | false | null | undefined;
