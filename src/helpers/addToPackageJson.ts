import { join } from "path";
import { readFile, writeFile } from "fs/promises";
import type { PackageJson } from "../types";

export default async function addToPackageJson(projectDir: string, object: Partial<PackageJson>) {
  const packageJsonPath = join(projectDir, "package.json");
  const fileJson = JSON.parse(await readFile(packageJsonPath, "utf8"));

  const dependencies = object.dependencies;
  const devDependencies = object.devDependencies;

  // Object.assign doesn't support deep merging, so we do this manually for dependencies
  if (dependencies) {
    Object.assign(fileJson.dependencies, dependencies);
  }

  if (devDependencies) {
    Object.assign(fileJson.devDependencies, devDependencies);
  }

  // delete these afterwards to not overwrite what we did above
  delete object.dependencies;
  delete object.devDependencies;

  Object.assign(fileJson, object);

  await writeFile(packageJsonPath, JSON.stringify(fileJson, null, 2));
}
