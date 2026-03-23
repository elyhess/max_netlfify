const ONE_MEGABYTE = 1024 * 1024;

export const MAX_FILE_COUNT = 6;
export const MAX_TOTAL_ATTACHMENT_BYTES = 20 * ONE_MEGABYTE;

const MAX_DIMENSION = 3200;
const DEFAULT_QUALITY = 0.92;
const MIN_QUALITY = 0.55;
const QUALITY_STEP = 0.06;
const SCALE_STEP = 0.88;
const PER_IMAGE_BUDGET = 3 * ONE_MEGABYTE;

function changeExtension(fileName, extension) {
  return /\.[^.]+$/u.test(fileName)
    ? fileName.replace(/\.[^.]+$/u, extension)
    : `${fileName}${extension}`;
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }
      reject(new Error("Failed to convert image to a data URL."));
    };
    reader.onerror = () =>
      reject(reader.error ?? new Error("Failed to read the compressed image."));
    reader.readAsDataURL(blob);
  });
}

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error(`Could not read ${file.name} as an image.`));
    };
    image.src = objectUrl;
  });
}

function canvasToBlob(canvas, mimeType, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("The browser could not export the compressed image."));
          return;
        }
        resolve(blob);
      },
      mimeType,
      quality,
    );
  });
}

async function compressImage(file, budgetBytes) {
  const image = await loadImage(file);
  const largestSide = Math.max(image.width, image.height);
  const baseScale = largestSide > MAX_DIMENSION ? MAX_DIMENSION / largestSide : 1;
  const aspectRatio = image.width / image.height;
  const mimeType = "image/webp";

  let scale = baseScale;
  let quality = DEFAULT_QUALITY;
  let attempts = 0;
  let bestBlob = null;

  while (attempts < 16) {
    const width = Math.max(720, Math.round(image.width * scale));
    const height = Math.max(720, Math.round(width / aspectRatio));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("The browser could not open a canvas for image compression.");
    }

    context.drawImage(image, 0, 0, width, height);
    const blob = await canvasToBlob(canvas, mimeType, quality);
    bestBlob = blob;

    if (blob.size <= budgetBytes) break;

    if (quality > MIN_QUALITY) {
      quality = Math.max(MIN_QUALITY, quality - QUALITY_STEP);
    } else {
      scale *= SCALE_STEP;
    }

    attempts += 1;
  }

  if (!bestBlob) throw new Error(`Could not compress ${file.name}.`);

  const dataUrl = await blobToDataUrl(bestBlob);

  return {
    dataUrl,
    mimeType,
    name: changeExtension(file.name, ".webp"),
    originalName: file.name,
    size: bestBlob.size,
  };
}

/**
 * Compress files and return prepared attachments with data URLs.
 * @param {File[]} files
 * @returns {Promise<{references: Array, totalBytes: number}>}
 */
export async function prepareAttachments(files) {
  const trimmed = files.slice(0, MAX_FILE_COUNT);

  if (trimmed.length === 0) {
    return { references: [], totalBytes: 0 };
  }

  const perImageBudget = Math.min(
    PER_IMAGE_BUDGET,
    Math.floor(MAX_TOTAL_ATTACHMENT_BYTES / trimmed.length),
  );

  const references = await Promise.all(
    trimmed.map((file) => compressImage(file, perImageBudget)),
  );

  const totalBytes = references.reduce((sum, ref) => sum + ref.size, 0);

  return { references, totalBytes };
}

/**
 * Legacy-compatible wrapper used by the contact form to add files with
 * deduplication and count limiting. Returns raw File objects (not yet compressed).
 */
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

/**
 * Process uploaded files: deduplicate and enforce count limit.
 * Returns raw File objects for display; compression happens at submit time.
 */
export async function processUploadedFiles(rawFiles, existingFiles) {
  const existingNames = new Set(existingFiles.map((file) => file.name));
  const uniqueFiles = [];

  for (const file of rawFiles) {
    if (existingNames.has(file.name)) continue;
    existingNames.add(file.name);
    uniqueFiles.push(file);
  }

  const { accepted, rejected } = addFilesWithinLimit(uniqueFiles, existingFiles);

  return {
    files: [...existingFiles, ...accepted],
    rejected,
  };
}
