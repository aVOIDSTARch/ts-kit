/** Flatten an ordered tree of Pieces into a string[], in order.
 *  - drops false/null/undefined (but keeps "" — a deliberate blank line)
 *  - recurses into arrays
 *  - calls thunks and re-resolves their result (string, array, or thunk) */
export async function resolve(pieces) {
    const out = [];
    for (const piece of pieces)
        await handle(piece, out);
    return out;
}
async function handle(piece, out) {
    if (piece === false || piece === null || piece === undefined)
        return;
    if (typeof piece === "string") {
        out.push(piece);
        return;
    }
    if (Array.isArray(piece)) {
        for (const p of piece)
            await handle(p, out);
        return;
    }
    if (typeof piece === "function") {
        await handle(await piece(), out);
    }
}
