import { NextRequest, NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { AUTH_COOKIE, expectedToken } from "@/lib/auth";

export const runtime = "nodejs";

const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads");

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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ nombre: string }> }
) {
  const cookie = request.cookies.get(AUTH_COOKIE)?.value;
  if (cookie !== (await expectedToken())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { nombre } = await params;
  const safeName = path.basename(nombre);

  try {
    const buffer = await readFile(path.join(UPLOAD_DIR, safeName));
    const ext = path.extname(safeName).toLowerCase();
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": MIME_TYPES[ext] || "application/octet-stream",
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }
}
