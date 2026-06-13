import { spawn } from "node:child_process";
export type Std_Streams = {
    stdout: NodeJS.ReadableStream;
    stderr: NodeJS.ReadableStream;
    process?: ReturnType<typeof spawn>;
};
export type Cmd_Result<T> = {
    success: true;
    data: T;
} | {
    success: false;
    error: Error;
};
/** Stream-based execution via spawn — best for large or real-time output.
 *  Command and args are separate; pass use_shell=true to run through a shell. */
export declare function runCmdStreaming(cmd_name: string, cmd_args?: string[], use_shell?: boolean, options?: {
    dir?: string;
    timeoutInMillis?: number;
}): Cmd_Result<Std_Streams>;
/** Buffered async execution via exec — best for small output. */
export declare function runCmdAsync(cmd: string, options?: {
    dir?: string;
    timeoutInMillis?: number;
}): Promise<Cmd_Result<{
    stdout: string;
    stderr: string;
}>>;
/** Synchronous execution via execSync. Always returns a Cmd_Result (never throws). */
export declare function runCmdSync(cmd: string, options?: {
    dir?: string;
    timeoutInMillis?: number;
}): Cmd_Result<string>;
export declare function isSuccess<T>(result: Cmd_Result<T>): result is {
    success: true;
    data: T;
};
