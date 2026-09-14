"use client";

import { useEffect, useState } from "react";
import { SiteContent } from "@/lib/content-store";

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
    <section className="flex flex-col items-center px-6 py-20 bg-[#14151c] text-[#f0f0f6]">
      <div className="relative w-full max-w-xl overflow-hidden rounded-sm border border-white/20 bg-[#1c1e28]">
        <span className="absolute top-1/2 -left-[11px] h-[22px] w-[22px] -translate-y-1/2 rounded-full bg-[#14151c]" />
        <span className="absolute top-1/2 -right-[11px] h-[22px] w-[22px] -translate-y-1/2 rounded-full bg-[#14151c]" />

        <div className="relative px-8 py-14 text-center sm:px-12">
          <div className="pointer-events-none absolute inset-0 opacity-50" aria-hidden="true">
            <span className="absolute -top-5 -left-5 h-16 w-16 rounded-full border border-[#7a3564]" />
            <span className="absolute top-6 right-[8%] h-9 w-9 rounded-full border border-[#7a3564]" />
            <span className="absolute bottom-[14%] left-[6%] h-4 w-4 rounded-full border border-[#7a3564]" />
          </div>

          <p className="relative mb-6 flex items-center justify-center gap-2.5 font-ticket-mono text-[11px] tracking-[0.18em] text-[#b1418f] uppercase">
            <span className="h-px w-7 bg-white/25" />
            Nos casamos
            <span className="h-px w-7 bg-white/25" />
          </p>

          <h1 className="relative mb-1 font-ticket text-6xl leading-[0.92] font-medium sm:text-8xl">
            {content.novio1}
            <em className="my-2 block text-[0.4em] font-medium text-[#b1418f] not-italic">&amp;</em>
            {content.novio2}
          </h1>

          <p className="relative mt-6 mb-10 text-[15px] text-[#a6a7b6]">
            {content.fechaTexto} · <span className="font-medium text-[#f0f0f6]">{content.lugarNombre}</span>
          </p>

          {timeLeft && (
            <div className="relative flex justify-center gap-6 border-t border-dashed border-white/25 pt-6 sm:gap-10">
              <div className="text-center">
                <div className="font-ticket-mono text-3xl font-medium tabular-nums sm:text-4xl">
                  {timeLeft.days}
                </div>
                <div className="mt-0.5 font-ticket-mono text-[10px] tracking-[0.14em] text-[#a6a7b6] uppercase">
                  días
                </div>
              </div>
              <div className="text-center">
                <div className="font-ticket-mono text-3xl font-medium tabular-nums sm:text-4xl">
                  {timeLeft.hours}
                </div>
                <div className="mt-0.5 font-ticket-mono text-[10px] tracking-[0.14em] text-[#a6a7b6] uppercase">
                  horas
                </div>
              </div>
              <div className="text-center">
                <div className="font-ticket-mono text-3xl font-medium tabular-nums sm:text-4xl">
                  {timeLeft.minutes}
                </div>
                <div className="mt-0.5 font-ticket-mono text-[10px] tracking-[0.14em] text-[#a6a7b6] uppercase">
                  min
                </div>
              </div>
            </div>
          )}

          <div className="relative mt-6 grid grid-cols-2 border-t border-white/15 text-left">
            <div className="border-r border-dashed border-white/25 px-2 py-4 sm:px-8">
              <div className="font-ticket-mono text-[10px] tracking-[0.14em] text-[#b1418f] uppercase">
                Convocatoria
              </div>
              <div className="mt-1 font-ticket text-lg">{content.horaConvocatoria}</div>
            </div>
            <div className="px-2 py-4 sm:px-8">
              <div className="font-ticket-mono text-[10px] tracking-[0.14em] text-[#b1418f] uppercase">
                Formato
              </div>
              <div className="mt-1 font-ticket text-lg">Cóctel</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
