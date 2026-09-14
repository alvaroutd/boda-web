import { cookies } from "next/headers";
import { ADMIN_AUTH_COOKIE, adminExpectedToken } from "@/lib/auth";
import { getContent } from "@/lib/content-store";
import AdminForm from "./AdminForm";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const cookieStore = await cookies();
  const cookie = cookieStore.get(ADMIN_AUTH_COOKIE)?.value;
  const isAuthed = cookie === (await adminExpectedToken());

  if (!isAuthed) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
        <h1 className="font-serif text-3xl">Administración</h1>
        <form action="/api/admin/entrar" method="POST" className="flex flex-col gap-3">
          <input
            type="password"
            name="password"
            placeholder="Contraseña de administración"
            className="rounded-full border border-line px-5 py-3 text-center focus:outline-none focus:ring-2 focus:ring-accent"
            autoFocus
          />
          <button
            type="submit"
            className="rounded-full bg-accent px-5 py-3 text-sm tracking-wide text-white"
          >
            ENTRAR
          </button>
          {error && <p className="text-sm text-accent">Contraseña incorrecta.</p>}
        </form>
      </main>
    );
  }

  const content = await getContent();
  return <AdminForm initialContent={content} />;
}
