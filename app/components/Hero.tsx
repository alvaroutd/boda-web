"use client";

import { useEffect, useState } from "react";
import { SiteContent } from "@/lib/content-store";
import DiscoBall from "./DiscoBall";

function getTimeLeft(fechaBodaIso: string) {
  const diff = new Date(fechaBodaIso).getTime() - Date.now();
  if (diff <= 0) return null;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  return { days, hours, minutes };
}

export default function Hero({ content }: { content: SiteContent }) {
  const [timeLeft, setTimeLeft] = useState<ReturnType<typeof getTimeLeft>>(null);

  useEffect(() => {
    setTimeLeft(getTimeLeft(content.fechaBodaIso));
    const interval = setInterval(() => setTimeLeft(getTimeLeft(content.fechaBodaIso)), 60_000);
    return () => clearInterval(interval);
  }, [content.fechaBodaIso]);

  return (
    <section
      className="relative flex min-h-screen flex-col items-center justify-center gap-8 px-6 text-center bg-cover bg-center"
      style={{ backgroundImage: "url('/api/hero-image')" }}
    >
      <div className="absolute inset-0 bg-black/55" />

      <div className="relative flex flex-col items-center gap-8">
        <p className="flex items-center gap-3 text-xs tracking-[0.35em] uppercase text-white/80">
          <DiscoBall className="h-4 w-4 text-white/80" />
          Nos casamos
          <DiscoBall className="h-4 w-4 text-white/80" />
        </p>

        <h1 className="font-serif text-6xl sm:text-8xl font-medium text-white">
          {content.novio1} <span className="text-white/70">&amp;</span> {content.novio2}
        </h1>

        <div className="flex items-center gap-3 text-white/80">
          <span className="h-px w-8 bg-white/40" />
          <p className="text-sm tracking-wide">
            {content.fechaTexto} · {content.lugarNombre}
          </p>
          <span className="h-px w-8 bg-white/40" />
        </div>

        {timeLeft && (
          <div className="mt-6 flex gap-8 text-center">
            <div>
              <div className="font-serif text-4xl text-white">{timeLeft.days}</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-white/70">días</div>
            </div>
            <div>
              <div className="font-serif text-4xl text-white">{timeLeft.hours}</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-white/70">horas</div>
            </div>
            <div>
              <div className="font-serif text-4xl text-white">{timeLeft.minutes}</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-white/70">min</div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
