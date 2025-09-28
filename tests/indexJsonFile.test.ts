import { IndexJsonFile } from '../src/components';

describe('IndexJsonFile Class', () => {
  describe('constructor and basic properties', () => {
    it('should create IndexJsonFile instance with correct properties', () => {
      const file = new IndexJsonFile(
        'mods/test-mod.jar',
        'sha1hash12345',
        'sha512hash1234567890',
        1024
      );
      
      try {
        // 尝试获取marshaledJson会失败，因为没有添加下载链接
        file.marshaledJson;
        fail('Should have thrown an error');
      } catch (error) {
        if (error instanceof Error) {
          expect(error.message).toBe('File object has no download links!');
        }
      }
    });
  });

  describe('addDownloadUri method', () => {
    it('should add download URI correctly', () => {
      const file = new IndexJsonFile(
        'mods/test-mod.jar',
        'sha1hash12345',
        'sha512hash1234567890',
        1024
      );
      
      file.addDownloadUri('https://example.com/mods/test-mod.jar');
      const marshaledJson = file.marshaledJson;
      
      expect(marshaledJson.downloads).toContain('https://example.com/mods/test-mod.jar');
      expect(marshaledJson.downloads.length).toBe(1);
    });

    it('should add multiple download URIs correctly', () => {
      const file = new IndexJsonFile(
        'mods/test-mod.jar',
        'sha1hash12345',
        'sha512hash1234567890',
        1024
      );
      
      file.addDownloadUri('https://example.com/mods/test-mod.jar');
      file.addDownloadUri('https://backup.example.com/mods/test-mod.jar');
      
      const marshaledJson = file.marshaledJson;
      
      expect(marshaledJson.downloads).toContain('https://example.com/mods/test-mod.jar');
      expect(marshaledJson.downloads).toContain('https://backup.example.com/mods/test-mod.jar');
      expect(marshaledJson.downloads.length).toBe(2);
    });

    it('should throw error for invalid download URI', () => {
      const file = new IndexJsonFile(
        'mods/test-mod.jar',
        'sha1hash12345',
        'sha512hash1234567890',
        1024
      );
      
      expect(() => file.addDownloadUri('')).toThrow('Download URI must be a non-empty string');
      expect(() => file.addDownloadUri(undefined as any)).toThrow('Download URI must be a non-empty string');
      expect(() => file.addDownloadUri(null as any)).toThrow('Download URI must be a non-empty string');
      expect(() => file.addDownloadUri(123 as any)).toThrow('Download URI must be a non-empty string');
    });
  });

  describe('marshaledJson getter', () => {
    it('should return complete file object when download links are added', () => {
      const file = new IndexJsonFile(
        'mods/test-mod.jar',
        'sha1hash12345',
        'sha512hash1234567890',
        1024
      );
      
      file.addDownloadUri('https://example.com/mods/test-mod.jar');
      const marshaledJson = file.marshaledJson;
      
      expect(marshaledJson.path).toBe('mods/test-mod.jar');
      expect(marshaledJson.hashes.sha1).toBe('sha1hash12345');
      expect(marshaledJson.hashes.sha512).toBe('sha512hash1234567890');
      expect(marshaledJson.fileSize).toBe(1024);
      expect(marshaledJson.downloads.length).toBe(1);
    });

    it('should throw error when no download links are added', () => {
      const file = new IndexJsonFile(
        'mods/test-mod.jar',
        'sha1hash12345',
        'sha512hash1234567890',
        1024
      );
      
      expect(() => file.marshaledJson).toThrow('File object has no download links!');
    });
  });
});