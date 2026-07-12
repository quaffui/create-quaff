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

export enum PackageVersions {
  SASS = "1.101.0",
  FONTSOURCE_ROBOTO = "5.2.10",
  MATERIAL_SYMBOLS = "0.45.6",
  SVELTEKIT_AUTOIMPORT = "1.8.2",
}
