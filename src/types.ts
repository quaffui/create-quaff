export type PackageManager = "pnpm" | "yarn" | "npm" | "bun";

export type PackageJson = {
  dependencies: {
    [key: string]: string;
  };
  devDependencies: {
    [key: string]: string;
  };
};

export enum Packages {
  QUAFF = "@quaffui/quaff",
  SASS = "sass",
  FONTSOURCE_ROBOTO = "@fontsource/roboto",
  MATERIAL_SYMBOLS = "material-symbols",
  SVELTEKIT_AUTOIMPORT = "sveltekit-autoimport",
}
