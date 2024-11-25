import { join } from "path";
import { readFile, writeFile, copyFile } from "fs/promises";
import mustache from "mustache";
import mkdirp from "../../helpers/mkdirp.js";
import { Packages } from "../../types.js";

enum BoilerplateFiles {
  APP = "src/app.html",
  LAYOUT = "src/routes/+layout.svelte",
  PAGE = "src/routes/+page.svelte",
  FAVICON = "static/favicon.png",
  AUTOIMPORT_TYPES = "src/sveltekit-autoimport.d.ts",
}

enum BoilerplateTemplateFiles {
  LAYOUT = "assets/+layout.svelte.tpl",
  PAGE = "assets/+page.svelte.tpl",
  FAVICON = "assets/favicon.png",
  AUTOIMPORT_TYPES = "assets/sveltekit-autoimport.d.ts.tpl",
}

export default class AddBoilerplateCommand {
  constructor(
    public projectDir: string,
    public projectName: string,
    public cssPreprocessor: string
  ) {}

  get styleExtension() {
    return ["scss", "sass"].includes(this.cssPreprocessor) ? this.cssPreprocessor : "css";
  }

  async readProjectFile(relativePath: string) {
    return await readFile(this.getProjectPath(relativePath), "utf8");
  }

  async writeProjectFile(relativePath: string, contents: string) {
    return await writeFile(this.getProjectPath(relativePath), contents, "utf8");
  }

  getProjectPath(relativePath: string) {
    return join(this.projectDir, relativePath);
  }

  async execute() {
    await this.addLightClassToApp();

    await this.createPage();

    await this.createLayout();

    await this.createStyles();

    await this.copyFavicon();

    await this.createAutoimportTypes();
  }

  async addLightClassToApp() {
    const appContents = await this.readProjectFile(BoilerplateFiles.APP);
    await this.writeProjectFile(
      BoilerplateFiles.APP,
      appContents.replace(
        '<body data-sveltekit-preload-data="hover">',
        '<body data-sveltekit-preload-data="hover" class="body--light">'
      )
    );
  }

  async createPage() {
    const pageTemplate = await readFile(
      new URL(BoilerplateTemplateFiles.PAGE, import.meta.url),
      "utf8"
    );

    // Page has no template vars yet
    const pageRendered = mustache.render(pageTemplate, {});

    await this.writeProjectFile(BoilerplateFiles.PAGE, pageRendered);
  }

  async createLayout() {
    const layoutTemplate = await readFile(
      new URL(BoilerplateTemplateFiles.LAYOUT, import.meta.url),
      "utf8"
    );

    const layoutRendered = mustache.render(layoutTemplate, {
      projectName: this.projectName,
      styleExtension: this.styleExtension,
    });

    await this.writeProjectFile(BoilerplateFiles.LAYOUT, layoutRendered);
  }

  async createStyles() {
    const stylesPath = this.getProjectPath("src/styles");

    await mkdirp(stylesPath);

    const styleImports = ["@quaffui/quaff/css/index.css", Packages.FONTSOURCE_ROBOTO];

    const mapStyle =
      this.styleExtension === "sass"
        ? (name: string) => `@use ${name}`
        : (name: string) => `@use "${name}";`;

    const fontFaces = ["Outlined", "Rounded", "Sharp"]
      .map(
        (name: string) => `
@font-face {
  font-family: "Material Symbols ${name}";
  src: url("material-symbols/material-symbols-${name.toLowerCase()}.woff2") format("woff2");

  font-style: normal;
  font-weight: 100 700;
  font-display: block;
}`
      )
      .join("\n");

    const contents = styleImports.map(mapStyle).join("\n") + "\n" + fontFaces + "\n";

    await this.writeProjectFile(`src/styles/app.${this.styleExtension}`, contents);
  }

  async copyFavicon() {
    await copyFile(
      new URL(BoilerplateTemplateFiles.FAVICON, import.meta.url),
      this.getProjectPath(BoilerplateFiles.FAVICON)
    );
  }

  async createAutoimportTypes() {
    // no render needed; only using .tpl to avoid issues with .d.ts in this project
    await copyFile(
      new URL(BoilerplateTemplateFiles.AUTOIMPORT_TYPES, import.meta.url),
      this.getProjectPath(BoilerplateFiles.AUTOIMPORT_TYPES)
    );
  }
}
