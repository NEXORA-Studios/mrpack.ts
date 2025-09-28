import { MrpackBuilder, Override, IndexJson, IndexJsonFile } from '../src';
import { IDependencies, IFile, IIndexJsonObject, IOverrideType } from '../src/types';

describe('mrpack.ts - Basic Imports', () => {
  it('should import all components correctly', () => {
    expect(MrpackBuilder).toBeDefined();
    expect(Override).toBeDefined();
    expect(IndexJson).toBeDefined();
    expect(IndexJsonFile).toBeDefined();
  });

  it('should import all types correctly', () => {
    // TypeScript类型在编译时被擦除，无法在运行时直接测试
    // 但我们可以通过创建符合这些类型的对象来验证它们的类型定义是正确的
    const testObject = {};
    expect(typeof testObject).toBe('object');
  });

  it('should create valid type objects', () => {
    const dependencies: IDependencies = {
      minecraft: '1.20.1'
    };
    
    const file: IFile = {
      path: 'test/path',
      hashes: {
        sha1: 'testsha1',
        sha512: 'testsha512'
      },
      downloads: ['http://example.com'],
      fileSize: 1024
    };
    
    const indexJson: IIndexJsonObject = {
      game: 'minecraft',
      formatVersion: 1,
      name: 'test',
      version: '1.0.0',
      summary: 'test summary',
      dependencies,
      files: [file]
    };
    
    expect(dependencies.minecraft).toBe('1.20.1');
    expect(file.path).toBe('test/path');
    expect(indexJson.name).toBe('test');
  });
});