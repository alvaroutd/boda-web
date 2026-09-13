const MOMENTOS = [
  { titulo: "Ceremonia simbólica" },
  { titulo: "Banquete" },
  { titulo: "Fiesta" },
];

export default function ElDia() {
  return (
    <section id="el-dia" className="mx-auto max-w-3xl px-6 py-24">
      <h2 className="mb-2 text-center text-3xl font-serif">El gran día</h2>
      <p className="mb-2 text-center text-neutral-600">
        7 de diciembre de 2026 &middot; El Tinto
      </p>
      <p className="mb-12 text-center text-neutral-600">
        Os esperamos a las <strong>13:00</strong>
      </p>

      <ol className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        {MOMENTOS.map((momento, i) => (
          <li key={momento.titulo} className="flex items-center gap-4">
            <span className="text-lg font-serif">{momento.titulo}</span>
            {i < MOMENTOS.length - 1 && (
              <span className="hidden text-neutral-400 sm:inline">&rarr;</span>
            )}
          </li>
        ))}
      </ol>

      <div className="mt-12">
        <h3 className="mb-3 text-lg font-medium">Cómo llegar</h3>
        <p className="mb-4 text-neutral-600">
          Finca El Tinto &middot; Carretera de Olías, Km 7,7, 29018 Málaga
        </p>
        <iframe
          title="Mapa a Finca El Tinto"
          className="h-64 w-full rounded-lg border-0"
          loading="lazy"
          src="https://www.google.com/maps?q=Carretera+de+Ol%C3%ADas+Km+7.7+29018+M%C3%A1laga&output=embed"
        />
      </div>
    </section>
  );
}
