import { NextRequest, NextResponse } from "next/server";
import path from "node:path";
import { AUTH_COOKIE, expectedToken, ADMIN_AUTH_COOKIE, adminExpectedToken } from "@/lib/auth";
import { readImageOrThumb, parseWidth } from "@/lib/image-serve";

export const runtime = "nodejs";

const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads");

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ nombre: string }> }
) {
  const cookie = request.cookies.get(AUTH_COOKIE)?.value;
  const adminCookie = request.cookies.get(ADMIN_AUTH_COOKIE)?.value;
  const esInvitado = cookie === (await expectedToken());
  const esAdmin = adminCookie === (await adminExpectedToken());
  if (!esInvitado && !esAdmin) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { nombre } = await params;
  const safeName = path.basename(nombre);
  const width = parseWidth(request.nextUrl.searchParams);

  try {
    const { buffer, contentType } = await readImageOrThumb(path.join(UPLOAD_DIR, safeName), width);
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }
}
