#!/usr/bin/env node
import { mkdir } from "fs/promises";
import { create } from "create-svelte";
import executePrompts from "./executePrompts.js";
import getLatestDependencyVersion from "./helpers/getLatestDependencyVersion.js";
import install from "./helpers/install.js";
import { Packages } from "./types.js";
import AddAutoimportCommand from "./commands/add-autoimport/AddAutoimportCommand.js";
import AddBoilerplateCommand from "./commands/add-boilerplate/AddBoilerplateCommand.js";
import addToPackageJson from "./helpers/addToPackageJson.js";
import type { PackageJson } from "./types.js";

const {
  projectName,
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
  svelte5: true,
});

const devDependencies: PackageJson["devDependencies"] = {
  [Packages.QUAFF]: await getLatestDependencyVersion(Packages.QUAFF),
  [Packages.MATERIAL_SYMBOLS]: await getLatestDependencyVersion(Packages.MATERIAL_SYMBOLS),
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

const addBoilerplateCommand = new AddBoilerplateCommand(projectDir, projectName, cssPreprocessor);

await addBoilerplateCommand.execute();

if (installDependencies && installDependencies !== "no") {
  await install(projectDir, installDependencies);
}
