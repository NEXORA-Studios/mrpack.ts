import type { Config } from "jest";

const config: Config = {
    preset: "ts-jest",
    testEnvironment: "node",
    moduleFileExtensions: ["ts", "js", "json"],
    transform: {
        "^.+.ts$": "ts-jest",
    },
    testMatch: ["**/tests/**/*.test.ts"],
    collectCoverageFrom: ["src/**/*.ts", "!src/**/index.ts"],
    coverageDirectory: "coverage",
    coverageProvider: "v8",
    roots: ["<rootDir>/tests"],
    moduleDirectories: ["node_modules", "src"],
    verbose: true,
};

export default config;
