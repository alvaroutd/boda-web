import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const MIME_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".heic": "image/heic",
  ".mp4": "video/mp4",
  ".mov": "video/quicktime",
  ".webm": "video/webm",
  ".m4v": "video/x-m4v",
};

const RESIZABLE = new Set([".jpg", ".jpeg", ".png", ".webp"]);

export type ServedFile = { buffer: Buffer; contentType: string };

// Sirve una imagen tal cual, o una miniatura en caché (generada la primera vez
// que se pide) cuando se pasa un ancho — evita transferir fotos a tamaño
// completo (varios MB) solo para mostrar una miniatura pequeña.
export async function readImageOrThumb(filePath: string, width: number | null): Promise<ServedFile> {
  const ext = path.extname(filePath).toLowerCase();

  if (width && width > 0 && RESIZABLE.has(ext)) {
    const dir = path.dirname(filePath);
    const base = path.basename(filePath, ext);
    const thumbDir = path.join(dir, ".thumbs");
    const thumbPath = path.join(thumbDir, `${base}-w${width}.webp`);

    try {
      const buffer = await readFile(thumbPath);
      return { buffer, contentType: "image/webp" };
    } catch {
      // aún no generada, seguimos
    }

    try {
      const original = await readFile(filePath);
      const buffer = await sharp(original)
        .rotate()
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: 72 })
        .toBuffer();
      await mkdir(thumbDir, { recursive: true });
      await writeFile(thumbPath, buffer);
      return { buffer, contentType: "image/webp" };
    } catch {
      // si sharp falla (p.ej. formato raro), servimos el original
    }
  }

  const buffer = await readFile(filePath);
  return { buffer, contentType: MIME_TYPES[ext] || "application/octet-stream" };
}

export function parseWidth(searchParams: URLSearchParams): number | null {
  const raw = searchParams.get("w");
  if (!raw) return null;
  const n = Math.floor(Number(raw));
  if (!Number.isFinite(n) || n <= 0) return null;
  return Math.min(n, 1600);
}
