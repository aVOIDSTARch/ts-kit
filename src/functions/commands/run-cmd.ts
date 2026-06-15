// Run a command in a child process. Uses only Node built-ins (no external deps).
import { spawn, exec, execSync } from "node:child_process";
import path from "node:path";

export type Std_Streams = {
  stdout: NodeJS.ReadableStream;
  stderr: NodeJS.ReadableStream;
  process?: ReturnType<typeof spawn>;
};

export type Cmd_Result<T> = { success: true; data: T } | { success: false; error: Error };

/** Stream-based execution via spawn — best for large or real-time output.
 *  Command and args are separate; pass use_shell=true to run through a shell. */
export function runCmdStreaming(
  cmd_name: string,
  cmd_args: string[] = [],
  use_shell: boolean = false,
  options?: { dir?: string; timeoutInMillis?: number },
): Cmd_Result<Std_Streams> {
  const cwd = options?.dir ? path.resolve(options.dir) : undefined;
  const cmd = spawn(cmd_name, cmd_args, { shell: use_shell, cwd });

  if (!cmd.stdout || !cmd.stderr) {
    return { success: false, error: new Error("spawn did not create stdio streams") };
  }
  if (options?.timeoutInMillis) {
    const timer = setTimeout(() => cmd.kill("SIGTERM"), options.timeoutInMillis);
    cmd.on("close", () => clearTimeout(timer));
  }
  return { success: true, data: { stdout: cmd.stdout, stderr: cmd.stderr, process: cmd } };
}

/** Buffered async execution via exec — best for small output. */
export function runCmdAsync(
  cmd: string,
  options?: { dir?: string; timeoutInMillis?: number },
): Promise<Cmd_Result<{ stdout: string; stderr: string }>> {
  return new Promise((resolve) => {
    exec(
      cmd,
      {
        cwd: options?.dir ? path.resolve(options.dir) : undefined,
        timeout: options?.timeoutInMillis,
      },
      (error: Error | null, stdout: string, stderr: string) => {
        if (error) return resolve({ success: false, error });
        resolve({ success: true, data: { stdout: stdout.trim(), stderr: stderr.trim() } });
      },
    );
  });
}

/** Synchronous execution via execSync. Always returns a Cmd_Result (never throws). */
export function runCmdSync(
  cmd: string,
  options?: { dir?: string; timeoutInMillis?: number },
): Cmd_Result<string> {
  try {
    if (typeof cmd !== "string" || cmd.trim() === "") {
      throw new Error("Invalid command: Command must be a non-empty string");
    }
    const cwd = options?.dir ? path.resolve(options.dir) : undefined;
    const output = execSync(cmd, { encoding: "utf-8", cwd, timeout: options?.timeoutInMillis });
    return { success: true, data: output.trim() };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error : new Error(String(error)) };
  }
}

export function isSuccess<T>(result: Cmd_Result<T>): result is { success: true; data: T } {
  return result.success === true;
}
