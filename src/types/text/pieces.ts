/** A unit of content that resolves to text. Invariant blocks stay whole. */
export type Piece =
  | string
  | (() => string | Promise<string>)
  | Piece[]
  | false
  | null
  | undefined;
