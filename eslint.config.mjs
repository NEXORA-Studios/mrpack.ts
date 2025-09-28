import { defineConfig, globalIgnores } from "eslint/config";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
});

export default defineConfig([
    globalIgnores([
        "**/logs",
        "**/*.log",
        "**/npm-debug.log*",
        "**/yarn-debug.log*",
        "**/yarn-error.log*",
        "**/pnpm-debug.log*",
        "**/lerna-debug.log*",
        "**/node_modules",
        "**/.pnp",
        "**/.pnp.js",
        "**/coverage",
        "**/dist",
        "**/build",
        ".vscode/*",
        "!.vscode/extensions.json",
        "**/.idea",
        "**/.DS_Store",
        "**/*.suo",
        "**/*.ntvs*",
        "**/*.njsproj",
        "**/*.sln",
        "**/*.sw?",
        "**/*.tmp",
        "**/*.temp",
        "**/.cache",
        "**/.env",
        "**/.env.local",
        "**/.env.development.local",
        "**/.env.test.local",
        "**/.env.production.local",
        "**/*.test.ts",
        "jest.config.ts",
        "eslint.config.mjs",
    ]),
    {
        extends: compat.extends(
            "eslint:recommended",
            "plugin:@typescript-eslint/recommended",
            "eslint-config-prettier"
        ),

        plugins: {
            "@typescript-eslint": typescriptEslint,
        },

        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.jest,
            },

            parser: tsParser,
            ecmaVersion: "latest",
            sourceType: "module",

            parserOptions: {
                project: "./tsconfig.json",
            },
        },

        rules: {
            "@typescript-eslint/consistent-type-imports": "error",

            "@typescript-eslint/no-unused-vars": [
                "warn",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                },
            ],

            "@typescript-eslint/explicit-module-boundary-types": "off",
            "@typescript-eslint/no-explicit-any": "warn",
            "no-console": "warn",
            "no-debugger": "error",
        },
    },
]);
