import { NextRequest, NextResponse } from "next/server";
import path from "node:path";
import { ADMIN_AUTH_COOKIE, adminExpectedToken } from "@/lib/auth";
import { DATA_DIR } from "@/lib/content-store";
import { readImageOrThumb, parseWidth } from "@/lib/image-serve";

export const runtime = "nodejs";

const HERO_DIR = path.join(DATA_DIR, "hero");

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
  const width = parseWidth(request.nextUrl.searchParams);

  for (const filePath of [path.join(HERO_DIR, safeName), path.join(DATA_DIR, safeName)]) {
    try {
      const { buffer, contentType } = await readImageOrThumb(filePath, width);
      return new NextResponse(new Uint8Array(buffer), {
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "private, max-age=3600",
        },
      });
    } catch {
      // prueba la siguiente ubicación
    }
  }

  return NextResponse.json({ error: "No encontrado" }, { status: 404 });
}
