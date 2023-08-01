export type PackageManager = "pnpm" | "yarn" | "npm";

export type PackageJson = {
  dependencies: {
    [key: string]: string;
  };
  devDependencies: {
    [key: string]: string;
  };
};
