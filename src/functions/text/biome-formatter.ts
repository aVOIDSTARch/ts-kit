import type { Formatter } from "../../types/text/index.js";

/** Formatter backed by Biome's in-process API. Verified with @biomejs/biome 2.5
 *  + @biomejs/js-api 6.0. `@biomejs/js-api` and `@biomejs/wasm-nodejs` are
 *  OPTIONAL PEER dependencies — only needed if you use this. */

// Shared, lazy, created once — Biome.create + openProject are the expensive parts.
let _biome:
  | Promise<{
      format: (src: string, filePath: string) => { content: string; diagnostics: any[] };
      print: (d: any[], filePath: string, fileSource: string) => string;
    }>
  | undefined;

function getBiome() {
  return (_biome ??= (async () => {
    const { Biome, Distribution } = await import("@biomejs/js-api");
    const biome = await Biome.create({ distribution: Distribution.NODE });
    const { projectKey } = biome.openProject("/");
    return {
      format: (src: string, filePath: string) => biome.formatContent(projectKey, src, { filePath }),
      print: (d: any[], filePath: string, fileSource: string) =>
        biome.printDiagnostics(d, { filePath, fileSource }),
    };
  })());
}

/** The filePath's EXTENSION selects the language; the name is arbitrary.
 *  Biome does not throw on malformed input, so we surface error diagnostics
 *  as a thrown Error by default (matching Prettier) — disable with throwOnError: false. */
export function biomeFormatter(filePath: string, opts?: { throwOnError?: boolean }): Formatter {
  return async (src) => {
    const { format } = await getBiome();
    const { content, diagnostics } = format(src, filePath);
    const errors = diagnostics?.filter((d: any) => d.severity === "error" || d.severity === "fatal") ?? [];
    if (errors.length && opts?.throwOnError !== false) {
      throw new Error(`Biome rejected ${filePath}:\n${errors.map((d: any) => d.description).join("\n")}`);
    }
    return content;
  };
}
