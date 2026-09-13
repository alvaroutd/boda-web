"use client";

import { useRef, useState } from "react";

type Estado = "idle" | "subiendo" | "ok" | "error";

export default function SubeFotos() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [estado, setEstado] = useState<Estado>("idle");
  const [subidas, setSubidas] = useState(0);
  const [total, setTotal] = useState(0);

  async function subirArchivos(files: FileList) {
    setEstado("subiendo");
    setTotal(files.length);
    setSubidas(0);

    let huboError = false;

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/subir-foto", { method: "POST", body: formData });
        if (!res.ok) huboError = true;
      } catch {
        huboError = true;
      }
      setSubidas((n) => n + 1);
    }

    setEstado(huboError ? "error" : "ok");
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <section id="fotos" className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h2 className="mb-4 text-3xl font-serif">Sube tus fotos</h2>
      <p className="mb-8 text-neutral-600">
        ¿Tienes fotos o vídeos del día? Súbelos aquí directamente desde el móvil,
        sin instalar nada.
      </p>

      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        capture="environment"
        className="hidden"
        onChange={(e) => e.target.files && subirArchivos(e.target.files)}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={estado === "subiendo"}
        className="rounded-lg bg-neutral-900 px-8 py-3 text-white hover:bg-neutral-700 disabled:opacity-50"
      >
        {estado === "subiendo" ? `Subiendo ${subidas}/${total}...` : "Elegir fotos o vídeos"}
      </button>

      {estado === "ok" && (
        <p className="mt-4 text-green-700">¡Gracias! Se han subido correctamente.</p>
      )}
      {estado === "error" && (
        <p className="mt-4 text-red-600">
          Algo ha fallado subiendo alguna foto. Inténtalo de nuevo.
        </p>
      )}
    </section>
  );
}
