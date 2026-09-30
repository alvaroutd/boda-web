import { NextRequest, NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { ADMIN_AUTH_COOKIE, adminExpectedToken } from "@/lib/auth";
import { DATA_DIR } from "@/lib/content-store";

export const runtime = "nodejs";

const HERO_DIR = path.join(DATA_DIR, "hero");

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
  const cookie = request.cookies.get(ADMIN_AUTH_COOKIE)?.value;
  if (cookie !== (await adminExpectedToken())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { nombre } = await params;
  const safeName = path.basename(nombre);

  for (const filePath of [path.join(HERO_DIR, safeName), path.join(DATA_DIR, safeName)]) {
    try {
      const buffer = await readFile(filePath);
      const ext = path.extname(safeName).toLowerCase();
      return new NextResponse(new Uint8Array(buffer), {
        headers: {
          "Content-Type": MIME_TYPES[ext] || "application/octet-stream",
          "Cache-Control": "private, max-age=3600",
        },
      });
    } catch {
      // prueba la siguiente ubicación
    }
  }

  return NextResponse.json({ error: "No encontrado" }, { status: 404 });
}
