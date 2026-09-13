import { NOMBRES } from "@/lib/content";

export default async function EntrarPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; error?: string }>;
}) {
  const { from = "/", error } = await searchParams;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <h1 className="font-serif text-4xl font-medium">
        {NOMBRES.novio1} <span className="text-accent">&amp;</span> {NOMBRES.novio2}
      </h1>
      <p className="text-muted">Introduce la contraseña que os hemos compartido.</p>

      <form action="/api/entrar" method="POST" className="flex flex-col items-center gap-3">
        <input type="hidden" name="from" value={from} />
        <input
          type="password"
          name="password"
          autoFocus
          className="w-64 rounded-full border border-line bg-background px-5 py-2 text-center focus:border-accent focus:outline-none"
        />
        {error && <p className="text-sm text-red-700">Contraseña incorrecta, inténtalo de nuevo.</p>}
        <button
          type="submit"
          className="rounded-full bg-accent px-8 py-2 text-sm tracking-wide text-background uppercase transition hover:opacity-90"
        >
          Entrar
        </button>
      </form>
    </main>
  );
}
