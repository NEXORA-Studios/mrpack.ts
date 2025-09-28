import { MrpackBuilder } from '../src/lib/mrpack/Builder';
import { Override } from '../src/components';
import { IIndexJsonObject } from '../src/types';
import JSZip from 'jszip';

describe('MrpackBuilder Class', () => {
  let mockIndexJson: IIndexJsonObject;
  let mockOverride1: Override;
  let mockOverride2: Override;

  beforeEach(() => {
    mockIndexJson = {
      game: 'minecraft',
      formatVersion: 1,
      name: 'Test Modpack',
      version: '1.0.0',
      summary: 'Test summary',
      dependencies: {
        minecraft: '1.20.1'
      },
      files: []
    };

    mockOverride1 = new Override('overrides/config/test.cfg', 'string');
    mockOverride1.content = 'test config content';

    mockOverride2 = new Override('overrides/scripts/test.js', 'string');
    mockOverride2.content = 'console.log("test");';
  });

  describe('constructor and basic properties', () => {
    it('should create MrpackBuilder instance with correct properties', () => {
      const builder = new MrpackBuilder(mockIndexJson);
      // 无法直接访问私有属性，但我们可以通过build方法间接验证
      expect(builder).toBeInstanceOf(MrpackBuilder);
    });
  });

  describe('addOverride method', () => {
    it('should add override correctly', () => {
      const builder = new MrpackBuilder(mockIndexJson);
      builder.addOverride(mockOverride1);
      // 无法直接验证是否添加成功，但build方法会使用这些overrides
    });

    it('should add multiple overrides correctly', () => {
      const builder = new MrpackBuilder(mockIndexJson);
      builder.addOverride(mockOverride1);
      builder.addOverride(mockOverride2);
      // 无法直接验证是否添加成功，但build方法会使用这些overrides
    });
  });

  describe('build method', () => {
    it('should create zip file with index.json correctly', async () => {
      const builder = new MrpackBuilder(mockIndexJson);
      
      try {
        const zipBuffer = await builder.build();
        expect(zipBuffer).toBeInstanceOf(Buffer);
        
        // 解压并验证内容
        const zip = await JSZip.loadAsync(zipBuffer);
        const indexJsonContent = await zip.file('modrinth.index.json')?.async('string') || '';
        const parsedIndexJson = JSON.parse(indexJsonContent);
        
        expect(parsedIndexJson).toEqual(mockIndexJson);
      } catch (error) {
        fail(`build method threw an error: ${error instanceof Error ? error.message : String(error)}`);
      }
    });

    it('should create zip file with overrides correctly', async () => {
      const builder = new MrpackBuilder(mockIndexJson);
      builder.addOverride(mockOverride1);
      
      try {
        const zipBuffer = await builder.build();
        const zip = await JSZip.loadAsync(zipBuffer);
        
        // 验证index.json存在
        const indexJsonExists = !!zip.file('modrinth.index.json');
        expect(indexJsonExists).toBe(true);
        
        // 验证override文件存在
        const overrideContent = await zip.file('overrides/config/test.cfg')?.async('string') || '';
        expect(overrideContent).toBe('test config content');
      } catch (error) {
        fail(`build method threw an error: ${error instanceof Error ? error.message : String(error)}`);
      }
    });

    it('should create zip file with multiple overrides correctly', async () => {
      const builder = new MrpackBuilder(mockIndexJson);
      builder.addOverride(mockOverride1);
      builder.addOverride(mockOverride2);
      
      try {
        const zipBuffer = await builder.build();
        const zip = await JSZip.loadAsync(zipBuffer);
        
        // 验证两个override文件都存在
        const override1Content = await zip.file('overrides/config/test.cfg')?.async('string') || '';
        const override2Content = await zip.file('overrides/scripts/test.js')?.async('string') || '';
        
        expect(override1Content).toBe('test config content');
        expect(override2Content).toBe('console.log("test");');
      } catch (error) {
        fail(`build method threw an error: ${error instanceof Error ? error.message : String(error)}`);
      }
    });

    it('should handle different types of override content', async () => {
      const jsonOverride = new Override('overrides/config/settings.json', 'json');
      jsonOverride.content = { setting1: 'value1', setting2: 123 };
      
      const bufferOverride = new Override('overrides/textures/test.png', 'buffer');
      bufferOverride.content = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]); // PNG文件头
      
      const builder = new MrpackBuilder(mockIndexJson);
      builder.addOverride(jsonOverride);
      builder.addOverride(bufferOverride);
      
      try {
        const zipBuffer = await builder.build();
        const zip = await JSZip.loadAsync(zipBuffer);
        
        // 验证JSON文件内容
        const jsonContent = await zip.file('overrides/config/settings.json')?.async('string') || '';
        expect(JSON.parse(jsonContent)).toEqual({ setting1: 'value1', setting2: 123 });
        
        // 验证Buffer文件内容
        const bufferContent = await zip.file('overrides/textures/test.png')?.async('nodebuffer') || Buffer.from([]);
        expect(bufferContent.slice(0, 8)).toEqual(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
      } catch (error) {
        fail(`build method threw an error: ${error instanceof Error ? error.message : String(error)}`);
      }
    });

    it('should handle complex index.json structures', async () => {
      const complexIndexJson: IIndexJsonObject = {
        game: 'minecraft',
        formatVersion: 1,
        name: 'Complex Modpack',
        version: '2.1.3',
        summary: 'A complex modpack with many dependencies and files',
        dependencies: {
          minecraft: '1.20.1',
          'fabric-loader': '0.14.22'
        },
        files: [
          {
            path: 'mods/mod1.jar',
            hashes: {
              sha1: 'abc123',
              sha512: 'def456'
            },
            downloads: ['https://example.com/mod1.jar'],
            fileSize: 1000000
          },
          {
            path: 'mods/mod2.jar',
            hashes: {
              sha1: 'ghi789',
              sha512: 'jkl012'
            },
            downloads: ['https://example.com/mod2.jar'],
            fileSize: 2000000
          }
        ]
      };
      
      const builder = new MrpackBuilder(complexIndexJson);
      
      try {
        const zipBuffer = await builder.build();
        const zip = await JSZip.loadAsync(zipBuffer);
        
        // 验证复杂的index.json内容
        const indexJsonContent = await zip.file('modrinth.index.json')?.async('string') || '';
        const parsedIndexJson = JSON.parse(indexJsonContent);
        
        expect(parsedIndexJson).toEqual(complexIndexJson);
        expect(parsedIndexJson.files.length).toBe(2);
        expect(parsedIndexJson.dependencies['fabric-loader']).toBe('0.14.22');
      } catch (error) {
        fail(`build method threw an error: ${error instanceof Error ? error.message : String(error)}`);
      }
    });
  });
});