import { describe, it, expect } from "vitest";
import { resolve, build } from "../src/functions/text/index.js";

describe("resolve", () => {
  it("preserves flat order", async () => {
    expect(await resolve(["a", "b"])).toEqual(["a", "b"]);
  });
  it("preserves order through nested arrays", async () => {
    expect(await resolve(["a", ["b", "c"], "d"])).toEqual(["a", "b", "c", "d"]);
  });
  it("drops false/null/undefined", async () => {
    expect(await resolve(["a", false, null, undefined, "b"])).toEqual(["a", "b"]);
  });
  it('keeps "" as a deliberate blank line', async () => {
    expect(await resolve(["a", "", "b"])).toEqual(["a", "", "b"]);
  });
  it("resolves sync and async thunks", async () => {
    expect(await resolve(["a", () => "b", () => Promise.resolve("c")])).toEqual(["a", "b", "c"]);
  });
  it("re-resolves thunks returning arrays or thunks", async () => {
    expect(await resolve(["a", () => ["b", "c"], () => () => "d"])).toEqual(["a", "b", "c", "d"]);
  });
  it("drops a thunk that returns falsy", async () => {
    expect(await resolve(["a", () => false, "b"])).toEqual(["a", "b"]);
  });
  it("handles deep async nesting in order", async () => {
    expect(await resolve(["a", [() => Promise.resolve(["b", "c"]), "d"], "e"])).toEqual([
      "a",
      "b",
      "c",
      "d",
      "e",
    ]);
  });
});

describe("build", () => {
  it("joins with newlines and ensures a trailing newline", async () => {
    expect(await build(["a", "b"])).toBe("a\nb\n");
  });
  it("applies the formatter", async () => {
    expect(await build(["a"], async (s) => s.toUpperCase())).toBe("A\n");
  });
  it("turns an empty-string piece into a blank line", async () => {
    expect(await build(["a", "", "b"])).toBe("a\n\nb\n");
  });
  it("does not double an existing trailing newline", async () => {
    expect(await build(["x\n"])).toBe("x\n");
  });
});
