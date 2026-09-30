"use client";

import { useEffect, useState } from "react";

type Rsvp = {
  id: string;
  nombre: string;
  asistencia: "si" | "no";
  acompanantes: number;
  alergias: string;
  fecha: string;
};

export default function ListaRsvps() {
  const [rsvps, setRsvps] = useState<Rsvp[] | null>(null);

  function cargar() {
    fetch("/api/admin/rsvps")
      .then((res) => (res.ok ? res.json() : { rsvps: [] }))
      .then((data) => setRsvps(data.rsvps))
      .catch(() => setRsvps([]));
  }

  useEffect(cargar, []);

  async function eliminar(id: string) {
    await fetch("/api/admin/rsvps", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    cargar();
  }

  function descargarCsv() {
    if (!rsvps) return;
    const filas = [
      ["Nombre", "Asistencia", "Acompañantes", "Alergias", "Fecha"],
      ...rsvps.map((r) => [
        r.nombre,
        r.asistencia === "si" ? "Sí" : "No",
        String(r.acompanantes),
        r.alergias,
        new Date(r.fecha).toLocaleString("es-ES"),
      ]),
    ];
    const csv = filas.map((fila) => fila.map((c) => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "confirmaciones.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!rsvps) return null;

  const confirmados = rsvps.filter((r) => r.asistencia === "si");
  const totalPersonas = confirmados.reduce((sum, r) => sum + 1 + r.acompanantes, 0);

  return (
    <section className="mb-10">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm uppercase tracking-wide text-muted">
          Confirmaciones de asistencia ({rsvps.length}, {totalPersonas} personas vienen)
        </h2>
        {rsvps.length > 0 && (
          <button
            type="button"
            onClick={descargarCsv}
            className="rounded-full border border-accent px-4 py-1 text-xs text-accent"
          >
            Descargar CSV
          </button>
        )}
      </div>

      {rsvps.length === 0 ? (
        <p className="text-sm text-muted">Todavía no hay confirmaciones.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-line">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line bg-line/30">
                <th className="px-3 py-2">Nombre</th>
                <th className="px-3 py-2">Viene</th>
                <th className="px-3 py-2">+</th>
                <th className="px-3 py-2">Alergias</th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {rsvps.map((r) => (
                <tr key={r.id} className="border-b border-line last:border-0">
                  <td className="px-3 py-2">{r.nombre}</td>
                  <td className="px-3 py-2">{r.asistencia === "si" ? "Sí" : "No"}</td>
                  <td className="px-3 py-2">{r.acompanantes}</td>
                  <td className="px-3 py-2">{r.alergias || "—"}</td>
                  <td className="px-3 py-2 text-right">
                    <button
                      type="button"
                      onClick={() => eliminar(r.id)}
                      className="text-xs text-accent"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
