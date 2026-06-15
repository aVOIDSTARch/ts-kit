// Generic command builder for shell commands

// Types used in this project

/** Type Interface for the canonical or root command in a command line command */
export interface RootCommand {
  name: string;
  description: string;
  usage_example?: string;
  format_string?: CmdFormatString;
  subcommands?: RootCommand[];
  options?: CommandOption[];
  help_text?: string;
}

/** Type Interface for a Full Command Line Command String ready to be used in the shell complete with all selected options, arguments, and values required */
export interface FullCommand {
  name: string;
  description: string;
  cmd_string_with_options_and_args: string;
}

/** Type Interface for the subcommand of any level in a command line command */
export interface SubCommand {
  name: string;
  description: string;
  parent_command: RootCommand | SubCommand;
  usage_example?: string;
  format_string?: CmdFormatString;
  root_cmd_options?: CommandOption[];
  sub_cmd_options?: CommandOption[];
  help_text?: string;
}

/** Type Interface for a Command Option that contains all the arguments and their values required to achieve an end */
export interface CommandOption {
  name: string;
  description: string;
  option_short?: string;
  option_long: string;
  options_category?: string;
  has_value: boolean;
  default_value?: string;
  arguments?: Argument[];
  help_text?: string;
};

/** Type Interface for an Argument for consumption by a root or sub command or any option with values as required */
export interface Argument {
  name: string;
  description: string;
  required: boolean;
  args?: string[];
  is_enum?: boolean;
  arg_enums?: string[];
  defaultValue?: string;
  help_text?: string;
}

/** Type Interface for an object containing a formatting string capable of building a command directly - built from a FullCommand Object */
export interface CmdFormatString {
  cmd_alias: string,
  description: string,
  format_string: string;
}

/** Type Interface for an Object that maps an entire command and all its permutations including subcommands, options, and arguments */
export interface CommandMap {
  cmdName: string,
  cmdFamilyDescription: string,
  rootCmd: RootCommand,
  allSubCmds?: SubCommand[],
  allCmdOptions?: CommandOption[],
  allCmdArgs?: Argument[],
  savedCmdFmtStrings?: CmdFormatString[];
  builder?: CmdBuilder
  built_on: Date,
  last_updated: Date
}

/** Type for an Command Entry in a Command Library used to provide quick access to the contents and possible index and search functionality */
export type CmdCatalogEntry = {
  cmdName: string,
  cmdDescription: string
}

/** Type Interface for a Library of CommandMap Objects */
export interface CommandLibrary {
  name: string,
  description: string,
  cmdCatalog?: CmdCatalogEntry[] // Command Name and Description
  commandCollection?: CommandMap[],
  controller?: CmdLibraryController,
  built_on: Date,
  last_updated: Date
}

// Type Interface for CmdBuilder Object
export interface CmdBuilder {

  buildRootCommand(
    root_cmd: RootCommand,
    root_cmd_options?: CommandOption[],
    sub_command?: SubCommand[],
  ): FullCommand;

  buildSubCommand(
    subCmd: SubCommand,
    sub_cmd_options?: CommandOption[]
  ): SubCommand;

  buildOption(
    option: CommandOption,
    option_arguments?: Argument[]
  ): CommandOption[];

  buildArgument(
    arg: Argument,
    arg_values?: string[]
  ): Argument[];

  buildFromFormatString(format: CmdFormatString): FullCommand;

  buildFormatStringFromCmd(fullCmd: FullCommand): CmdFormatString;

  isValidCmdString(fullCmd: FullCommand): boolean;

}

export interface CmdMapBuilder {

}

export interface CmdLibraryController {

  insertCmdMap(map: CommandMap, library: CommandLibrary): boolean;

  updateCmdMap(mapName: string, library: CommandLibrary): boolean;

  deleteCmdMap(mapName: string, library: CommandLibrary): boolean;

  listCommands(library: CommandLibrary): string[];

  getCmdMapLastUpdated(mapName: string, library: CommandLibrary): Date;

  getLibraryLastUpdated(libraryName: string, library: CommandLibrary): Date;

  getLibrariesList(dirName?: string): string[];
}
