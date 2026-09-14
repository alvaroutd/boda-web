import { NextRequest } from "next/server";

// Detrás de un proxy inverso (como el de Plesk), la URL interna que ve Next.js
// puede no coincidir con el dominio público (ej. localhost:3000 en vez de
// sietedediciembre.com). Reconstruimos el origen real a partir de las
// cabeceras que reenvía el proxy.
export function getPublicOrigin(request: NextRequest) {
  const proto =
    request.headers.get("x-forwarded-proto") ?? request.nextUrl.protocol.replace(":", "");
  const host =
    request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? request.nextUrl.host;
  return `${proto}://${host}`;
}
