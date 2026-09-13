"use client";

import { useEffect, useState } from "react";

const WEDDING_DATE = new Date("2026-12-07T17:00:00+01:00");

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
    <section className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="tracking-[0.3em] text-sm uppercase text-neutral-500">Nos casamos</p>
      <h1 className="text-5xl sm:text-7xl font-serif">Álvaro &amp; Luisma</h1>
      <p className="text-lg text-neutral-600">7 de diciembre de 2026 · El Tinto</p>

      {timeLeft && (
        <div className="mt-8 flex gap-6 text-center">
          <div>
            <div className="text-3xl font-semibold">{timeLeft.days}</div>
            <div className="text-xs uppercase text-neutral-500">días</div>
          </div>
          <div>
            <div className="text-3xl font-semibold">{timeLeft.hours}</div>
            <div className="text-xs uppercase text-neutral-500">horas</div>
          </div>
          <div>
            <div className="text-3xl font-semibold">{timeLeft.minutes}</div>
            <div className="text-xs uppercase text-neutral-500">min</div>
          </div>
        </div>
      )}
    </section>
  );
}
