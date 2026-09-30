import { NextRequest, NextResponse } from "next/server";
import path from "node:path";
import { getContent, DATA_DIR } from "@/lib/content-store";
import { getPublicOrigin } from "@/lib/origin";
import { readImageOrThumb } from "@/lib/image-serve";

export const runtime = "nodejs";

const HERO_DIR = path.join(DATA_DIR, "hero");

// Ancho suficiente para pantallas grandes a pantalla completa, sin servir
// fotos de móvil a resolución completa (varios MB) como fondo.
const HERO_WIDTH = 1600;

export async function GET(request: NextRequest) {
  const content = await getContent();

  if (content.heroImages.length > 0) {
    const nombre = content.heroImages[Math.floor(Math.random() * content.heroImages.length)];

    // Los archivos nuevos viven en DATA_DIR/hero; los de la versión anterior
    // (una sola foto) se guardaron directamente en la raíz de DATA_DIR.
    for (const filePath of [path.join(HERO_DIR, nombre), path.join(DATA_DIR, nombre)]) {
      try {
        const { buffer, contentType } = await readImageOrThumb(filePath, HERO_WIDTH);
        return new NextResponse(new Uint8Array(buffer), {
          headers: {
            "Content-Type": contentType,
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
