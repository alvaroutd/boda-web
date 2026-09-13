"use client";

import { useEffect, useState } from "react";
import { NOMBRES, FECHA_BODA_ISO, FECHA_TEXTO, LUGAR } from "@/lib/content";

const WEDDING_DATE = new Date(FECHA_BODA_ISO);

function getTimeLeft() {
  const diff = WEDDING_DATE.getTime() - Date.now();
  if (diff <= 0) return null;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  return { days, hours, minutes };
}

export default function Hero() {
  const [timeLeft, setTimeLeft] = useState<ReturnType<typeof getTimeLeft>>(null);

  useEffect(() => {
    setTimeLeft(getTimeLeft());
    const interval = setInterval(() => setTimeLeft(getTimeLeft()), 60_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="flex min-h-screen flex-col items-center justify-center gap-8 px-6 text-center">
      <p className="text-xs tracking-[0.35em] uppercase text-accent">Nos casamos</p>

      <h1 className="font-serif text-6xl sm:text-8xl font-medium text-foreground">
        {NOMBRES.novio1} <span className="text-accent">&amp;</span> {NOMBRES.novio2}
      </h1>

      <div className="flex items-center gap-3 text-muted">
        <span className="h-px w-8 bg-line" />
        <p className="text-sm tracking-wide">
          {FECHA_TEXTO} · {LUGAR.nombre}
        </p>
        <span className="h-px w-8 bg-line" />
      </div>

      {timeLeft && (
        <div className="mt-6 flex gap-8 text-center">
          <div>
            <div className="font-serif text-4xl text-accent">{timeLeft.days}</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted">días</div>
          </div>
          <div>
            <div className="font-serif text-4xl text-accent">{timeLeft.hours}</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted">horas</div>
          </div>
          <div>
            <div className="font-serif text-4xl text-accent">{timeLeft.minutes}</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted">min</div>
          </div>
        </div>
      )}
    </section>
  );
}
