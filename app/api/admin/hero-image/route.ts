import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { ADMIN_AUTH_COOKIE, adminExpectedToken } from "@/lib/auth";
import { getContent, saveContent, DATA_DIR } from "@/lib/content-store";

export const runtime = "nodejs";

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
  const fileName = `hero-image${ext}`;

  await mkdir(DATA_DIR, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(DATA_DIR, fileName), buffer);

  const content = await getContent();
  await saveContent({ ...content, heroImage: fileName });

  return NextResponse.json({ ok: true });
}
