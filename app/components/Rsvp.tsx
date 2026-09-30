"use client";

import { useState } from "react";

type Estado = "idle" | "enviando" | "ok" | "error";

export default function Rsvp() {
  const [nombre, setNombre] = useState("");
  const [asistencia, setAsistencia] = useState<"si" | "no" | "">("");
  const [acompanantes, setAcompanantes] = useState("");
  const [nombresAcompanantes, setNombresAcompanantes] = useState("");
  const [alergias, setAlergias] = useState("");
  const [estado, setEstado] = useState<Estado>("idle");

  const numAcompanantes = Number(acompanantes) || 0;

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (!nombre.trim() || !asistencia) return;
    setEstado("enviando");
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          asistencia,
          acompanantes: numAcompanantes,
          nombresAcompanantes,
          alergias,
        }),
      });
      setEstado(res.ok ? "ok" : "error");
    } catch {
      setEstado("error");
    }
  }

  if (estado === "ok") {
    return (
      <section id="rsvp" className="mx-auto max-w-md px-6 py-16 text-center">
        <p className="mb-2 text-xs tracking-[0.35em] uppercase text-accent">Confirmación</p>
        <h2 className="mb-4 font-serif text-4xl font-medium">¡Gracias, {nombre}!</h2>
        <p className="text-muted">
          {asistencia === "si"
            ? "Hemos apuntado que vienes. ¡Nos vemos el 7 de diciembre!"
            : "Hemos apuntado que no podrás venir. ¡Gracias por avisar!"}
        </p>
      </section>
    );
  }

  return (
    <section id="rsvp" className="mx-auto max-w-md px-6 py-16 text-center">
      <p className="mb-2 text-xs tracking-[0.35em] uppercase text-accent">Confirmación</p>
      <h2 className="mb-4 font-serif text-4xl font-medium">¿Vienes?</h2>
      <p className="mb-8 text-muted">Confírmanos tu asistencia antes de que sea tarde.</p>

      <form onSubmit={enviar} className="flex flex-col gap-4 text-left">
        <div>
          <label className="mb-1 block text-xs text-muted">Nombre y apellidos</label>
          <input
            required
            className="w-full rounded-lg border border-line px-3 py-2"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1 block text-xs text-muted">¿Asistirás?</label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setAsistencia("si")}
              className={`flex-1 rounded-full px-4 py-2 text-sm ${asistencia === "si" ? "bg-accent text-white" : "border border-line text-muted"}`}
            >
              Sí, allí estaré
            </button>
            <button
              type="button"
              onClick={() => setAsistencia("no")}
              className={`flex-1 rounded-full px-4 py-2 text-sm ${asistencia === "no" ? "bg-accent text-white" : "border border-line text-muted"}`}
            >
              No podré ir
            </button>
          </div>
        </div>

        {asistencia === "si" && (
          <>
            <div>
              <label className="mb-1 block text-xs text-muted">Acompañantes (aparte de ti)</label>
              <input
                type="number"
                min={0}
                inputMode="numeric"
                className="w-full rounded-lg border border-line px-3 py-2"
                value={acompanantes}
                onFocus={(e) => e.target.select()}
                onChange={(e) => {
                  const valor = e.target.value;
                  if (valor === "" || Number(valor) < 0) {
                    setAcompanantes("");
                  } else {
                    setAcompanantes(String(Math.floor(Number(valor))));
                  }
                }}
              />
            </div>

            {numAcompanantes > 0 && (
              <div>
                <label className="mb-1 block text-xs text-muted">
                  Nombre de tus acompañantes
                </label>
                <textarea
                  className="w-full rounded-lg border border-line px-3 py-2"
                  rows={2}
                  placeholder="Uno por línea"
                  value={nombresAcompanantes}
                  onChange={(e) => setNombresAcompanantes(e.target.value)}
                />
              </div>
            )}

            <div>
              <label className="mb-1 block text-xs text-muted">
                Alergias o restricciones alimentarias (opcional)
              </label>
              <textarea
                className="w-full rounded-lg border border-line px-3 py-2"
                rows={2}
                value={alergias}
                onChange={(e) => setAlergias(e.target.value)}
              />
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={!nombre.trim() || !asistencia || estado === "enviando"}
          className="mt-2 rounded-full bg-accent px-6 py-3 text-sm tracking-wide text-white uppercase disabled:opacity-40"
        >
          {estado === "enviando" ? "Enviando..." : "Confirmar"}
        </button>

        {estado === "error" && (
          <p className="text-sm text-red-700">Algo ha fallado. Inténtalo de nuevo.</p>
        )}
      </form>
    </section>
  );
}
