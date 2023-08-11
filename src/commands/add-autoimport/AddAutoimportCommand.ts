import getLatestDependencyVersion from "../../helpers/get-latest-dependency-version.js";
import { Packages } from "../../types.js";
import { join } from "path";
import { readFile, writeFile } from "fs/promises";
import { addToPackageJson } from "../../helpers/add-to-package-json";

const quaffComponents = [
  "QAvatar",
  "QBtn",
  "QCard",
  "QCardSection",
  "QCardActions",
  "QCheckbox",
  "QChip",
  "QCodeBlock",
  "QDialog",
  "QDrawer",
  "QFooter",
  "QIcon",
  "QInput",
  "QSelect",
  "QLayout",
  "QList",
  "QItem",
  "QItemSection",
  "QLinearProgress",
  "QRadio",
  "QRailbar",
  "QSeparator",
  "QTabs",
  "QTab",
  "QTable",
  "QToggle",
  "QToolbar",
  "QToolbarTitle",
  "QTooltip",
];

export default class AddAutoimportCommand {
  constructor(
    public projectDir: string,
    public language: string | null
  ) {}

  async execute() {
    await addToPackageJson(this.projectDir, {
      devDependencies: {
        [Packages.SVELTEKIT_AUTOIMPORT]: await getLatestDependencyVersion(
          Packages.SVELTEKIT_AUTOIMPORT
        ),
      },
    });

    await this.addToViteConfig();
  }

  async addToViteConfig() {
    const usesTypescript = this.language === "typescript";
    const filePath = join(this.projectDir, `vite.config.${usesTypescript ? "ts" : "js"}`);

    let contents = await readFile(filePath, "utf8");
    const importStatement = `import autoImport from 'sveltekit-autoimport';`;
    contents = contents.replace(/([\n\s]+export default)/, `\n${importStatement}$1`);

    contents = contents.replace(
      "sveltekit()",
      `
\t\tautoImport({
\t\t\tmodule: {
\t\t\t\t'@quaffui/quaff': [
${quaffComponents.map((name) => `\t\t\t\t'${name}',`).join("\n")}
\t\t\t\t]
\t\t\t}
\t\t}),
\t\tsveltekit()\n\t`
    );

    await writeFile(filePath, contents, "utf8");
  }
}
