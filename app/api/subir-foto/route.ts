import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { AUTH_COOKIE, expectedToken } from "@/lib/auth";

export const runtime = "nodejs";

// En el VPS, apunta esto (con la variable de entorno UPLOAD_DIR) a una carpeta
// persistente fuera del directorio de despliegue, para que no se borre en cada deploy.
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads");

const MAX_IMAGEN_BYTES = 20 * 1024 * 1024; // 20 MB
const MAX_VIDEO_BYTES = 50 * 1024 * 1024; // 50 MB

export async function POST(request: NextRequest) {
  const cookie = request.cookies.get(AUTH_COOKIE)?.value;
  if (cookie !== (await expectedToken())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No se ha recibido ningún archivo" }, { status: 400 });
  }

  const esVideo = file.type.startsWith("video/");
  const limite = esVideo ? MAX_VIDEO_BYTES : MAX_IMAGEN_BYTES;
  if (file.size > limite) {
    const limiteMB = Math.round(limite / (1024 * 1024));
    return NextResponse.json(
      {
        error: esVideo
          ? `Ese vídeo pesa demasiado (máximo ${limiteMB} MB). Mándanoslo mejor por WhatsApp.`
          : `Esa foto pesa demasiado (máximo ${limiteMB} MB).`,
      },
      { status: 413 }
    );
  }

  try {
    await mkdir(UPLOAD_DIR, { recursive: true });

    const ext = path.extname(file.name) || "";
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
    const destination = path.join(UPLOAD_DIR, safeName);

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(destination, buffer);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error guardando el archivo:", err);
    return NextResponse.json({ error: "Error al subir el archivo" }, { status: 500 });
  }
}
