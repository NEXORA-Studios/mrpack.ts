# mrpack.ts

A TypeScript library for handling mrpack files, built with TypeScript, JSZip, and Jest for testing.

## Prerequisites

- Node.js (>=16.x)
- [pnpm](https://pnpm.io/) (>=8.0.0)

## Installation

```bash
# Install dependencies
pnpm install
```

## Scripts

```bash
# Build the project
pnpm run build

# Run tests
pnpm test

# Watch mode for development
pnpm run dev
```

## Project Structure

```
├── src/
│   ├── index.ts         # Main entry point
│   └── __tests__/       # Test files
│       └── index.test.ts # Tests for the main module
├── dist/                # Compiled output
├── package.json         # Project configuration
├── tsconfig.json        # TypeScript configuration
├── jest.config.js       # Jest configuration
├── .npmrc               # pnpm configuration
└── .gitignore           # Files to ignore in Git
```

## Usage

```typescript
import MrPackHandler from 'mrpack.ts';

// Create a new instance
const handler = new MrPackHandler();

// Create a new mrpack file
const packData = await handler.createPack('My Pack', '1.0.0');

// Read an existing mrpack file
const packInfo = await handler.readPack(packData);
console.log(packInfo.name); // 'My Pack'
console.log(packInfo.version); // '1.0.0'
console.log(packInfo.files); // List of files in the pack
```

## Why pnpm?

This project uses pnpm as the package manager because:
- It's faster than npm and Yarn
- It saves disk space with its unique symlinking strategy
- It has better handling of peer dependencies

To learn more about pnpm, visit [pnpm.io](https://pnpm.io/).