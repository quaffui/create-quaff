import path from "path";
import { fileURLToPath } from "url";
import js from "@eslint/js";
import typescriptParser from "@typescript-eslint/parser";
import eslintPluginTypescript from "@typescript-eslint/eslint-plugin";
import eslintPluginUnicorn from "eslint-plugin-unicorn";
import eslintPluginImport from "eslint-plugin-import-x";
import eslintConfigPrettier from "eslint-config-prettier";
import globals from "globals";
// compat stuff: https://eslint.org/docs/latest/use/configure/migration-guide#using-eslintrc-configs-in-flat-config
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  // global ignores: https://eslint.org/docs/latest/use/configure/ignore#ignoring-files
  {
    ignores: [
      "node_modules/",
      "dist/",
      "pnpm-lock.yaml",
      "package-lock.json",
      "yarn.lock",
      ".DS_Store",
    ],
  },
  // configs to extend
  js.configs.recommended,
  ...compat.extends("plugin:@typescript-eslint/recommended"),
  eslintConfigPrettier,
  // our config
  {
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        sourceType: "module",
        ecmaVersion: 2020,
      },
      globals: {
        ...globals.es2017,
        ...globals.node,
      },
    },
    plugins: {
      "@typescript-eslint": eslintPluginTypescript,
      unicorn: eslintPluginUnicorn,
      import: eslintPluginImport,
    },
    rules: {
      "unicorn/filename-case": [
        "error",
        {
          cases: {
            camelCase: true,
            pascalCase: true,
          },
          ignore: ["\\.shim\\.d\\.ts$"],
        },
      ],
      curly: ["error"],
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
            "object",
            "type",
          ],
        },
      ],
      "no-undef": ["off"],
      "object-shorthand": "error",
      "@typescript-eslint/consistent-type-imports": "error",
    },
  },
];
