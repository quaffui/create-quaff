#!/usr/bin/env node
import executePrompts from "./execute-prompts.js";
import { mkdir } from "fs/promises";
import { create } from "create-svelte";
import getLatestDependencyVersion from "./helpers/get-latest-dependency-version.js";
import install from "./helpers/install.js";
import { Packages } from "./types.js";
import AddAutoimportCommand from "./commands/add-autoimport/AddAutoimportCommand.js";
import { addToPackageJson } from "./helpers/add-to-package-json";
import type { PackageJson } from "./types.js";

const {
  projectDir,
  packageName,
  language,
  cssPreprocessor,
  optionalFeatures,
  installDependencies,
} = await executePrompts();

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

const devDependencies: PackageJson["devDependencies"] = {
  [Packages.QUAFF]: await getLatestDependencyVersion(Packages.QUAFF),
  [Packages.FONTSOURCE_MATERIAL_SYMBOLS_OUTLINED]: await getLatestDependencyVersion(
    Packages.FONTSOURCE_MATERIAL_SYMBOLS_OUTLINED
  ),
  [Packages.FONTSOURCE_MATERIAL_SYMBOLS_ROUNDED]: await getLatestDependencyVersion(
    Packages.FONTSOURCE_MATERIAL_SYMBOLS_ROUNDED
  ),
  [Packages.FONTSOURCE_MATERIAL_SYMBOLS_SHARP]: await getLatestDependencyVersion(
    Packages.FONTSOURCE_MATERIAL_SYMBOLS_SHARP
  ),
  [Packages.FONTSOURCE_ROBOTO]: await getLatestDependencyVersion(Packages.FONTSOURCE_ROBOTO),
};

if (["scss", "sass"].includes(cssPreprocessor)) {
  devDependencies[Packages.SASS] = await getLatestDependencyVersion(Packages.SASS);
}

await addToPackageJson(projectDir, {
  devDependencies,
});

const addAutoimportCommand = new AddAutoimportCommand(projectDir, language);

await addAutoimportCommand.execute();

if (installDependencies && installDependencies !== "no") {
  await install(projectDir, installDependencies);
}
