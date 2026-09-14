import { SiteContent } from "@/lib/content-store";
import RichText from "./RichText";

export default function Faq({ content }: { content: SiteContent }) {
  return (
    <section id="faq" className="mx-auto max-w-2xl px-6 py-24">
      <p className="mb-2 text-center text-xs tracking-[0.35em] uppercase text-accent">
        Dudas
      </p>
      <h2 className="mb-12 text-center font-serif text-4xl font-medium">
        Información práctica
      </h2>
      <div className="divide-y divide-line border-y border-line">
        {content.faq.map((item) => (
          <div key={item.pregunta} className="py-5">
            <div className="font-serif text-xl">{item.pregunta}</div>
            <div className="mt-1 whitespace-pre-line text-muted">
              <RichText texto={item.respuesta} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
