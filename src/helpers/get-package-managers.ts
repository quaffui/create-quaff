import { exec } from "child_process";
import { promisify } from "util";
import { PackageManager } from "../types.js";

const execPromise = promisify(exec);

async function checkPackageManager(name: PackageManager): Promise<boolean> {
  try {
    await execPromise(`${name} --version`);
    return true;
  } catch {
    return false;
  }
}

export default async function getPackageManagers() {
  const packageManagers: PackageManager[] = ["npm", "yarn", "pnpm"];
  let availablePackageManagers: PackageManager[] = [];

  for (const packageManager of packageManagers) {
    const isAvailable = await checkPackageManager(packageManager);
    if (isAvailable) {
      availablePackageManagers.push(packageManager);
    }
  }

  return availablePackageManagers;
}
