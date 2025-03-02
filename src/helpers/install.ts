import { spawn } from "child_process";
import { platform } from "process";
import { access, constants } from "fs/promises";
import type { PackageManager } from "../types.js";

const isWin = platform === "win32";

async function hasCmdWin(spawnCmdWin: string) {
  if (!isWin) {
    return false;
  }

  try {
    await access(spawnCmdWin, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

export default async function install(
  projectPath: string,
  packageManager: PackageManager
): Promise<void> {
  const spawnCmdWin = `${packageManager}.cmd`;
  const useCmdWin = await hasCmdWin(spawnCmdWin);
  const spawnCmd = useCmdWin ? spawnCmdWin : packageManager;

  const args = ["install"];

  console.log(`running ${spawnCmd} ${args.join(" ")}`);

  return new Promise((resolve, reject) => {
    const process = spawn(spawnCmd, args, { cwd: projectPath, stdio: "inherit" });

    process.on("close", (code) => {
      if (typeof code !== "number" || code > 0) {
        console.error(`${packageManager} exited with non-zero code`, code);
        reject(new Error("code " + code));
      } else {
        resolve();
      }
    });
  });
}
