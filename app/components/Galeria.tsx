"use client";

import { useEffect, useState } from "react";

type Foto = { nombre: string; tipo: "imagen" | "video" };

export default function Galeria() {
  const [fotos, setFotos] = useState<Foto[] | null>(null);

  async function cargar() {
    try {
      const res = await fetch("/api/fotos");
      if (!res.ok) return;
      const data = await res.json();
      setFotos(data.fotos);
    } catch {
      setFotos([]);
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  if (!fotos || fotos.length === 0) return null;

  return (
    <section id="galeria" className="mx-auto max-w-4xl px-6 py-24">
      <p className="mb-2 text-center text-xs tracking-[0.35em] uppercase text-accent">
        Recuerdos
      </p>
      <h2 className="mb-10 text-center font-serif text-4xl font-medium">
        Fotos de todos
      </h2>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {fotos.map((foto) => (
          <div key={foto.nombre} className="aspect-square overflow-hidden rounded-lg bg-line">
            {foto.tipo === "video" ? (
              <video
                src={`/api/fotos/${foto.nombre}`}
                className="h-full w-full object-cover"
                controls
                preload="metadata"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`/api/fotos/${foto.nombre}`}
                alt=""
                className="h-full w-full object-cover"
                loading="lazy"
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
