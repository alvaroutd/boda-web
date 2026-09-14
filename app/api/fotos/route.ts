import { NextRequest, NextResponse } from "next/server";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { AUTH_COOKIE, expectedToken } from "@/lib/auth";

export const runtime = "nodejs";

const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads");

const VIDEO_EXT = new Set([".mp4", ".mov", ".webm", ".m4v"]);

export async function GET(request: NextRequest) {
  const cookie = request.cookies.get(AUTH_COOKIE)?.value;
  if (cookie !== (await expectedToken())) {
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
