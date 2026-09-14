import { NextRequest, NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { AUTH_COOKIE, expectedToken } from "@/lib/auth";
import { DATA_DIR } from "@/lib/content-store";

export const runtime = "nodejs";

const FINCA_DIR = path.join(DATA_DIR, "finca");

const MIME_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
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
    const buffer = await readFile(path.join(FINCA_DIR, safeName));
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
