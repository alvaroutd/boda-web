import { NextRequest, NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { getContent, DATA_DIR } from "@/lib/content-store";
import { getPublicOrigin } from "@/lib/origin";

export const runtime = "nodejs";

const MIME_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

export async function GET(request: NextRequest) {
  const content = await getContent();

  if (content.heroImage) {
    try {
      const filePath = path.join(DATA_DIR, content.heroImage);
      const buffer = await readFile(filePath);
      const ext = path.extname(content.heroImage);
      return new NextResponse(new Uint8Array(buffer), {
        headers: {
          "Content-Type": MIME_TYPES[ext] || "application/octet-stream",
          "Cache-Control": "no-store",
        },
      });
    } catch {
      // cae al placeholder si el archivo no existe
    }
  }

  return NextResponse.redirect(new URL("/halloween.jpg", getPublicOrigin(request)), {
    status: 302,
  });
}
