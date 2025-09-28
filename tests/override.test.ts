import { Override } from '../src/components';

describe('Override Class', () => {
  describe('constructor and basic properties', () => {
    it('should create Override instance with correct properties', () => {
      const override = new Override('test/path.json', 'json');
      expect(override.filePath).toBe('test/path.json');
    });

    it('should allow setting content via setter', () => {
      const override = new Override('test/path.json', 'json');
      override.content = { key: 'value' };
      // 无法直接访问私有属性，但我们可以通过asyncMarshaledContent间接验证
    });
  });

  describe('asyncMarshaledContent', () => {
    it('should throw error when content is not set', () => {
      const override = new Override('test/path.json', 'json');
      expect(() => override.asyncMarshaledContent).toThrow(
        'Content for override "test/path.json" is not set'
      );
    });

    it('should handle string content correctly', async () => {
      const override = new Override('test/path.txt', 'string');
      override.content = 'test content';
      const marshaledContent = await override.asyncMarshaledContent;
      expect(marshaledContent).toBe('test content');
    });

    it('should handle buffer content correctly', async () => {
      const buffer = Buffer.from('test buffer content');
      const override = new Override('test/path.bin', 'buffer');
      override.content = buffer;
      const marshaledContent = await override.asyncMarshaledContent;
      expect(marshaledContent).toBe(buffer);
    });

    it('should handle json content correctly', async () => {
      const jsonContent = { key: 'value', nested: { array: [1, 2, 3] } };
      const override = new Override('test/path.json', 'json');
      override.content = jsonContent;
      const marshaledContent = await override.asyncMarshaledContent;
      expect(typeof marshaledContent).toBe('string');
      expect(JSON.parse(marshaledContent as string)).toEqual(jsonContent);
    });

    it('should handle toml content (if toml package is available)', async () => {
      const tomlContent = { key: 'value', array: [1, 2, 3] };
      const override = new Override('test/path.toml', 'toml');
      override.content = tomlContent;
      
      try {
        const marshaledContent = await override.asyncMarshaledContent;
        expect(typeof marshaledContent).toBe('string');
      } catch (error) {
        // 由于TOML是peer dependency，我们不能保证它已安装
        // 所以这里捕获错误但不失败测试
        if (error instanceof Error) {
          expect(error.message).toContain('Failed to import or use toml package');
        }
      }
    });
  });
});