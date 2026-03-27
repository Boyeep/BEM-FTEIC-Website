type CropImageOptions = {
  file: File;
  imageUrl: string;
  offsetX: number;
  offsetY: number;
  zoom: number;
  frameWidth: number;
  frameHeight: number;
  targetWidth: number;
  targetHeight: number;
};

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () =>
      reject(new Error("Failed to load image for cropping."));
    image.src = src;
  });
}

function inferOutputType(file: File) {
  if (file.type === "image/png") return "image/png";
  if (file.type === "image/webp") return "image/webp";
  return "image/jpeg";
}

function inferExtension(mimeType: string) {
  if (mimeType === "image/png") return "png";
  if (mimeType === "image/webp") return "webp";
  return "jpg";
}

export async function cropImageFile({
  file,
  imageUrl,
  offsetX,
  offsetY,
  zoom,
  frameWidth,
  frameHeight,
  targetWidth,
  targetHeight,
}: CropImageOptions) {
  const image = await loadImage(imageUrl);
  const baseScale = Math.min(
    frameWidth / image.naturalWidth,
    frameHeight / image.naturalHeight,
  );
  const totalScale = baseScale * zoom;
  const sourceWidth = frameWidth / totalScale;
  const sourceHeight = frameHeight / totalScale;
  const centerX = image.naturalWidth / 2 - offsetX / totalScale;
  const centerY = image.naturalHeight / 2 - offsetY / totalScale;
  const sourceX = Math.min(
    Math.max(0, centerX - sourceWidth / 2),
    image.naturalWidth - sourceWidth,
  );
  const sourceY = Math.min(
    Math.max(0, centerY - sourceHeight / 2),
    image.naturalHeight - sourceHeight,
  );

  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Canvas is not supported in this browser.");
  }

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(
    image,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    0,
    0,
    targetWidth,
    targetHeight,
  );

  const outputType = inferOutputType(file);
  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, outputType, outputType === "image/jpeg" ? 0.92 : 1);
  });

  if (!blob) {
    throw new Error("Failed to prepare cropped image.");
  }

  const extension = inferExtension(outputType);
  const baseName = file.name.replace(/\.[^.]+$/, "");
  return new File([blob], `${baseName}.${extension}`, {
    type: outputType,
    lastModified: Date.now(),
  });
}
