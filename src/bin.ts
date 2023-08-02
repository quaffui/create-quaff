#!/usr/bin/env node
import executePrompts from "./execute-prompts.js";
import { readFile, writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { create } from "create-svelte";
import getLatestDependencyVersion from "./helpers/get-latest-dependency-version.js";
import install from "./helpers/install.js";
import type { PackageJson } from "./types.js";

const {
  projectDir,
  packageName,
  language,
  cssPreprocessor,
  optionalFeatures,
  installDependencies,
} = await executePrompts();

enum Packages {
  QUAFF = "@quaffui/quaff",
  SASS = "sass",
}

await mkdir(projectDir);

await create(projectDir, {
  name: packageName,
  template: "skeleton",
  types: language === "typescript" ? "typescript" : null,
  prettier: optionalFeatures.includes("eslintAndPrettier"),
  eslint: optionalFeatures.includes("eslintAndPrettier"),
  playwright: false,
  vitest: false,
});

async function addToPackageJson(object: Partial<PackageJson>) {
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

const devDependencies: PackageJson["devDependencies"] = {
  [Packages.QUAFF]: await getLatestDependencyVersion(Packages.QUAFF),
};

if (["scss", "sass"].includes(cssPreprocessor)) {
  devDependencies[Packages.SASS] = await getLatestDependencyVersion(Packages.SASS);
}

await addToPackageJson({
  devDependencies,
});

if (installDependencies && installDependencies !== "no") {
  await install(projectDir, installDependencies);
}
