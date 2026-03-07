import Compressor from "compressorjs";

const COMPRESSION_OPTIONS = {
  quality: 0.2,
  maxWidth: 600,
};

const MAX_TOTAL_SIZE = 500000; // 500KB

export { COMPRESSION_OPTIONS, MAX_TOTAL_SIZE };

export async function compressFile(file) {
  return new Promise((resolve) => {
    new Compressor(file, {
      ...COMPRESSION_OPTIONS,
      success: (result) => resolve(result),
      error: (err) => {
        console.error(err);
        resolve(null);
      },
    });
  });
}

export async function compressFiles(files) {
  const results = await Promise.all(files.map(compressFile));
  return results.filter(Boolean);
}

export function addFilesWithinLimit(newFiles, existingFiles) {
  const accepted = [];
  const rejected = [];
  let currentSize = existingFiles.reduce((acc, f) => acc + f.size, 0);

  for (const file of newFiles) {
    const isDuplicate = existingFiles.some((f) => f.name === file.name);
    if (isDuplicate) continue;

    const updatedSize = currentSize + file.size;
    if (updatedSize <= MAX_TOTAL_SIZE) {
      currentSize = updatedSize;
      accepted.push(file);
    } else {
      rejected.push(file);
    }
  }

  return { accepted, rejected, totalSize: currentSize };
}

export async function processUploadedFiles(rawFiles, existingFiles) {
  const compressed = await compressFiles(rawFiles);
  const { accepted, rejected, totalSize } = addFilesWithinLimit(compressed, existingFiles);
  return {
    files: [...existingFiles, ...accepted],
    rejected,
    totalSize,
  };
}
