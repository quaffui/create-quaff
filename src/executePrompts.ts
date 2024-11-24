import prompts from "prompts";
import getPackageManagers from "./helpers/getPackageManagers.js";
import toKebabCase from "./helpers/toKebabCase.js";
import type { PackageManager } from "./types.js";

const packageManagers = await getPackageManagers();

function exitIfUndefined(val: unknown, code = 1) {
  if (typeof val === "undefined") {
    process.exit(code);
  }
}

export default async function executePrompts() {
  const { projectName } = await prompts({
    type: "text",
    name: "projectName",
    message: "What is the name of your project?",
    initial: "Quaff Project",
    validate: (value) => (!value.trim().length ? `Please specify the name of your project` : true),
  });

  exitIfUndefined(projectName);

  const { projectDir } = await prompts({
    type: "text",
    name: "projectDir",
    message: "Where should your project be created?",
    initial: toKebabCase(projectName),
    validate: (value) =>
      !value.trim().length ? `Please specify the directory of your project` : true,
  });

  exitIfUndefined(projectDir);

  const { language } = await prompts({
    type: "select",
    name: "language",
    message: "Pick a language",
    initial: 0,
    choices: [
      { title: "TypeScript", value: "typescript" },
      { title: "JavaScript (with TS via JSDoc)", value: "checkjs" },
      { title: "JavaScript", value: "javascript" },
    ],
  });

  exitIfUndefined(language);

  const { packageName } = await prompts({
    type: "text",
    name: "packageName",
    message: "Package name (package.json)?",
    initial: projectDir.includes("/") || projectDir.includes("\\") ? "quaff-project" : projectDir,
    validate: (value) =>
      !value.trim().length ? `Please specify the package name of your project` : true,
  });

  exitIfUndefined(packageName);

  const { cssPreprocessor } = await prompts({
    type: "select",
    name: "cssPreprocessor",
    message: "Add a CSS preprocessor?",
    initial: 0,
    choices: [
      { title: "Sass (SCSS)", value: "scss" },
      { title: "Sass (SASS)", value: "sass" },
      { title: "None (CSS)", value: "none" },
    ],
  });

  exitIfUndefined(cssPreprocessor);

  const { optionalFeatures } = await prompts({
    type: "multiselect",
    name: "optionalFeatures",
    message: "Add optional features?",
    initial: 0,
    choices: [
      {
        title: "ESLint & Prettier",
        value: "eslintAndPrettier",
        description: "Checks for code style issues",
      },
    ],
  });

  exitIfUndefined(optionalFeatures);

  let installDependencies: PackageManager | "no" | undefined;

  if (packageManagers.length) {
    const answerInstall = (await prompts({
      type: "select",
      name: "installDependencies",
      message: "Install dependencies now?",
      initial: 0,
      choices: [
        ...packageManagers.map((name) => ({ title: `Yes, use ${name}`, value: name })),
        { title: "No, I'll install them myself", value: "no" },
      ],
    })) as { installDependencies: PackageManager | "no" | undefined };

    exitIfUndefined(answerInstall.installDependencies);

    installDependencies = answerInstall.installDependencies;
  }

  return {
    projectName,
    projectDir,
    language,
    packageName,
    cssPreprocessor,
    optionalFeatures,
    installDependencies,
    packageManagers,
  };
}
