export default async function EntrarPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; error?: string }>;
}) {
  const { from = "/", error } = await searchParams;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <h1 className="text-3xl font-serif">Álvaro &amp; Luisma</h1>
      <p className="text-neutral-600">Introduce la contraseña que os hemos compartido.</p>

      <form action="/api/entrar" method="POST" className="flex flex-col items-center gap-3">
        <input type="hidden" name="from" value={from} />
        <input
          type="password"
          name="password"
          autoFocus
          className="w-64 rounded-lg border border-neutral-300 px-4 py-2 text-center"
        />
        {error && <p className="text-sm text-red-600">Contraseña incorrecta, inténtalo de nuevo.</p>}
        <button
          type="submit"
          className="rounded-lg bg-neutral-900 px-6 py-2 text-white hover:bg-neutral-700"
        >
          Entrar
        </button>
      </form>
    </main>
  );
}
