import { NextRequest, NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { getContent, DATA_DIR } from "@/lib/content-store";
import { getPublicOrigin } from "@/lib/origin";

export const runtime = "nodejs";

const HERO_DIR = path.join(DATA_DIR, "hero");

const MIME_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

export async function GET(request: NextRequest) {
  const content = await getContent();

  if (content.heroImages.length > 0) {
    const nombre = content.heroImages[Math.floor(Math.random() * content.heroImages.length)];

    // Los archivos nuevos viven en DATA_DIR/hero; los de la versión anterior
    // (una sola foto) se guardaron directamente en la raíz de DATA_DIR.
    for (const filePath of [path.join(HERO_DIR, nombre), path.join(DATA_DIR, nombre)]) {
      try {
        const buffer = await readFile(filePath);
        const ext = path.extname(nombre);
        return new NextResponse(new Uint8Array(buffer), {
          headers: {
            "Content-Type": MIME_TYPES[ext] || "application/octet-stream",
            "Cache-Control": "no-store",
          },
        });
      } catch {
        // prueba la siguiente ubicación
      }
    }
  }

  return NextResponse.redirect(new URL("/halloween.jpg", getPublicOrigin(request)), {
    status: 302,
  });
}
