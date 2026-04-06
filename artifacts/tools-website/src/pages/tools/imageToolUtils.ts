export interface LoadedImage {
  file: File;
  name: string;
  type: string;
  size: number;
  src: string;
  image: HTMLImageElement;
  width: number;
  height: number;
}

export function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${value.toFixed(value >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function fileBaseName(filename: string) {
  const lastDot = filename.lastIndexOf(".");
  return lastDot > 0 ? filename.slice(0, lastDot) : filename;
}

export function extensionForMimeType(type: string) {
  if (type === "image/jpeg") return "jpg";
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  if (type === "image/gif") return "gif";
  if (type === "image/svg+xml") return "svg";
  return "png";
}

export function normalizeOutputMimeType(type: string, fallbackType: string) {
  if (type === "original") return fallbackType || "image/png";
  return type;
}

export function stripDataUrlPrefix(dataUrl: string) {
  const commaIndex = dataUrl.indexOf(",");
  return commaIndex >= 0 ? dataUrl.slice(commaIndex + 1) : dataUrl;
}

export function estimateBase64Bytes(rawBase64: string) {
  const sanitized = rawBase64.replace(/\s/g, "");
  const padding = sanitized.endsWith("==") ? 2 : sanitized.endsWith("=") ? 1 : 0;
  return Math.max(0, Math.floor((sanitized.length * 3) / 4) - padding);
}

export function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(reader.error ?? new Error("Failed to read file."));
    reader.readAsDataURL(file);
  });
}

export function loadImageFromSrc(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new window.Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Failed to load image."));
    image.src = src;
  });
}

export async function loadImageFile(file: File): Promise<LoadedImage> {
  const src = await readFileAsDataUrl(file);
  const image = await loadImageFromSrc(src);

  return {
    file,
    name: file.name,
    type: file.type || "image/png",
    size: file.size,
    src,
    image,
    width: image.naturalWidth || image.width,
    height: image.naturalHeight || image.height,
  };
}

export function makeCanvas(width: number, height: number) {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));
  return canvas;
}

export function drawImageToCanvas(
  loaded: LoadedImage,
  width: number,
  height: number,
  draw: (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => void,
) {
  const canvas = makeCanvas(width, height);
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Canvas is not supported in this browser.");
  }

  draw(ctx, canvas);
  return canvas;
}

export function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality?: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Failed to export image."));
          return;
        }

        resolve(blob);
      },
      type,
      quality,
    );
  });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

export function parseBase64ImageInput(input: string, fallbackMimeType: string) {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const dataUrlMatch = trimmed.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,([a-zA-Z0-9+/=\s]+)$/);
  if (dataUrlMatch) {
    const mimeType = dataUrlMatch[1];
    const rawBase64 = dataUrlMatch[2].replace(/\s/g, "");
    return {
      mimeType,
      rawBase64,
      dataUrl: `data:${mimeType};base64,${rawBase64}`,
    };
  }

  const sanitized = trimmed.replace(/\s/g, "");
  if (!/^[a-zA-Z0-9+/=]+$/.test(sanitized)) return null;

  return {
    mimeType: fallbackMimeType,
    rawBase64: sanitized,
    dataUrl: `data:${fallbackMimeType};base64,${sanitized}`,
  };
}
