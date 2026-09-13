const PREGUNTAS = [
  {
    pregunta: "¿Hay código de vestimenta?",
    respuesta: "Libre — venid guapos y elegantes, cada uno a su estilo.",
  },
  {
    pregunta: "¿Hay aparcamiento?",
    respuesta:
      "Sí, hay aparcamiento en la finca. Aún estamos decidiendo si organizamos un autobús — si hay novedades, os avisamos.",
  },
];

export default function Faq() {
  return (
    <section id="faq" className="mx-auto max-w-2xl px-6 py-24">
      <p className="mb-2 text-center text-xs tracking-[0.35em] uppercase text-accent">
        Dudas
      </p>
      <h2 className="mb-12 text-center font-serif text-4xl font-medium">
        Información práctica
      </h2>
      <div className="divide-y divide-line border-y border-line">
        {PREGUNTAS.map((item) => (
          <div key={item.pregunta} className="py-5">
            <div className="font-serif text-xl">{item.pregunta}</div>
            <div className="mt-1 text-muted">{item.respuesta}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
