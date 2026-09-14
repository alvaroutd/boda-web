import { NextRequest, NextResponse } from "next/server";
import { readdir, unlink } from "node:fs/promises";
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

  const fotos = archivos
    .filter((nombre) => !nombre.startsWith("."))
    .sort()
    .reverse()
    .map((nombre) => ({
      nombre,
      tipo: VIDEO_EXT.has(path.extname(nombre).toLowerCase()) ? "video" : "imagen",
    }));

  return NextResponse.json({ fotos });
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
