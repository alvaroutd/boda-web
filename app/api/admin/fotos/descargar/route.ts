import { NextRequest, NextResponse } from "next/server";
import { Readable } from "node:stream";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { ZipArchive } from "archiver";
import { ADMIN_AUTH_COOKIE, adminExpectedToken } from "@/lib/auth";

export const runtime = "nodejs";

const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads");

export async function POST(request: NextRequest) {
  const cookie = request.cookies.get(ADMIN_AUTH_COOKIE)?.value;
  if (cookie !== (await adminExpectedToken())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { nombres } = (await request.json()) as { nombres?: string[] };

  let archivos: string[];
  if (nombres && nombres.length > 0) {
    archivos = nombres.map((n) => path.basename(n));
  } else {
    archivos = (await readdir(UPLOAD_DIR)).filter((n) => !n.startsWith("."));
  }

  const archive = new ZipArchive({ zlib: { level: 6 } });
  for (const nombre of archivos) {
    archive.file(path.join(UPLOAD_DIR, nombre), { name: nombre });
  }
  archive.finalize();

  return new NextResponse(Readable.toWeb(archive) as ReadableStream, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="fotos-boda.zip"`,
    },
  });
}
