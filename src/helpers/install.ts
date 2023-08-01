import { spawn } from "child_process";
import { platform } from "process";
import type { PackageManager } from "../types.js";

const isWin = platform === "win32";

export default async function install(
  projectPath: string,
  packageManager: PackageManager
): Promise<void> {
  const spawnCmd = `${packageManager}${isWin ? ".cmd" : ""}`;
  const args = ["install"];

  console.log(`running ${spawnCmd} ${args.join(" ")}`);

  return new Promise((resolve, reject) => {
    const process = spawn(spawnCmd, args, { cwd: projectPath, stdio: "inherit" });

    process.on("close", (code) => {
      if (code > 0) {
        console.error(`${packageManager} exited with non-zero code`, code);
        reject(new Error("code " + code));
      } else {
        resolve();
      }
    });
  });
}
