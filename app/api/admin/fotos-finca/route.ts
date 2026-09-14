import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir, unlink } from "node:fs/promises";
import path from "node:path";
import { ADMIN_AUTH_COOKIE, adminExpectedToken } from "@/lib/auth";
import { getContent, saveContent, DATA_DIR } from "@/lib/content-store";

export const runtime = "nodejs";

const FINCA_DIR = path.join(DATA_DIR, "finca");

export async function POST(request: NextRequest) {
  const cookie = request.cookies.get(ADMIN_AUTH_COOKIE)?.value;
  if (cookie !== (await adminExpectedToken())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No se ha recibido ningún archivo" }, { status: 400 });
  }

  const ext = path.extname(file.name) || ".jpg";
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;

  await mkdir(FINCA_DIR, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(FINCA_DIR, fileName), buffer);

  const content = await getContent();
  await saveContent({ ...content, fotosFinca: [...content.fotosFinca, fileName] });

  return NextResponse.json({ ok: true, fileName });
}

export async function DELETE(request: NextRequest) {
  const cookie = request.cookies.get(ADMIN_AUTH_COOKIE)?.value;
  if (cookie !== (await adminExpectedToken())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { nombre } = (await request.json()) as { nombre: string };
  const safeName = path.basename(nombre);

  try {
    await unlink(path.join(FINCA_DIR, safeName));
  } catch {
    // ya no existía
  }

  const content = await getContent();
  await saveContent({
    ...content,
    fotosFinca: content.fotosFinca.filter((n) => n !== safeName),
  });

  return NextResponse.json({ ok: true });
}
