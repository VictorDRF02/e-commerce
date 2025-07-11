import { ShortDescriptionPipe } from './short-description.pipe';

describe('ShortDescriptionPipe', () => {
  let pipe: ShortDescriptionPipe;

  beforeEach(() => {
    pipe = new ShortDescriptionPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  describe('when ignoreWords is true (default)', () => {
    it('should return the original string if shorter than length', () => {
      const input = 'This is a short text';
      const result = pipe.transform(input, 50);
      expect(result).toBe(input);
    });

    it('should truncate the string and add ellipsis if longer than length', () => {
      const input = 'This is a longer text that needs to be truncated';
      const result = pipe.transform(input, 10);
      expect(result).toBe('This is a ...');
    });

    it('should handle empty string', () => {
      const result = pipe.transform('', 10);
      expect(result).toBe('');
    });

    it('should handle exactly matching length', () => {
      const input = 'Exactly 9';
      const result = pipe.transform(input, 9);
      expect(result).toBe('Exactly 9');
    });
  });

  describe('when ignoreWords is false', () => {
    it('should return the original string if shorter than length', () => {
      const input = 'Short text';
      const result = pipe.transform(input, 20, false);
      expect(result).toBe('Short text');
    });

    it('should truncate by words without breaking them', () => {
      const input = 'This is a longer text that needs to be truncated by words';
      const result = pipe.transform(input, 20, false);
      expect(result).toBe('This is a longer text...');
    });

    it('should handle empty string', () => {
      const result = pipe.transform('', 10, false);
      expect(result).toBe('');
    });

    it('should handle cases where a single word exceeds the length', () => {
      const input = 'Antidisestablishmentarianism is a long word';
      const result = pipe.transform(input, 10, false);
      expect(result).toBe('...');
    });

    it('should not add ellipsis if the last word fits exactly', () => {
      const input = 'Perfect fit';
      const result = pipe.transform(input, 11, false);
      expect(result).toBe('Perfect fit');
    });
  });

  describe('edge cases', () => {
    it('should handle zero length', () => {
      const input = 'Some text';
      expect(pipe.transform(input, 0)).toBe('...');
      expect(pipe.transform(input, 0, false)).toBe('...');
    });

    it('should handle negative length', () => {
      const input = 'Some text';
      expect(pipe.transform(input, -5)).toBe('...');
      expect(pipe.transform(input, -5, false)).toBe('...');
    });
  });
});