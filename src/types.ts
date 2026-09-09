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
  ESBUILD = "esbuild",
  SVELTEKIT_AUTOIMPORT = "sveltekit-autoimport",
}

export enum PackageVersions {
  SASS = "1.103.1",
  FONTSOURCE_ROBOTO = "5.3.0",
  MATERIAL_SYMBOLS = "0.47.0",
  ESBUILD = "0.28.2",
  SVELTEKIT_AUTOIMPORT = "1.8.2",
}
