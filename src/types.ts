export type PackageManager = "pnpm" | "yarn" | "npm";

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
  FONTSOURCE_MATERIAL_SYMBOLS_OUTLINED = "@fontsource/material-symbols-outlined",
  FONTSOURCE_MATERIAL_SYMBOLS_ROUNDED = "@fontsource/material-symbols-rounded",
  FONTSOURCE_MATERIAL_SYMBOLS_SHARP = "@fontsource/material-symbols-sharp",
  FONTSOURCE_ROBOTO = "@fontsource/roboto",
  SVELTEKIT_AUTOIMPORT = "sveltekit-autoimport",
}
