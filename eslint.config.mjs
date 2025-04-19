import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import stylisticTs from '@stylistic/eslint-plugin-ts';

export default defineConfig(
  [
    { files: ["**/*.{js,mjs,cjs,ts}"], plugins: { js }, extends: ["js/recommended"] },
    { files: ["**/*.js"], languageOptions: { sourceType: "script" } },
    { files: ["**/*.{js,mjs,cjs,ts}"], languageOptions: { globals: globals.browser } },
    {
      plugins: {
        '@stylistic/ts': stylisticTs
      },
      rules: {
        "@typescript-eslint/member-ordering": "error",
        "@stylistic/ts/space-before-blocks": "error",
        "@stylistic/ts/quotes": ["error", "single"],
        "@stylistic/ts/key-spacing": "error",
        "@stylistic/ts/semi-spacing": "error",
        "@typescript-eslint/naming-convention":
          [
            "error",
            {
              "selector": "class",
              "format": ["PascalCase"]
            },
            {
              "selector": "classMethod",
              "format": ["camelCase"]
            },
            {
              "selector": "classProperty",
              "modifiers": ["private"],
              "format": ["camelCase"],
              "leadingUnderscore": "require"
            },
            {
              "selector": "classProperty",
              "modifiers": ["public"],
              "format": ["camelCase"]
            },
            {
              "selector": "interface",
              "format": ["PascalCase"]
            },
            {
              "selector": "typeProperty",
              "format": ["camelCase"]
            },
            {
              "selector": "variable",
              "format": ["camelCase"]
            }
          ]
      }
    },
    tseslint.configs.recommended,
  ]);
