# @avoidstarch/ts-kit

Personal kit of shared TypeScript types and functions.

## Install

```bash
npm install github:aVOIDSTARch/ts-kit
```

## Usage

```ts
import { Piece, Formatter, FileWriter, ensureTrailingNewline } from "@avoidstarch/ts-kit";
```

## Structure

- `types/` — shared types (a category is a file, or a folder with its own `index.ts` when it grows sub-categories)
- `functions/` — shared functions (same convention)

Everything is re-exported from the package root, so the import path stays flat regardless of internal nesting.
