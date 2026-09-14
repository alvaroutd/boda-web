"use client";

import { useRef, useState } from "react";

type Estado = "idle" | "subiendo" | "ok" | "error";

const MAX_IMAGEN_BYTES = 20 * 1024 * 1024; // 20 MB
const MAX_VIDEO_BYTES = 50 * 1024 * 1024; // 50 MB

export default function SubeFotos() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [estado, setEstado] = useState<Estado>("idle");
  const [subidas, setSubidas] = useState(0);
  const [total, setTotal] = useState(0);
  const [mensajeError, setMensajeError] = useState<string | null>(null);

  async function subirArchivos(files: FileList) {
    setMensajeError(null);

    const demasiadoGrandes = Array.from(files).filter((file) => {
      const esVideo = file.type.startsWith("video/");
      return file.size > (esVideo ? MAX_VIDEO_BYTES : MAX_IMAGEN_BYTES);
    });

    if (demasiadoGrandes.length > 0) {
      setEstado("error");
      const hayVideo = demasiadoGrandes.some((f) => f.type.startsWith("video/"));
      setMensajeError(
        `${demasiadoGrandes.map((f) => f.name).join(", ")}: pesa demasiado (máx. 50 MB vídeos, 20 MB fotos).` +
          (hayVideo ? " Mándanoslo mejor por WhatsApp." : "")
      );
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    setEstado("subiendo");
    setTotal(files.length);
    setSubidas(0);

    let huboError = false;

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/subir-foto", { method: "POST", body: formData });
        if (!res.ok) {
          huboError = true;
          const data = await res.json().catch(() => null);
          if (data?.error) setMensajeError(data.error);
        }
      } catch {
        huboError = true;
      }
      setSubidas((n) => n + 1);
    }

    setEstado(huboError ? "error" : "ok");
    if (inputRef.current) inputRef.current.value = "";
    if (!huboError) window.dispatchEvent(new Event("fotos-subidas"));
  }

  return (
    <section id="fotos" className="mx-auto max-w-2xl px-6 py-24 pb-32 text-center">
      <p className="mb-2 text-xs tracking-[0.35em] uppercase text-accent">Recuerdos</p>
      <h2 className="mb-4 font-serif text-4xl font-medium">Sube tus fotos</h2>
      <p className="mb-10 text-muted">
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
        className="rounded-full bg-accent px-10 py-3 text-sm tracking-wide text-background uppercase transition hover:opacity-90 disabled:opacity-50"
      >
        {estado === "subiendo" ? `Subiendo ${subidas}/${total}...` : "Elegir fotos o vídeos"}
      </button>

      {estado === "ok" && (
        <p className="mt-4 text-accent">¡Gracias! Se han subido correctamente.</p>
      )}
      {estado === "error" && (
        <p className="mt-4 text-red-700">
          {mensajeError || "Algo ha fallado subiendo alguna foto. Inténtalo de nuevo."}
        </p>
      )}
    </section>
  );
}
