export interface DocumentMetadata {
  // Identity
  title: string;
  subject?: string;
  description?: string;
  keywords?: string[];
  language?: string; // BCP 47: "en-US", "fr-FR"

  // Authorship
  author?: string;
  authors?: string[]; // multi-author support
  organization?: string;
  email?: string;

  // Timestamps
  createdAt?: Date;
  modifiedAt?: Date;
  publishedAt?: Date;

  // Document identity
  version?: string;
  revision?: number;
  sourceFormat?: string; // "docx" | "pdf" | "epub" | etc.
  sourceFile?: string;

  // Rights
  copyright?: string;
  license?: string; // SPDX: "MIT", "CC-BY-4.0"

  // Custom — escape hatch for format-specific metadata
  custom?: Record<string, unknown>;
}
