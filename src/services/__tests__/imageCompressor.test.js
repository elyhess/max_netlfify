import { vi, describe, it, expect, beforeEach } from 'vitest';
import {
  compressFile,
  addFilesWithinLimit,
  processUploadedFiles,
  COMPRESSION_OPTIONS,
  MAX_FILE_COUNT,
} from '../imageCompressor';

// Mock Compressor to simulate compression behavior
vi.mock('compressorjs', () => ({
  default: vi.fn((file, options) => {
    const compressedSize = Math.floor(file.size * COMPRESSION_OPTIONS.quality);
    const compressed = new File(['x'.repeat(compressedSize)], file.name, { type: file.type });
    Object.defineProperty(compressed, 'size', { value: compressedSize });
    setTimeout(() => options.success(compressed), 0);
  }),
}));

function createMockFile(name, sizeInBytes, type = 'image/jpeg') {
  const file = new File(['x'], name, { type });
  Object.defineProperty(file, 'size', { value: sizeInBytes });
  return file;
}

describe('constants', () => {
  it('quality is 0.2', () => {
    expect(COMPRESSION_OPTIONS.quality).toBe(0.2);
  });

  it('maxWidth is 600', () => {
    expect(COMPRESSION_OPTIONS.maxWidth).toBe(600);
  });

  it('max file count is 6', () => {
    expect(MAX_FILE_COUNT).toBe(6);
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
    Compressor.mockImplementationOnce((file, options) => {
      setTimeout(() => options.error(new Error('compression failed')), 0);
    });

    const input = createMockFile('bad.jpg', 1000000);
    const result = await compressFile(input);
    expect(result).toBeNull();
  });
});

describe('addFilesWithinLimit', () => {
  it('accepts files within count limit', () => {
    const newFiles = [
      createMockFile('a.jpg', 100000),
      createMockFile('b.jpg', 200000),
    ];
    const { accepted, rejected } = addFilesWithinLimit(newFiles, []);

    expect(accepted).toHaveLength(2);
    expect(rejected).toHaveLength(0);
  });

  it('accepts large files as long as count is under limit', () => {
    const newFiles = [
      createMockFile('a.jpg', 300000),
      createMockFile('b.jpg', 300000),
    ];
    const { accepted, rejected } = addFilesWithinLimit(newFiles, []);

    expect(accepted).toHaveLength(2);
    expect(rejected).toHaveLength(0);
  });

  it('skips duplicate files by name', () => {
    const existing = [createMockFile('photo.jpg', 100000)];
    const newFiles = [createMockFile('photo.jpg', 50000)];
    const { accepted } = addFilesWithinLimit(newFiles, existing);

    expect(accepted).toHaveLength(0);
  });

  it('enforces 6 file count limit', () => {
    const existing = Array.from({ length: 5 }, (_, i) =>
      createMockFile(`existing${i}.jpg`, 1000)
    );
    const newFiles = [
      createMockFile('sixth.jpg', 1000),
      createMockFile('seventh.jpg', 1000),
    ];
    const { accepted, rejected } = addFilesWithinLimit(newFiles, existing);

    expect(accepted).toHaveLength(1);
    expect(accepted[0].name).toBe('sixth.jpg');
    expect(rejected).toHaveLength(1);
    expect(rejected[0].name).toBe('seventh.jpg');
  });

  it('rejects all new files when already at 6', () => {
    const existing = Array.from({ length: 6 }, (_, i) =>
      createMockFile(`file${i}.jpg`, 1000)
    );
    const newFiles = [createMockFile('extra.jpg', 1000)];
    const { accepted, rejected } = addFilesWithinLimit(newFiles, existing);

    expect(accepted).toHaveLength(0);
    expect(rejected).toHaveLength(1);
  });

  it('handles empty input', () => {
    const { accepted, rejected } = addFilesWithinLimit([], []);
    expect(accepted).toHaveLength(0);
    expect(rejected).toHaveLength(0);
  });
});

describe('processUploadedFiles', () => {
  it('compresses and adds files', async () => {
    const rawFiles = [
      createMockFile('photo1.jpg', 100000),
      createMockFile('photo2.jpg', 100000),
    ];
    const { files, rejected } = await processUploadedFiles(rawFiles, []);

    expect(files).toHaveLength(2);
    expect(rejected).toHaveLength(0);
  });

  it('preserves existing files in the result', async () => {
    const existing = [createMockFile('old.jpg', 50000)];
    const rawFiles = [createMockFile('new.jpg', 100000)];
    const { files } = await processUploadedFiles(rawFiles, existing);

    expect(files).toHaveLength(2);
    expect(files[0].name).toBe('old.jpg');
  });

  it('only compresses files that have available slots', async () => {
    const Compressor = (await import('compressorjs')).default;
    const callsBefore = Compressor.mock.calls.length;

    const existing = Array.from({ length: 5 }, (_, i) =>
      createMockFile(`existing${i}.jpg`, 1000)
    );
    const rawFiles = [
      createMockFile('fits.jpg', 10000),
      createMockFile('no-slot1.jpg', 10000),
      createMockFile('no-slot2.jpg', 10000),
    ];
    const { files, rejected } = await processUploadedFiles(rawFiles, existing);

    // Only 1 slot available, so only 1 file should be compressed
    const callsAfter = Compressor.mock.calls.length;
    expect(callsAfter - callsBefore).toBe(1);

    expect(files).toHaveLength(6);
    expect(rejected).toHaveLength(2);
  });

  it('rejects all files when already at max count', async () => {
    const existing = Array.from({ length: 6 }, (_, i) =>
      createMockFile(`file${i}.jpg`, 1000)
    );
    const rawFiles = [createMockFile('extra.jpg', 10000)];
    const { files, rejected } = await processUploadedFiles(rawFiles, existing);

    expect(files).toHaveLength(6);
    expect(rejected).toHaveLength(1);
  });

  it('accepts large files after compression', async () => {
    const existing = [createMockFile('first.jpg', 490000)];
    // 500000 * 0.2 = 100000 compressed — should be accepted since no size limit
    const rawFiles = [createMockFile('huge.jpg', 500000)];
    const { files, rejected } = await processUploadedFiles(rawFiles, existing);

    expect(files).toHaveLength(2);
    expect(rejected).toHaveLength(0);
  });

  it('file count never exceeds 6', async () => {
    const rawFiles = Array.from({ length: 10 }, (_, i) =>
      createMockFile(`file${i}.jpg`, 10000)
    );
    const { files } = await processUploadedFiles(rawFiles, []);

    expect(files.length).toBeLessThanOrEqual(MAX_FILE_COUNT);
  });
});
