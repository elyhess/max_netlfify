import { vi, describe, it, expect, beforeEach } from 'vitest';
import {
  compressFile,
  compressFiles,
  addFilesWithinLimit,
  processUploadedFiles,
  COMPRESSION_OPTIONS,
  MAX_TOTAL_SIZE,
} from '../imageCompressor';

// Mock Compressor to simulate compression behavior
vi.mock('compressorjs', () => ({
  default: vi.fn((file, options) => {
    // Simulate compression: output is smaller than input
    const compressedSize = Math.floor(file.size * COMPRESSION_OPTIONS.quality);
    const compressed = new File(['x'.repeat(compressedSize)], file.name, { type: file.type });
    // Override size since File constructor doesn't use content length reliably
    Object.defineProperty(compressed, 'size', { value: compressedSize });
    setTimeout(() => options.success(compressed), 0);
  }),
}));

function createMockFile(name, sizeInBytes, type = 'image/jpeg') {
  const file = new File(['x'], name, { type });
  Object.defineProperty(file, 'size', { value: sizeInBytes });
  return file;
}

describe('COMPRESSION_OPTIONS', () => {
  it('uses quality of 0.2', () => {
    expect(COMPRESSION_OPTIONS.quality).toBe(0.2);
  });

  it('uses maxWidth of 600', () => {
    expect(COMPRESSION_OPTIONS.maxWidth).toBe(600);
  });
});

describe('MAX_TOTAL_SIZE', () => {
  it('is 500KB (500000 bytes)', () => {
    expect(MAX_TOTAL_SIZE).toBe(500000);
  });
});

describe('compressFile', () => {
  it('returns a compressed file', async () => {
    const input = createMockFile('photo.jpg', 1000000);
    const result = await compressFile(input);
    expect(result).not.toBeNull();
    expect(result.name).toBe('photo.jpg');
  });

  it('passes compression options to Compressor', async () => {
    const Compressor = (await import('compressorjs')).default;
    const input = createMockFile('photo.jpg', 500000);
    await compressFile(input);

    const callArgs = Compressor.mock.calls[Compressor.mock.calls.length - 1];
    expect(callArgs[1].quality).toBe(0.2);
    expect(callArgs[1].maxWidth).toBe(600);
  });

  it('returns null when compression fails', async () => {
    const Compressor = (await import('compressorjs')).default;
    // Override mock for this test to simulate failure
    Compressor.mockImplementationOnce((file, options) => {
      setTimeout(() => options.error(new Error('compression failed')), 0);
    });

    const input = createMockFile('bad.jpg', 1000000);
    const result = await compressFile(input);
    expect(result).toBeNull();
  });
});

describe('compressFiles', () => {
  it('compresses multiple files', async () => {
    const files = [
      createMockFile('a.jpg', 100000),
      createMockFile('b.jpg', 200000),
      createMockFile('c.jpg', 150000),
    ];
    const results = await compressFiles(files);
    expect(results).toHaveLength(3);
  });

  it('filters out null results from failed compressions', async () => {
    const Compressor = (await import('compressorjs')).default;
    Compressor.mockImplementationOnce((file, options) => {
      setTimeout(() => options.error(new Error('fail')), 0);
    });

    const files = [
      createMockFile('bad.jpg', 100000),
      createMockFile('good.jpg', 100000),
    ];
    const results = await compressFiles(files);
    expect(results).toHaveLength(1);
    expect(results[0].name).toBe('good.jpg');
  });
});

describe('addFilesWithinLimit', () => {
  it('accepts files within the 500KB limit', () => {
    const newFiles = [
      createMockFile('a.jpg', 100000),
      createMockFile('b.jpg', 200000),
    ];
    const { accepted, rejected, totalSize } = addFilesWithinLimit(newFiles, []);

    expect(accepted).toHaveLength(2);
    expect(rejected).toHaveLength(0);
    expect(totalSize).toBe(300000);
  });

  it('rejects files that would exceed 500KB', () => {
    const newFiles = [
      createMockFile('a.jpg', 300000),
      createMockFile('b.jpg', 300000),
    ];
    const { accepted, rejected } = addFilesWithinLimit(newFiles, []);

    expect(accepted).toHaveLength(1);
    expect(accepted[0].name).toBe('a.jpg');
    expect(rejected).toHaveLength(1);
    expect(rejected[0].name).toBe('b.jpg');
  });

  it('accounts for existing files when calculating total size', () => {
    const existing = [createMockFile('existing.jpg', 400000)];
    const newFiles = [createMockFile('new.jpg', 200000)];
    const { accepted, rejected, totalSize } = addFilesWithinLimit(newFiles, existing);

    expect(accepted).toHaveLength(0);
    expect(rejected).toHaveLength(1);
    expect(totalSize).toBe(400000); // unchanged
  });

  it('accepts files up to exactly 500KB', () => {
    const newFiles = [createMockFile('exact.jpg', 500000)];
    const { accepted, rejected, totalSize } = addFilesWithinLimit(newFiles, []);

    expect(accepted).toHaveLength(1);
    expect(rejected).toHaveLength(0);
    expect(totalSize).toBe(500000);
  });

  it('rejects files at 500001 bytes', () => {
    const newFiles = [createMockFile('over.jpg', 500001)];
    const { accepted, rejected } = addFilesWithinLimit(newFiles, []);

    expect(accepted).toHaveLength(0);
    expect(rejected).toHaveLength(1);
  });

  it('skips duplicate files by name', () => {
    const existing = [createMockFile('photo.jpg', 100000)];
    const newFiles = [createMockFile('photo.jpg', 50000)];
    const { accepted, totalSize } = addFilesWithinLimit(newFiles, existing);

    expect(accepted).toHaveLength(0);
    expect(totalSize).toBe(100000); // unchanged
  });

  it('accepts some and rejects others in a mixed batch', () => {
    const newFiles = [
      createMockFile('small.jpg', 100000),
      createMockFile('medium.jpg', 200000),
      createMockFile('large.jpg', 300000),
    ];
    const { accepted, rejected, totalSize } = addFilesWithinLimit(newFiles, []);

    expect(accepted).toHaveLength(2);
    expect(accepted[0].name).toBe('small.jpg');
    expect(accepted[1].name).toBe('medium.jpg');
    expect(rejected).toHaveLength(1);
    expect(rejected[0].name).toBe('large.jpg');
    expect(totalSize).toBe(300000);
  });

  it('handles empty input gracefully', () => {
    const { accepted, rejected, totalSize } = addFilesWithinLimit([], []);
    expect(accepted).toHaveLength(0);
    expect(rejected).toHaveLength(0);
    expect(totalSize).toBe(0);
  });
});

describe('processUploadedFiles', () => {
  it('compresses and adds files within limit', async () => {
    const rawFiles = [
      createMockFile('photo1.jpg', 100000),
      createMockFile('photo2.jpg', 100000),
    ];
    const { files, rejected } = await processUploadedFiles(rawFiles, []);

    expect(files).toHaveLength(2);
    expect(rejected).toHaveLength(0);
    // Compressed sizes should be smaller than originals
    files.forEach((f) => {
      expect(f.size).toBeLessThanOrEqual(MAX_TOTAL_SIZE);
    });
  });

  it('preserves existing files in the result', async () => {
    const existing = [createMockFile('old.jpg', 50000)];
    const rawFiles = [createMockFile('new.jpg', 100000)];
    const { files } = await processUploadedFiles(rawFiles, existing);

    expect(files).toHaveLength(2);
    expect(files[0].name).toBe('old.jpg');
    expect(files[1].name).toBe('new.jpg');
  });

  it('rejects files when total would exceed limit', async () => {
    const existing = [createMockFile('big.jpg', 490000)];
    // After compression at 0.2 quality, 100000 -> ~20000, which fits
    // But let's use a file large enough that even compressed it won't fit
    const rawFiles = [createMockFile('huge.jpg', 500000)];
    // Compressed: 500000 * 0.2 = 100000, total = 490000 + 100000 = 590000 > 500000
    const { files, rejected } = await processUploadedFiles(rawFiles, existing);

    expect(files).toHaveLength(1); // only existing
    expect(files[0].name).toBe('big.jpg');
    expect(rejected).toHaveLength(1);
  });

  it('total size never exceeds 500KB after processing', async () => {
    const rawFiles = [
      createMockFile('a.jpg', 800000),
      createMockFile('b.jpg', 800000),
      createMockFile('c.jpg', 800000),
      createMockFile('d.jpg', 800000),
      createMockFile('e.jpg', 800000),
    ];
    const { files, totalSize } = await processUploadedFiles(rawFiles, []);

    expect(totalSize).toBeLessThanOrEqual(MAX_TOTAL_SIZE);
    const actualTotal = files.reduce((sum, f) => sum + f.size, 0);
    expect(actualTotal).toBeLessThanOrEqual(MAX_TOTAL_SIZE);
  });
});
