// A class to handle the use of semantic versioning by the standard in objects

// Standard Definition is located at https://semver.org

import { formatString } from "../functions/functions.js";
// Interface for a class that has one or more incrementable values
export interface Incrementable {
  increment(field: string): number;
}

export const enum coreFieldName {
  MAJOR = "MAJOR",
  MINOR = "MINOR",
  PATCH = "PATCH",
}

export class SemanticVersion implements Incrementable {
  readonly description =
    "Given a version number MAJOR.MINOR.PATCH, increment the MAJOR version when you make incompatible API changes, the MINOR version when you add functionality in a backward compatible manner, and the PATCH version when you make backward compatible bug fixes.Additional labels for pre-release and build metadata are available as extensions to the MAJOR.MINOR.PATCH-<PRERELEASE.PREVERS>+<BUILDPART.BUILDPART...> format.";

  private majorValue: number;
  private minorValue: number;
  private patchValue: number;
  private preReleaseValue: string;
  private preReleaseVersNumValue: number;
  private buildPartValues: string[];
  static CoreFormattingString: string = "{0}:{1}:{2}";

  public constructor(
    major: number,
    minor: number,
    patch: number,
    preRelease?: string,
    preReleaseVersNum?: number,
    buildParts?: string[],
  ) {
    this.majorValue = major;
    this.minorValue = minor;
    this.patchValue = patch;
    this.preReleaseValue = "";
    this.preReleaseVersNumValue = 0;
    this.buildPartValues = [];

    if (preRelease) {
      this.preReleaseValue = preRelease;
    }
    if (preRelease && preReleaseVersNum) {
      this.preReleaseVersNumValue = preReleaseVersNum;
    }
    if (buildParts) {
      this.buildPartValues = [...buildParts];
    }
  }

  public toCoreString() {
    return formatString(
      SemanticVersion.CoreFormattingString,
      this.majorValue,
      this.minorValue,
      this.patchValue,
    );
  }

  public toFullStringWithOpts(
    withPreRelease: boolean,
    withPreReleaseVersNum: boolean,
    withBuildParts: boolean,
  ) {
    // Define and initialize the return string to empty string
    let fullString: string = "";
    // Append the formatted core version string
    fullString += this.toCoreString();
    // A series of if-statements to append the parts requested
    if (withPreRelease) {
      fullString += "-";
      fullString += this.preReleaseValue;
    }
    if (withPreReleaseVersNum) {
      fullString += ".";
      fullString += this.preReleaseVersNumValue;
    }
    if (withBuildParts) {
      fullString += "+";
      this.buildPartValues.forEach((part) => {
        fullString += part;
      });
    }
    return fullString;
  }

  // Increment the values on the core

  public increment(field: string): number {
    let newValue = 0;

    switch (field) {
      case "MAJOR": {
        this.majorValue += 1;
        newValue = this.majorValue;
        break;
      }
      case "MINOR": {
        this.minorValue += 1;
        newValue = this.minorValue;
        break;
      }
      case "PATCH": {
        this.patchValue += 1;
        newValue = this.patchValue;
        break;
      }
      default: {
        throw new Error(" This value does not align with the required values");
      }
    }
    return newValue;
  }
}
