// TODO: revisar y completar las preguntas con Álvaro
const PREGUNTAS = [
  {
    pregunta: "¿Hay código de vestimenta?",
    respuesta: "Por confirmar.",
  },
  {
    pregunta: "¿Hay aparcamiento?",
    respuesta: "Por confirmar.",
  },
  {
    pregunta: "¿Puedo llevar acompañante?",
    respuesta: "Por confirmar.",
  },
];

export default function Faq() {
  return (
    <section id="faq" className="mx-auto max-w-2xl px-6 py-24">
      <h2 className="mb-12 text-center text-3xl font-serif">Información práctica</h2>
      <div className="space-y-6">
        {PREGUNTAS.map((item) => (
          <div key={item.pregunta}>
            <div className="font-medium">{item.pregunta}</div>
            <div className="text-neutral-600">{item.respuesta}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
