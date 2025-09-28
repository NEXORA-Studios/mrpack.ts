# mrpack.ts

A TypeScript library for handling mrpack files (Modrinth mod packs) with ESM support.

## Features

- Create mrpack files programmatically
- Manage mod pack metadata (name, version, summary, dependencies)
- Add files and overrides to mod packs
- Support for JSON, TOML, string, and buffer content types

## Prerequisites

- Node.js (>=16.x)
- [pnpm](https://pnpm.io/) (>=8.0.0) or other package managers

## Installation

```bash
# Using npm
npm install mrpack.ts

# Using pnpm
pnpm add mrpack.ts

# Using yarn
yarn add mrpack.ts
```

## Dependencies

- [jszip](https://www.npmjs.com/package/jszip) - For creating ZIP files
- [@iarna/toml](https://www.npmjs.com/package/@iarna/toml) - For handling TOML files (peer dependency)

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
│   ├── components/      # Reusable components
│   │   ├── IndexJson.ts     # Mod pack metadata handling
│   │   ├── IndexJsonFile.ts # File entry in mod pack index
│   │   ├── Override.ts      # Override file handling
│   │   └── index.ts         # Component exports
│   ├── lib/             # Core library functionality
│   │   └── mrpack/          # mrpack-specific code
│   ├── types/           # Type definitions
│   └── index.ts         # Main entry point
├── dist/                # Compiled output
├── package.json         # Project configuration
├── tsconfig.json        # TypeScript configuration
├── jest.config.js       # Jest configuration
├── .npmrc               # pnpm configuration
└── .gitignore           # Files to ignore in Git
```

## Usage

### Basic Example

```typescript
import { MrpackBuilder, IndexJson, IndexJsonFile, Override } from 'mrpack.ts';

// Create index metadata
const indexJson = new IndexJson(
  'My Mod Pack',
  '1.0.0',
  { minecraft: '1.19.2', 'fabric-loader': '0.14.9' },
  'A cool mod pack'
);

// Add a file to the index
const modFile = new IndexJsonFile(
  'mods/modid-1.0.0.jar',
  'sha1hash',
  'sha512hash',
  123456 // file size in bytes
);
modFile.addDownloadUri('https://example.com/mods/modid-1.0.0.jar');
indexJson.addFile(modFile);

// Create a builder with the index
const builder = new MrpackBuilder(indexJson.marshaledJson);

// Add an override file
const configOverride = new Override('config/config.json', 'json');
configOverride.content = { setting1: 'value1', setting2: 'value2' };
builder.addOverride(configOverride);

// Build the mrpack file
const mrpackBuffer = await builder.build();

// Now you can write mrpackBuffer to a file
```

### Components

#### IndexJson
Used to create and manage the mod pack metadata.

```typescript
const indexJson = new IndexJson(name, version, dependencies, summary?);
indexJson.addFile(file);
const marshaled = indexJson.marshaledJson;
```

#### IndexJsonFile
Represents a file in the mod pack index.

```typescript
const file = new IndexJsonFile(path, sha1, sha512, fileSize);
file.addDownloadUri(uri);
const marshaled = file.marshaledJson;
```

#### Override
Represents a file to be included directly in the mod pack.

```typescript
const override = new Override(filePath, fileType); // fileType can be 'json', 'toml', 'string', or 'buffer'
override.content = content;
```

#### MrpackBuilder
Builds the final mrpack file.

```typescript
const builder = new MrpackBuilder(indexJson);
builder.addOverride(override);
const buffer = await builder.build();
```

## TypeScript Support

This library is written in TypeScript and includes type definitions.

## License

AGPL-3.0-only

## Author

MoYuan-CN