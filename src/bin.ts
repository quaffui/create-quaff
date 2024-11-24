#!/usr/bin/env node
import { mkdir } from "fs/promises";
import { create } from "sv";
import executePrompts from "./executePrompts.js";
import getLatestDependencyVersion from "./helpers/getLatestDependencyVersion.js";
import install from "./helpers/install.js";
import { Packages } from "./types.js";
import AddAutoimportCommand from "./commands/add-autoimport/AddAutoimportCommand.js";
import AddBoilerplateCommand from "./commands/add-boilerplate/AddBoilerplateCommand.js";
import addToPackageJson from "./helpers/addToPackageJson.js";
import getPackageManagers from "./helpers/getPackageManagers.js";
import installAddon from "./helpers/installAddon.js";
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

function getTypes(language: string) {
  if (["typescript", "checkjs"].includes(language)) {
    return language;
  }

  return "none";
}

async function getPackageManagerForAddons() {
  const packageManagerForAddons =
    installDependencies !== "no" ? installDependencies : (await getPackageManagers())[0];

  if (optionalFeatures.length && !packageManagerForAddons) {
    throw new Error("Could not find a package manager (e.g. bun, npm) installed on your system");
  }

  return packageManagerForAddons;
}

// call before "create", to not create an incomplete project
const packageManagerForAddons = await getPackageManagerForAddons();

await create(projectDir, {
  name: packageName,
  template: "minimal",
  types: getTypes(language),
});

// until we know what the programmatic call to "sv" is
if (optionalFeatures.includes("eslintAndPrettier")) {
  await installAddon("eslint", packageManagerForAddons, projectDir);
  await installAddon("prettier", packageManagerForAddons, projectDir);
}

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
