/** Post-processor applied to assembled text (e.g. Prettier or Biome). */
export type Formatter = (src: string) => Promise<string>;
/** Runtime-agnostic file sink; inject a Node/Deno/Bun/in-memory writer. */
export type FileWriter = (path: string, contents: string) => Promise<void>;
