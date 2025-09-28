import { MrpackBuilder, IndexJson, IndexJsonFile, Override } from '../src';
import JSZip from 'jszip';

describe('mrpack.ts - Integration Tests', () => {
  describe('Complete Workflow', () => {
    it('should create a complete mrpack file from scratch', async () => {
      // 1. 创建索引JSON
      const dependencies = {
        minecraft: '1.20.1'
      };
      
      const indexJson = new IndexJson(
        'Integration Test Modpack',
        '1.0.0',
        dependencies,
        'A test modpack for integration testing'
      );
      
      // 2. 添加文件到索引JSON
      const modFile = new IndexJsonFile(
        'mods/test-mod.jar',
        '7c9f7e6a5b3c1d2e4f8a9b0c1d2e3f4a5b6c7d8e',
        'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8',
        1048576
      );
      modFile.addDownloadUri('https://example.com/mods/test-mod.jar');
      
      const resourceFile = new IndexJsonFile(
        'resourcepacks/test-resourcepack.zip',
        '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
        'b1a2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8',
        2097152
      );
      resourceFile.addDownloadUri('https://example.com/resourcepacks/test-resourcepack.zip');
      
      indexJson.addFile(modFile);
      indexJson.addFile(resourceFile);
      
      // 3. 创建覆盖文件
      const configOverride = new Override('overrides/config/test-config.json', 'json');
      configOverride.content = {
        enabled: true,
        settings: {
          difficulty: 'easy',
          gamemode: 'survival'
        }
      };
      
      const scriptOverride = new Override('overrides/scripts/custom.js', 'string');
      scriptOverride.content = `// Custom script
console.log('Modpack loaded successfully!');
`;
      
      // 4. 创建并配置MrpackBuilder
      const builder = new MrpackBuilder(indexJson.marshaledJson);
      builder.addOverride(configOverride);
      builder.addOverride(scriptOverride);
      
      // 5. 构建mrpack文件
      const mrpackBuffer = await builder.build();
      
      // 6. 验证生成的zip文件
      const zip = await JSZip.loadAsync(mrpackBuffer);
      
      // 6.1 验证modrinth.index.json存在且内容正确
      const indexJsonContent = await zip.file('modrinth.index.json')?.async('string') || '';
      const parsedIndexJson = JSON.parse(indexJsonContent);
      
      expect(parsedIndexJson.name).toBe('Integration Test Modpack');
      expect(parsedIndexJson.version).toBe('1.0.0');
      expect(parsedIndexJson.dependencies).toEqual(dependencies);
      expect(parsedIndexJson.files.length).toBe(2);
      
      // 6.2 验证覆盖文件存在且内容正确
      const configContent = await zip.file('overrides/config/test-config.json')?.async('string') || '';
      const parsedConfig = JSON.parse(configContent);
      
      expect(parsedConfig.enabled).toBe(true);
      expect(parsedConfig.settings.difficulty).toBe('easy');
      
      const scriptContent = await zip.file('overrides/scripts/custom.js')?.async('string') || '';
      expect(scriptContent).toContain('// Custom script');
      expect(scriptContent).toContain('console.log(\'Modpack loaded successfully!\');');
      
      // 6.3 验证所有必要的文件都存在
      const expectedFiles = [
        'modrinth.index.json',
        'overrides/config/test-config.json',
        'overrides/scripts/custom.js'
      ];
      
      expectedFiles.forEach(filePath => {
        const fileExists = !!zip.file(filePath);
        expect(fileExists).toBe(true);
      });
    });

    it('should handle edge cases with minimal configuration', async () => {
      // 测试使用最小配置创建mrpack文件
      const minimalDependencies = {
        minecraft: '1.20.1',
        'fabric-loader': '0.14.22'
      };
      
      const minimalIndexJson = new IndexJson(
        'Minimal Pack',
        '1.0.0',
        minimalDependencies
      );
      
      // 添加一个最小的文件
      const minimalFile = new IndexJsonFile(
        'README.txt',
        'e3b0c44298fc1c149afbf4c8996fb92427ae41e4', // 空文件的SHA-1
        'cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e', // 空文件的SHA-512
        0
      );
      minimalFile.addDownloadUri('https://example.com/README.txt');
      
      minimalIndexJson.addFile(minimalFile);
      
      // 创建builder并构建，不添加任何覆盖文件
      const builder = new MrpackBuilder(minimalIndexJson.marshaledJson);
      const mrpackBuffer = await builder.build();
      
      // 验证生成的zip文件
      const zip = await JSZip.loadAsync(mrpackBuffer);
      
      // 验证modrinth.index.json存在
      const indexJsonExists = !!zip.file('modrinth.index.json');
      expect(indexJsonExists).toBe(true);
      
      // 验证没有覆盖文件（因为我们没有添加任何覆盖文件）
      const files = Object.keys(zip.files);
      const overrideFiles = files.filter(file => file.startsWith('overrides/'));
      expect(overrideFiles.length).toBe(0);
    });

    it('should handle multiple overrides of different types', async () => {
      // 创建索引JSON
      const dependencies = {
        minecraft: '1.20.1',
        'fabric-loader': '0.14.22'
      };
      
      const indexJson = new IndexJson(
        'Multi-Type Override Test',
        '1.0.0',
        dependencies
      );
      
      // 添加一个文件
      const file = new IndexJsonFile(
        'mods/test.jar',
        'sha1hash',
        'sha512hash',
        1024
      );
      file.addDownloadUri('http://example.com');
      
      indexJson.addFile(file);
      
      // 创建不同类型的覆盖文件
      const jsonOverride = new Override('config/settings.json', 'json');
      jsonOverride.content = { version: '1.0.0', enabled: true };
      
      const stringOverride = new Override('config/rules.txt', 'string');
      stringOverride.content = '# Test rules\nenabled=true\nlogging=verbose';
      
      const bufferOverride = new Override('textures/icon.png', 'buffer');
      bufferOverride.content = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]); // PNG文件头
      
      // 构建mrpack文件
      const builder = new MrpackBuilder(indexJson.marshaledJson);
      builder.addOverride(jsonOverride);
      builder.addOverride(stringOverride);
      builder.addOverride(bufferOverride);
      
      const mrpackBuffer = await builder.build();
      
      // 验证生成的zip文件
      const zip = await JSZip.loadAsync(mrpackBuffer);
      
      // 验证所有覆盖文件都存在
      expect(!!zip.file('config/settings.json')).toBe(true);
      expect(!!zip.file('config/rules.txt')).toBe(true);
      expect(!!zip.file('textures/icon.png')).toBe(true);
      
      // 验证覆盖文件内容
      const jsonContent = await zip.file('config/settings.json')?.async('string') || '';
      expect(JSON.parse(jsonContent)).toEqual({ version: '1.0.0', enabled: true });
      
      const stringContent = await zip.file('config/rules.txt')?.async('string') || '';
      expect(stringContent).toContain('# Test rules');
      expect(stringContent).toContain('enabled=true');
      
      const bufferContent = await zip.file('textures/icon.png')?.async('nodebuffer') || Buffer.from([]);
      expect(bufferContent.slice(0, 8)).toEqual(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
    });
  });
});