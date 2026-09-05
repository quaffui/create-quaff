import { cp } from "node:fs/promises";

await cp(
  new URL("./src/commands/add-boilerplate/assets/", import.meta.url),
  new URL("./dist/commands/add-boilerplate/assets/", import.meta.url),
  { recursive: true }
);
