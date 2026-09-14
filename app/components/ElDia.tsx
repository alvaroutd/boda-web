import { SiteContent } from "@/lib/content-store";
import RichText from "./RichText";

export default function ElDia({ content }: { content: SiteContent }) {
  return (
    <section id="el-dia" className="mx-auto max-w-3xl px-6 py-24">
      <p className="mb-2 text-center text-xs tracking-[0.35em] uppercase text-accent">
        El gran día
      </p>
      <h2 className="mb-2 text-center font-serif text-4xl font-medium">{content.fechaTexto}</h2>
      <p className="mb-12 text-center text-muted">{content.lugarNombre}</p>

      <p className="mb-8 text-center text-lg text-foreground">
        Os esperamos a las{" "}
        <span className="font-serif text-2xl text-accent">{content.horaConvocatoria}</span>
      </p>

      <ol className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
        {content.momentosDelDia.map((momento, i) => (
          <li key={momento} className="flex items-center gap-4">
            <span className="font-serif text-xl">{momento}</span>
            {i < content.momentosDelDia.length - 1 && (
              <span className="hidden text-line sm:inline">&mdash;</span>
            )}
          </li>
        ))}
      </ol>

      {content.infoAdicional && (
        <p className="mx-auto mt-10 max-w-xl whitespace-pre-line text-center text-foreground">
          <RichText texto={content.infoAdicional} />
        </p>
      )}

      {content.fotosFinca.length > 0 && (
        <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {content.fotosFinca.map((foto) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={foto}
              src={`/api/fotos-finca/${foto}`}
              alt={content.lugarNombre}
              className="h-64 w-full rounded-lg object-cover"
            />
          ))}
        </div>
      )}

      <div className="mt-16 border-t border-line pt-10">
        <h3 className="mb-3 text-center text-sm tracking-wide uppercase text-muted">
          Cómo llegar
        </h3>
        <p className="mb-4 text-center text-foreground">{content.lugarDireccion}</p>
        <iframe
          title={`Mapa a ${content.lugarNombre}`}
          className="h-64 w-full rounded-lg border border-line grayscale-[15%]"
          loading="lazy"
          src={content.lugarMapaEmbedSrc}
        />
        {content.comoLlegarTexto && (
          <p className="mx-auto mt-4 max-w-xl whitespace-pre-line text-center text-muted">
            <RichText texto={content.comoLlegarTexto} />
          </p>
        )}
      </div>
    </section>
  );
}
