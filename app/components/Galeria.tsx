"use client";

import { useEffect, useMemo, useState } from "react";

type Foto = { nombre: string; tipo: "imagen" | "video" };
type Filtro = "todas" | "imagen" | "video";

const PAGINA = 30;

export default function Galeria() {
  const [fotos, setFotos] = useState<Foto[] | null>(null);
  const [filtro, setFiltro] = useState<Filtro>("todas");
  const [visibles, setVisibles] = useState(PAGINA);
  const [abierta, setAbierta] = useState<number | null>(null);

  useEffect(() => {
    function cargar() {
      fetch("/api/fotos")
        .then((res) => (res.ok ? res.json() : { fotos: [] }))
        .then((data) => setFotos(data.fotos))
        .catch(() => setFotos([]));
    }
    cargar();
    window.addEventListener("fotos-subidas", cargar);
    return () => window.removeEventListener("fotos-subidas", cargar);
  }, []);

  const filtradas = useMemo(() => {
    if (!fotos) return [];
    if (filtro === "todas") return fotos;
    return fotos.filter((f) => f.tipo === filtro);
  }, [fotos, filtro]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (abierta === null) return;
      if (e.key === "Escape") setAbierta(null);
      if (e.key === "ArrowRight")
        setAbierta((i) => (i === null ? null : Math.min(i + 1, filtradas.length - 1)));
      if (e.key === "ArrowLeft") setAbierta((i) => (i === null ? null : Math.max(i - 1, 0)));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [abierta, filtradas]);

  if (!fotos || fotos.length === 0) return null;

  const numFotos = fotos.filter((f) => f.tipo === "imagen").length;
  const numVideos = fotos.filter((f) => f.tipo === "video").length;
  const mostradas = filtradas.slice(0, visibles);
  const actual = abierta !== null ? filtradas[abierta] : null;

  function cambiarFiltro(f: Filtro) {
    setFiltro(f);
    setVisibles(PAGINA);
    setAbierta(null);
  }

  return (
    <section id="galeria" className="mx-auto max-w-6xl px-6 py-24">
      <p className="mb-2 text-center text-xs tracking-[0.35em] uppercase text-accent">
        Recuerdos
      </p>
      <h2 className="mb-2 text-center font-serif text-4xl font-medium">Fotos de todos</h2>
      <p className="mb-6 text-center text-sm text-muted">
        Toca una foto para verla en grande y descargarla.
      </p>

      <div className="mb-8 flex justify-center gap-2">
        <button
          type="button"
          onClick={() => cambiarFiltro("todas")}
          className={`rounded-full px-4 py-1 text-sm ${filtro === "todas" ? "bg-accent text-white" : "border border-line text-muted"}`}
        >
          Todas ({fotos.length})
        </button>
        {numFotos > 0 && (
          <button
            type="button"
            onClick={() => cambiarFiltro("imagen")}
            className={`rounded-full px-4 py-1 text-sm ${filtro === "imagen" ? "bg-accent text-white" : "border border-line text-muted"}`}
          >
            Fotos ({numFotos})
          </button>
        )}
        {numVideos > 0 && (
          <button
            type="button"
            onClick={() => cambiarFiltro("video")}
            className={`rounded-full px-4 py-1 text-sm ${filtro === "video" ? "bg-accent text-white" : "border border-line text-muted"}`}
          >
            Vídeos ({numVideos})
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {mostradas.map((foto, i) => (
          <button
            key={foto.nombre}
            type="button"
            onClick={() => setAbierta(i)}
            className="relative aspect-square overflow-hidden rounded-lg bg-line"
          >
            {foto.tipo === "video" ? (
              <>
                <video
                  src={`/api/fotos/${foto.nombre}`}
                  className="h-full w-full object-cover"
                  preload="metadata"
                  muted
                />
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-lg text-white">
                    ▶
                  </span>
                </span>
              </>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`/api/fotos/${foto.nombre}`}
                alt=""
                className="h-full w-full object-cover"
                loading="lazy"
              />
            )}
          </button>
        ))}
      </div>

      {visibles < filtradas.length && (
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => setVisibles((v) => v + PAGINA)}
            className="rounded-full border border-accent px-6 py-2 text-sm text-accent"
          >
            Cargar más ({filtradas.length - visibles} restantes)
          </button>
        </div>
      )}

      {actual && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 p-4"
          onClick={() => setAbierta(null)}
        >
          <div
            className="relative flex max-h-full max-w-full flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {actual.tipo === "video" ? (
              <video
                src={`/api/fotos/${actual.nombre}`}
                className="max-h-[80vh] max-w-full rounded-lg"
                controls
                autoPlay
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`/api/fotos/${actual.nombre}`}
                alt=""
                className="max-h-[80vh] max-w-full rounded-lg object-contain"
              />
            )}

            <div className="mt-4 flex gap-3">
              <a
                href={`/api/fotos/${actual.nombre}`}
                download
                className="rounded-full bg-accent px-5 py-2 text-sm text-white"
              >
                Descargar
              </a>
              <button
                type="button"
                onClick={() => setAbierta(null)}
                className="rounded-full border border-white/40 px-5 py-2 text-sm text-white"
              >
                Cerrar
              </button>
            </div>
          </div>

          {abierta !== null && abierta > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setAbierta((i) => (i !== null ? i - 1 : i));
              }}
              className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white"
              aria-label="Anterior"
            >
              ‹
            </button>
          )}
          {abierta !== null && abierta < filtradas.length - 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setAbierta((i) => (i !== null ? i + 1 : i));
              }}
              className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white"
              aria-label="Siguiente"
            >
              ›
            </button>
          )}
        </div>
      )}
    </section>
  );
}
