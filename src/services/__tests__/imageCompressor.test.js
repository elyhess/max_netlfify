import { describe, it, expect } from 'vitest';
import {
  addFilesWithinLimit,
  processUploadedFiles,
  MAX_FILE_COUNT,
} from '../imageCompressor';

function createMockFile(name, sizeInBytes, type = 'image/jpeg') {
  const file = new File(['x'], name, { type });
  Object.defineProperty(file, 'size', { value: sizeInBytes });
  return file;
}

describe('constants', () => {
  it('max file count is 6', () => {
    expect(MAX_FILE_COUNT).toBe(6);
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
  it('adds files and returns them', async () => {
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

  it('enforces count limit after deduplication', async () => {
    const existing = Array.from({ length: 5 }, (_, i) =>
      createMockFile(`existing${i}.jpg`, 1000)
    );
    const rawFiles = [
      createMockFile('fits.jpg', 10000),
      createMockFile('no-slot1.jpg', 10000),
      createMockFile('no-slot2.jpg', 10000),
    ];
    const { files, rejected } = await processUploadedFiles(rawFiles, existing);

    expect(files).toHaveLength(6);
    expect(rejected).toHaveLength(2);
  });

  it('accepts a new file when an earlier selected file is a duplicate near the limit', async () => {
    const existing = Array.from({ length: 5 }, (_, i) =>
      createMockFile(`existing${i}.jpg`, 1000)
    );
    const rawFiles = [
      createMockFile('existing0.jpg', 10000),
      createMockFile('new-fit.jpg', 10000),
    ];

    const { files, rejected } = await processUploadedFiles(rawFiles, existing);

    expect(files).toHaveLength(6);
    expect(files.some((file) => file.name === 'new-fit.jpg')).toBe(true);
    expect(rejected).toHaveLength(0);
  });

  it('deduplicates files picked twice in the same selection', async () => {
    const rawFiles = [
      createMockFile('repeat.jpg', 10000),
      createMockFile('repeat.jpg', 12000),
    ];

    const { files, rejected } = await processUploadedFiles(rawFiles, []);

    expect(files).toHaveLength(1);
    expect(files[0].name).toBe('repeat.jpg');
    expect(rejected).toHaveLength(0);
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

  it('file count never exceeds 6', async () => {
    const rawFiles = Array.from({ length: 10 }, (_, i) =>
      createMockFile(`file${i}.jpg`, 10000)
    );
    const { files } = await processUploadedFiles(rawFiles, []);

    expect(files.length).toBeLessThanOrEqual(MAX_FILE_COUNT);
  });
});
