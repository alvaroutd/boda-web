import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { AUTH_COOKIE, expectedToken } from "@/lib/auth";

export const runtime = "nodejs";

// En el VPS, apunta esto (con la variable de entorno UPLOAD_DIR) a una carpeta
// persistente fuera del directorio de despliegue, para que no se borre en cada deploy.
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads");

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
