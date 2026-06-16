import { SemanticVersion } from "../../../classes/SemanticVersion.js";

export interface SemVer {
  version: SemanticVersion;
}

export type SchemaVersion = {
  schemaVersion: SemVer;
};
