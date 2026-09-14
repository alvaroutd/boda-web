"use client";

import { useState } from "react";
import { SiteContent } from "@/lib/content-store";

export default function AdminForm({ initialContent }: { initialContent: SiteContent }) {
  const [content, setContent] = useState<SiteContent>(initialContent);
  const [status, setStatus] = useState<string | null>(null);
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [fincaFile, setFincaFile] = useState<File | null>(null);

  function field<K extends keyof SiteContent>(key: K, value: SiteContent[K]) {
    setContent((c) => ({ ...c, [key]: value }));
  }

  async function guardarTexto(e: React.FormEvent) {
    e.preventDefault();
    setStatus("Guardando...");
    const res = await fetch("/api/admin/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content),
    });
    setStatus(res.ok ? "Guardado." : "Error al guardar.");
  }

  async function subirFoto() {
    if (!heroFile) return;
    setStatus("Subiendo foto...");
    const formData = new FormData();
    formData.append("file", heroFile);
    const res = await fetch("/api/admin/hero-image", { method: "POST", body: formData });
    setStatus(res.ok ? "Foto de cabecera actualizada." : "Error al subir la foto.");
    setHeroFile(null);
  }

  async function subirFotoFinca() {
    if (!fincaFile) return;
    setStatus("Subiendo foto...");
    const formData = new FormData();
    formData.append("file", fincaFile);
    const res = await fetch("/api/admin/fotos-finca", { method: "POST", body: formData });
    if (res.ok) {
      const data = await res.json();
      field("fotosFinca", [...content.fotosFinca, data.fileName]);
      setStatus("Foto de la finca añadida.");
    } else {
      setStatus("Error al subir la foto.");
    }
    setFincaFile(null);
  }

  async function eliminarFotoFinca(nombre: string) {
    setStatus("Eliminando...");
    const res = await fetch("/api/admin/fotos-finca", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre }),
    });
    if (res.ok) {
      field(
        "fotosFinca",
        content.fotosFinca.filter((n) => n !== nombre)
      );
      setStatus("Foto eliminada.");
    } else {
      setStatus("Error al eliminar la foto.");
    }
  }

  function actualizarMomento(i: number, valor: string) {
    const copia = [...content.momentosDelDia];
    copia[i] = valor;
    field("momentosDelDia", copia);
  }

  function actualizarFaq(i: number, key: "pregunta" | "respuesta", valor: string) {
    const copia = content.faq.map((item, idx) => (idx === i ? { ...item, [key]: valor } : item));
    field("faq", copia);
  }

  function añadirFaq() {
    field("faq", [...content.faq, { pregunta: "", respuesta: "" }]);
  }

  function eliminarFaq(i: number) {
    field(
      "faq",
      content.faq.filter((_, idx) => idx !== i)
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="mb-8 font-serif text-3xl">Administración</h1>

      <section className="mb-10">
        <h2 className="mb-3 text-sm uppercase tracking-wide text-muted">Foto de cabecera</h2>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setHeroFile(e.target.files?.[0] ?? null)}
          className="mb-3 block"
        />
        <button
          type="button"
          onClick={subirFoto}
          disabled={!heroFile}
          className="rounded-full bg-accent px-5 py-2 text-sm text-white disabled:opacity-40"
        >
          Subir foto
        </button>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 text-sm uppercase tracking-wide text-muted">
          Fotos de la finca (debajo de la info del día)
        </h2>
        {content.fotosFinca.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-3">
            {content.fotosFinca.map((foto) => (
              <div key={foto} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/api/fotos-finca/${foto}`}
                  alt=""
                  className="h-20 w-20 rounded-lg object-cover"
                />
                <button
                  type="button"
                  onClick={() => eliminarFotoFinca(foto)}
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-accent text-xs text-white"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFincaFile(e.target.files?.[0] ?? null)}
          className="mb-3 block"
        />
        <button
          type="button"
          onClick={subirFotoFinca}
          disabled={!fincaFile}
          className="rounded-full bg-accent px-5 py-2 text-sm text-white disabled:opacity-40"
        >
          Añadir foto de la finca
        </button>
      </section>

      <form onSubmit={guardarTexto} className="flex flex-col gap-6">
        <section>
          <h2 className="mb-3 text-sm uppercase tracking-wide text-muted">Nombres</h2>
          <div className="flex gap-3">
            <input
              className="w-full rounded-lg border border-line px-3 py-2"
              value={content.novio1}
              onChange={(e) => field("novio1", e.target.value)}
            />
            <input
              className="w-full rounded-lg border border-line px-3 py-2"
              value={content.novio2}
              onChange={(e) => field("novio2", e.target.value)}
            />
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-sm uppercase tracking-wide text-muted">
            Intro (antes de &quot;El gran día&quot;)
          </h2>
          <textarea
            className="w-full rounded-lg border border-line px-3 py-2"
            rows={4}
            placeholder="Por qué nos casamos después de tanto tiempo..."
            value={content.introTexto}
            onChange={(e) => field("introTexto", e.target.value)}
          />
        </section>

        <section>
          <h2 className="mb-3 text-sm uppercase tracking-wide text-muted">Fecha y hora</h2>
          <label className="mb-1 block text-xs text-muted">Fecha (ISO, para la cuenta atrás)</label>
          <input
            className="mb-3 w-full rounded-lg border border-line px-3 py-2"
            value={content.fechaBodaIso}
            onChange={(e) => field("fechaBodaIso", e.target.value)}
          />
          <label className="mb-1 block text-xs text-muted">Fecha en texto</label>
          <input
            className="mb-3 w-full rounded-lg border border-line px-3 py-2"
            value={content.fechaTexto}
            onChange={(e) => field("fechaTexto", e.target.value)}
          />
          <label className="mb-1 block text-xs text-muted">Hora de convocatoria</label>
          <input
            className="w-full rounded-lg border border-line px-3 py-2"
            value={content.horaConvocatoria}
            onChange={(e) => field("horaConvocatoria", e.target.value)}
          />
        </section>

        <section>
          <h2 className="mb-3 text-sm uppercase tracking-wide text-muted">Lugar</h2>
          <label className="mb-1 block text-xs text-muted">Nombre del lugar</label>
          <input
            className="mb-3 w-full rounded-lg border border-line px-3 py-2"
            value={content.lugarNombre}
            onChange={(e) => field("lugarNombre", e.target.value)}
          />
          <label className="mb-1 block text-xs text-muted">Dirección completa</label>
          <input
            className="mb-3 w-full rounded-lg border border-line px-3 py-2"
            value={content.lugarDireccion}
            onChange={(e) => field("lugarDireccion", e.target.value)}
          />
          <label className="mb-1 block text-xs text-muted">URL del mapa embebido (Google Maps)</label>
          <input
            className="w-full rounded-lg border border-line px-3 py-2"
            value={content.lugarMapaEmbedSrc}
            onChange={(e) => field("lugarMapaEmbedSrc", e.target.value)}
          />
        </section>

        <section>
          <h2 className="mb-3 text-sm uppercase tracking-wide text-muted">Momentos del día</h2>
          {content.momentosDelDia.map((momento, i) => (
            <input
              key={i}
              className="mb-2 w-full rounded-lg border border-line px-3 py-2"
              value={momento}
              onChange={(e) => actualizarMomento(i, e.target.value)}
            />
          ))}
        </section>

        <section>
          <h2 className="mb-3 text-sm uppercase tracking-wide text-muted">
            Información adicional (debajo de Ceremonia — Banquete — Fiesta)
          </h2>
          <textarea
            className="w-full rounded-lg border border-line px-3 py-2"
            rows={3}
            value={content.infoAdicional}
            onChange={(e) => field("infoAdicional", e.target.value)}
          />
        </section>

        <section>
          <h2 className="mb-3 text-sm uppercase tracking-wide text-muted">
            Texto debajo del mapa (cómo llegar)
          </h2>
          <textarea
            className="w-full rounded-lg border border-line px-3 py-2"
            rows={3}
            value={content.comoLlegarTexto}
            onChange={(e) => field("comoLlegarTexto", e.target.value)}
          />
        </section>

        <section>
          <h2 className="mb-3 text-sm uppercase tracking-wide text-muted">Preguntas frecuentes</h2>
          {content.faq.map((item, i) => (
            <div key={i} className="mb-4 rounded-lg border border-line p-3">
              <div className="mb-2 flex items-center justify-between">
                <label className="text-xs text-muted">Pregunta</label>
                <button
                  type="button"
                  onClick={() => eliminarFaq(i)}
                  className="text-xs text-accent"
                >
                  Eliminar
                </button>
              </div>
              <input
                className="mb-2 w-full rounded-lg border border-line px-3 py-2"
                value={item.pregunta}
                onChange={(e) => actualizarFaq(i, "pregunta", e.target.value)}
              />
              <label className="mb-1 block text-xs text-muted">Respuesta</label>
              <textarea
                className="w-full rounded-lg border border-line px-3 py-2"
                rows={2}
                value={item.respuesta}
                onChange={(e) => actualizarFaq(i, "respuesta", e.target.value)}
              />
            </div>
          ))}
          <button
            type="button"
            onClick={añadirFaq}
            className="rounded-full border border-accent px-4 py-2 text-sm text-accent"
          >
            + Añadir pregunta
          </button>
        </section>

        <button
          type="submit"
          className="self-start rounded-full bg-accent px-6 py-3 text-sm tracking-wide text-white"
        >
          Guardar cambios
        </button>
        {status && <p className="text-sm text-muted">{status}</p>}
      </form>
    </main>
  );
}
