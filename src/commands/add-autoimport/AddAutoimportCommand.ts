import { join } from "path";
import { readFile, writeFile } from "fs/promises";
import { Packages, PackageVersions } from "../../types.js";
import addToPackageJson from "../../helpers/addToPackageJson.js";
import pathExists from "../../helpers/pathExists.js";
import mkdirp from "../../helpers/mkdirp.js";

export default class AddAutoimportCommand {
  constructor(
    public projectDir: string,
    public language: string | null,
    public shouldPruneCss: boolean,
    public shouldPruneIcons: boolean
  ) {}

  get usesTypescript() {
    return this.language === "typescript";
  }

  async execute() {
    await addToPackageJson(this.projectDir, {
      devDependencies: {
        [Packages.SVELTEKIT_AUTOIMPORT]: PackageVersions.SVELTEKIT_AUTOIMPORT,
      },
    });

    await this.addToViteConfig();

    if (this.usesTypescript) {
      await this.addTypescriptDeclarations();
      await this.addTypescriptVscodeSettings();
    }
  }

  async addToViteConfig() {
    const filePath = join(this.projectDir, `vite.config.${this.usesTypescript ? "ts" : "js"}`);

    let contents = await readFile(filePath, "utf8");
    const importStatements = `import autoImport from 'sveltekit-autoimport';
import { QUAFF_COMPONENT_NAMES } from '@quaffui/quaff/auto-imports';
import { quaffAssets } from '@quaffui/quaff/plugins/assets';`;
    const pluginConfig = `autoImport({
\t\t\tconfigFile: false,
\t\t\tmodule: {
\t\t\t\t'@quaffui/quaff': QUAFF_COMPONENT_NAMES,
\t\t\t}
\t\t}),
\t\tquaffAssets({
\t\t\tcss: {
\t\t\t\tstripUnused: ${this.shouldPruneCss},
\t\t\t\t// Add class names from runtime data that aren't present in your source.
\t\t\t\tsafelist: [],
\t\t\t},
\t\t\tfonts: {
\t\t\t\troboto: { formats: ['woff2'] },
\t\t\t\ticons: {
\t\t\t\t\tstripUnused: ${this.shouldPruneIcons},
\t\t\t\t\t// Add icon names from runtime data that aren't present in your source.
\t\t\t\t\tsafelist: [],
\t\t\t\t},
\t\t\t},
\t\t}),`;

    contents = contents.replace(/([\n\s]+export default)/, `\n${importStatements}$1`);
    contents = contents.replace(/(\n\s*)sveltekit\(/, `$1${pluginConfig}$1sveltekit(`);

    await writeFile(filePath, contents, "utf8");
  }

  async addTypescriptDeclarations() {
    await writeFile(
      join(this.projectDir, "src", "auto-imports.d.ts"),
      "import '@quaffui/quaff/auto-imports/globals';\n",
      "utf8"
    );
  }

  async addTypescriptVscodeSettings() {
    const vscodeDir = join(this.projectDir, ".vscode");
    await mkdirp(vscodeDir);
    const vscodeSettingsPath = join(vscodeDir, "settings.json");

    const contents = (await this.tryReadJsonFile(vscodeSettingsPath)) || {};

    contents["svelte.plugin.svelte.compilerWarnings"] = {
      "missing-declaration": "ignore",
    };

    const contentsJson = JSON.stringify(contents, null, 2) + "\n";

    await writeFile(vscodeSettingsPath, contentsJson, "utf8");
  }

  async tryReadJsonFile(filePath: string) {
    try {
      if (!(await pathExists(filePath))) {
        return {};
      }

      const contentsRaw = await readFile(filePath, "utf8");
      return JSON.parse(contentsRaw) || {};
    } catch {
      return {};
    }
  }
}
