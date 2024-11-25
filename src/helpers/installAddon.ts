import { spawn } from "child_process";
import type { SpawnOptions } from "child_process";
import type { PackageManager } from "../types";

export default async function installAddon(
  addon: "eslint" | "prettier",
  packageManager: PackageManager,
  projectDir: string
) {
  const cmdAndArgs = ["sv", "add", addon];

  if (packageManager === "bun") {
    cmdAndArgs.unshift("bunx");
  }

  if (packageManager === "pnpm") {
    cmdAndArgs.unshift("pnpm", "dlx");
  }

  if (["npm", "yarn"].includes(packageManager)) {
    cmdAndArgs.unshift("npx");
  }

  cmdAndArgs.push("--no-preconditions", "--no-install");

  return await runCmdAndAssertSuccess(cmdAndArgs[0], cmdAndArgs.slice(1), projectDir);
}

function runCmdAndAssertSuccess(cmd: string, args: string[], cwd: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const options: SpawnOptions = {
      env: {
        ...process.env,
      },
      stdio: "inherit",
      cwd,
    };

    const child = spawn(cmd, args, options);

    child.on("error", reject);

    child.on("exit", (code: number) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Process exited with code: ${code}`));
      }
    });
  });
}
