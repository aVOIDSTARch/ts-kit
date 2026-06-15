import type { DocumentMetadata } from "./UniDocMetadata.js";
import type { DocumentContent } from "./UniDocContent.js";
import type { DocumentFormatting } from "./UniDocFormatting.js";
import type {
  Asset,
  Comment,
  CrossReference,
  NumberingDefinition,
  RevisionInfo,
  DocumentRelationships,
} from "./UniDocSupplementary.js";

export interface UniversalDocument {
  // Core namespaces
  metadata: DocumentMetadata;
  content: DocumentContent;
  formatting: DocumentFormatting;

  // Supplementary stores
  assets?: Asset[]; // keyed by Asset.id; referenced by ImageBlock.assetId
  comments?: Comment[];
  crossReferences?: CrossReference[];
  numberingDefinitions?: NumberingDefinition[];

  // Optional extended concerns
  revisions?: RevisionInfo;
  relationships?: DocumentRelationships; // EPUB spine / NCX
}
