import { NextRequest, NextResponse } from "next/server";
import { readdir, unlink, stat } from "node:fs/promises";
import path from "node:path";
import { ADMIN_AUTH_COOKIE, adminExpectedToken } from "@/lib/auth";

export const runtime = "nodejs";

const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads");

const VIDEO_EXT = new Set([".mp4", ".mov", ".webm", ".m4v"]);

export async function GET(request: NextRequest) {
  const cookie = request.cookies.get(ADMIN_AUTH_COOKIE)?.value;
  if (cookie !== (await adminExpectedToken())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  let archivos: string[] = [];
  try {
    archivos = await readdir(UPLOAD_DIR);
  } catch {
    archivos = [];
  }

  const nombres = archivos.filter((nombre) => !nombre.startsWith(".")).sort().reverse();

  const fotos = await Promise.all(
    nombres.map(async (nombre) => {
      const stats = await stat(path.join(UPLOAD_DIR, nombre)).catch(() => null);
      return {
        nombre,
        tipo: VIDEO_EXT.has(path.extname(nombre).toLowerCase()) ? "video" : "imagen",
        bytes: stats?.size ?? 0,
      };
    })
  );

  const totalBytes = fotos.reduce((sum, f) => sum + f.bytes, 0);

  return NextResponse.json({ fotos, totalBytes });
}

export async function DELETE(request: NextRequest) {
  const cookie = request.cookies.get(ADMIN_AUTH_COOKIE)?.value;
  if (cookie !== (await adminExpectedToken())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { nombre } = (await request.json()) as { nombre: string };
  const safeName = path.basename(nombre);

  try {
    await unlink(path.join(UPLOAD_DIR, safeName));
  } catch {
    // ya no existía
  }

  return NextResponse.json({ ok: true });
}
