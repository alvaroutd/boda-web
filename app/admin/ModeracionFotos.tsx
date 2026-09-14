"use client";

import { useEffect, useState } from "react";

type Foto = { nombre: string; tipo: "imagen" | "video" };

export default function ModeracionFotos() {
  const [fotos, setFotos] = useState<Foto[] | null>(null);
  const [seleccionadas, setSeleccionadas] = useState<Set<string>>(new Set());
  const [status, setStatus] = useState<string | null>(null);

  async function cargar() {
    const res = await fetch("/api/admin/fotos");
    if (res.ok) {
      const data = await res.json();
      setFotos(data.fotos);
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  function toggle(nombre: string) {
    setSeleccionadas((s) => {
      const copia = new Set(s);
      if (copia.has(nombre)) copia.delete(nombre);
      else copia.add(nombre);
      return copia;
    });
  }

  function seleccionarTodas() {
    if (!fotos) return;
    setSeleccionadas(new Set(fotos.map((f) => f.nombre)));
  }

  function deseleccionarTodas() {
    setSeleccionadas(new Set());
  }

  async function eliminarSeleccionadas() {
    if (seleccionadas.size === 0 || !fotos) return;
    if (!confirm(`¿Eliminar ${seleccionadas.size} foto(s)? No se puede deshacer.`)) return;
    setStatus("Eliminando...");
    for (const nombre of seleccionadas) {
      await fetch("/api/admin/fotos", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre }),
      });
    }
    setFotos(fotos.filter((f) => !seleccionadas.has(f.nombre)));
    setSeleccionadas(new Set());
    setStatus("Eliminadas.");
  }

  async function descargar(nombres: string[]) {
    setStatus("Preparando descarga...");
    const res = await fetch("/api/admin/fotos/descargar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombres }),
    });
    if (!res.ok) {
      setStatus("Error al descargar.");
      return;
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "fotos-boda.zip";
    a.click();
    URL.revokeObjectURL(url);
    setStatus(null);
  }

  if (!fotos) return null;

  return (
    <section className="mb-10">
      <h2 className="mb-3 text-sm uppercase tracking-wide text-muted">
        Fotos y vídeos de invitados ({fotos.length})
      </h2>

      {fotos.length === 0 ? (
        <p className="text-sm text-muted">Aún no hay fotos subidas.</p>
      ) : (
        <>
          <div className="mb-3 flex flex-wrap gap-2 text-sm">
            <button type="button" onClick={seleccionarTodas} className="text-accent underline">
              Seleccionar todas
            </button>
            <button type="button" onClick={deseleccionarTodas} className="text-muted underline">
              Deseleccionar
            </button>
            <button
              type="button"
              onClick={() => descargar(Array.from(seleccionadas))}
              disabled={seleccionadas.size === 0}
              className="rounded-full bg-accent px-4 py-1 text-white disabled:opacity-40"
            >
              Descargar seleccionadas ({seleccionadas.size})
            </button>
            <button
              type="button"
              onClick={() => descargar([])}
              className="rounded-full border border-accent px-4 py-1 text-accent"
            >
              Descargar todas
            </button>
            <button
              type="button"
              onClick={eliminarSeleccionadas}
              disabled={seleccionadas.size === 0}
              className="rounded-full border border-red-700 px-4 py-1 text-red-700 disabled:opacity-40"
            >
              Eliminar seleccionadas
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
            {fotos.map((foto) => (
              <label key={foto.nombre} className="relative block aspect-square cursor-pointer">
                {foto.tipo === "video" ? (
                  <video
                    src={`/api/fotos/${foto.nombre}`}
                    className="h-full w-full rounded-lg object-cover"
                    muted
                    preload="metadata"
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={`/api/fotos/${foto.nombre}`}
                    alt=""
                    className="h-full w-full rounded-lg object-cover"
                    loading="lazy"
                  />
                )}
                <input
                  type="checkbox"
                  checked={seleccionadas.has(foto.nombre)}
                  onChange={() => toggle(foto.nombre)}
                  className="absolute top-1 left-1 h-5 w-5"
                />
              </label>
            ))}
          </div>
        </>
      )}

      {status && <p className="mt-2 text-sm text-muted">{status}</p>}
    </section>
  );
}
