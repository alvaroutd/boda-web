import { SiteContent } from "@/lib/content-store";

export default function Intro({ content }: { content: SiteContent }) {
  if (!content.introTexto) return null;

  return (
    <section className="mx-auto max-w-xl px-6 py-24 text-center">
      <p className="whitespace-pre-line font-serif text-2xl leading-relaxed text-foreground">
        {content.introTexto}
      </p>
    </section>
  );
}
