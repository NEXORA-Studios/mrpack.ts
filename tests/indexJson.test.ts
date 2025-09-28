import { IndexJson, IndexJsonFile } from '../src/components';

describe('IndexJson Class', () => {
  describe('constructor and basic properties', () => {
    it('should create IndexJson instance with correct properties', () => {
      const dependencies = {
        minecraft: '1.20.1'
      };
      
      const indexJson = new IndexJson('Test Modpack', '1.0.0', dependencies, 'Test summary');
      
      try {
        // 尝试获取marshaledJson会失败，因为没有添加文件
        indexJson.marshaledJson;
        fail('Should have thrown an error');
      } catch (error) {
        if (error instanceof Error) {
          expect(error.message).toBe('No files have been added to the index');
        }
      }
    });

    it('should use default summary when not provided', () => {
      const dependencies = {
        minecraft: '1.20.1'
      };
      
      const indexJson = new IndexJson('Test Modpack', '1.0.0', dependencies);
      
      // 创建一个临时文件来获取marshaledJson
      const file = new IndexJsonFile(
        'mods/test.jar',
        'sha1',
        'sha512',
        1024
      );
      file.addDownloadUri('http://example.com');
      indexJson.addFile(file);
      
      const marshaledJson = indexJson.marshaledJson;
      expect(marshaledJson.summary).toBe('1.20.1');
    });
  });

  describe('constructor validation', () => {
    it('should throw error for invalid name parameter', () => {
      const dependencies = {
        minecraft: '1.20.1'
      };
      
      expect(() => new IndexJson('', '1.0.0', dependencies)).toThrow('Name must be a non-empty string');
      expect(() => new IndexJson(undefined as any, '1.0.0', dependencies)).toThrow('Name must be a non-empty string');
      expect(() => new IndexJson(null as any, '1.0.0', dependencies)).toThrow('Name must be a non-empty string');
      expect(() => new IndexJson(123 as any, '1.0.0', dependencies)).toThrow('Name must be a non-empty string');
    });

    it('should throw error for invalid version parameter', () => {
      const dependencies = {
        minecraft: '1.20.1'
      };
      
      expect(() => new IndexJson('Test', '', dependencies)).toThrow('Version must be a non-empty string');
      expect(() => new IndexJson('Test', undefined as any, dependencies)).toThrow('Version must be a non-empty string');
      expect(() => new IndexJson('Test', null as any, dependencies)).toThrow('Version must be a non-empty string');
      expect(() => new IndexJson('Test', 123 as any, dependencies)).toThrow('Version must be a non-empty string');
    });
  });

  describe('dependency validation', () => {
    it('should throw error for empty dependencies', () => {
      const dependencies = {};
      
      expect(() => new IndexJson('Test', '1.0.0', dependencies as any)).toThrow('Cannot have empty dependencies!');
    });

    it('should throw error for missing minecraft dependency', () => {
      const dependencies = {
        'fabric-loader': '0.14.9'
      };
      
      expect(() => new IndexJson('Test', '1.0.0', dependencies as any)).toThrow('Cannot have no minecraft dependency!');
    });

    it('should throw error for multiple loader dependencies', () => {
      const dependencies = {
        minecraft: '1.20.1',
        'fabric-loader': '0.14.9',
        forge: '46.0.1'
      };
      
      expect(() => new IndexJson('Test', '1.0.0', dependencies)).toThrow('Cannot have more than one loader dependency!');
    });

    it('should throw error for both neo-forge and neoforge dependencies', () => {
      const dependencies = {
        minecraft: '1.20.1',
        'neo-forge': '46.0.1',
        neoforge: '46.0.1'
      };
      
      expect(() => new IndexJson('Test', '1.0.0', dependencies)).toThrow('Cannot have both neo-forge and neoforge dependencies! Use only one of them.');
    });
  });

  describe('addFile method', () => {
    it('should add IndexJsonFile correctly', () => {
      const dependencies = {
        minecraft: '1.20.1'
      };
      const indexJson = new IndexJson('Test Modpack', '1.0.0', dependencies);
      
      const file = new IndexJsonFile(
        'mods/test.jar',
        'sha1',
        'sha512',
        1024
      );
      file.addDownloadUri('http://example.com');
      
      indexJson.addFile(file);
      
      const marshaledJson = indexJson.marshaledJson;
      expect(marshaledJson.files.length).toBe(1);
      expect(marshaledJson.files[0].path).toBe('mods/test.jar');
    });

    it('should throw error for invalid file parameter', () => {
      const dependencies = {
        minecraft: '1.20.1'
      };
      const indexJson = new IndexJson('Test Modpack', '1.0.0', dependencies);
      
      expect(() => indexJson.addFile(undefined as any)).toThrow('File must be an instance of IndexJsonFile');
      expect(() => indexJson.addFile(null as any)).toThrow('File must be an instance of IndexJsonFile');
      expect(() => indexJson.addFile({} as any)).toThrow('File must be an instance of IndexJsonFile');
    });

    it('should add multiple files correctly', () => {
      const dependencies = {
        minecraft: '1.20.1'
      };
      const indexJson = new IndexJson('Test Modpack', '1.0.0', dependencies);
      
      const file1 = new IndexJsonFile('mods/test1.jar', 'sha1-1', 'sha512-1', 1024);
      file1.addDownloadUri('http://example.com/1');
      
      const file2 = new IndexJsonFile('mods/test2.jar', 'sha1-2', 'sha512-2', 2048);
      file2.addDownloadUri('http://example.com/2');
      
      indexJson.addFile(file1);
      indexJson.addFile(file2);
      
      const marshaledJson = indexJson.marshaledJson;
      expect(marshaledJson.files.length).toBe(2);
      expect(marshaledJson.files[0].path).toBe('mods/test1.jar');
      expect(marshaledJson.files[1].path).toBe('mods/test2.jar');
    });
  });

  describe('marshaledJson getter', () => {
    it('should return complete index JSON object when files are added', () => {
      const dependencies = {
        minecraft: '1.20.1'
      };
      const indexJson = new IndexJson('Test Modpack', '1.0.0', dependencies, 'Test summary');
      
      const file = new IndexJsonFile(
        'mods/test.jar',
        'sha1',
        'sha512',
        1024
      );
      file.addDownloadUri('http://example.com');
      
      indexJson.addFile(file);
      
      const marshaledJson = indexJson.marshaledJson;
      
      expect(marshaledJson.game).toBe('minecraft');
      expect(marshaledJson.formatVersion).toBe(1);
      expect(marshaledJson.name).toBe('Test Modpack');
      expect(marshaledJson.version).toBe('1.0.0');
      expect(marshaledJson.summary).toBe('Test summary');
      expect(marshaledJson.dependencies).toEqual(dependencies);
      expect(marshaledJson.files.length).toBe(1);
    });

    it('should throw error when no files are added', () => {
      const dependencies = {
        minecraft: '1.20.1'
      };
      const indexJson = new IndexJson('Test Modpack', '1.0.0', dependencies);
      
      expect(() => indexJson.marshaledJson).toThrow('No files have been added to the index');
    });
  });
});