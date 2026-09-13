export const AUTH_COOKIE = "boda_auth";

async function sha256(text: string) {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function expectedToken() {
  const password = process.env.WEDDING_PASSWORD ?? "";
  const secret = process.env.AUTH_SECRET ?? "";
  return sha256(`${password}:${secret}`);
}

export async function isValidPassword(candidate: string) {
  return candidate === (process.env.WEDDING_PASSWORD ?? "");
}
