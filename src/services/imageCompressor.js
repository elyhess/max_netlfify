import Compressor from "compressorjs";

const COMPRESSION_OPTIONS = {
  quality: 0.2,
  maxWidth: 600,
};

const MAX_FILE_COUNT = 6;

export { COMPRESSION_OPTIONS, MAX_FILE_COUNT };

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

export function addFilesWithinLimit(newFiles, existingFiles) {
  const accepted = [];
  const rejected = [];
  let currentCount = existingFiles.length;

  for (const file of newFiles) {
    const isDuplicate = existingFiles.some((f) => f.name === file.name);
    if (isDuplicate) continue;

    if (currentCount >= MAX_FILE_COUNT) {
      rejected.push(file);
      continue;
    }

    currentCount++;
    accepted.push(file);
  }

  return { accepted, rejected };
}

export async function processUploadedFiles(rawFiles, existingFiles) {
  const existingNames = new Set(existingFiles.map((file) => file.name));
  const uniqueFiles = [];

  for (const file of rawFiles) {
    if (existingNames.has(file.name)) {
      continue;
    }

    existingNames.add(file.name);
    uniqueFiles.push(file);
  }

  const compressed = (await Promise.all(uniqueFiles.map(compressFile))).filter(Boolean);
  const { accepted, rejected } = addFilesWithinLimit(compressed, existingFiles);

  return {
    files: [...existingFiles, ...accepted],
    rejected,
  };
}
