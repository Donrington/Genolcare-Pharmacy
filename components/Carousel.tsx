'use client';

import { useEffect, useRef, useState } from 'react';

interface TrustCard {
  img: string;
  subtitle: string;
  title: string;
  meta: string;
}

interface CarouselProps {
  cards: TrustCard[];
  autoRotate: boolean;
  accent: string;
}

const Check = ({ accent }: { accent: string }) => (
  <span
    className="w-4 h-4 rounded-full grid place-items-center text-[#0a1632] shrink-0"
    style={{ background: accent }}
  >
    <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round">
      <path d="M5 12l5 5L20 7" />
    </svg>
  </span>
);

export default function Carousel({ cards, autoRotate, accent }: CarouselProps) {
  const [i, setI] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const n = cards.length;

  const stop = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const start = () => {
    stop();
    if (!autoRotate) return;
    timerRef.current = setInterval(() => setI((p) => (p + 1) % n), 4200);
  };

  useEffect(() => {
    start();
    return stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRotate, n]);

  const go = (idx: number) => {
    setI(((idx % n) + n) % n);
    start();
  };

  return (
    <div
      className="relative w-full md:w-[520px]"
      onMouseEnter={stop}
      onMouseLeave={start}
      aria-label="Trust signals"
    >
      {/* Card area */}
      <div className="relative h-[108px] sm:h-[128px]">
        {cards.map((c, idx) => (
          <div
            key={idx}
            className={[
              'absolute inset-0 flex items-center gap-3 sm:gap-4 p-3 sm:p-3.5',
              'rounded-[16px] sm:rounded-[20px] border border-white/10 bg-white/[0.05] backdrop-blur-md',
              'transition-all duration-500 ease-out',
              idx === i
                ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
                : 'opacity-0 translate-y-3 scale-[0.98] pointer-events-none',
            ].join(' ')}
          >
            <img
              src={c.img}
              alt=""
              className="w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] rounded-[12px] sm:rounded-[14px] object-cover shrink-0 shadow-[0_8px_22px_rgba(0,0,0,0.35)]"
            />
            <div className="flex flex-col gap-1 sm:gap-1.5 min-w-0">
              <div className="text-[10px] sm:text-[11px] uppercase tracking-[0.14em] sm:tracking-[0.16em] font-bold" style={{ color: accent }}>
                {c.subtitle}
              </div>
              <div className="text-[15px] sm:text-[18px] font-bold leading-tight text-white">{c.title}</div>
              <div className="flex items-center gap-2 text-[11px] sm:text-[12px] text-white/55">
                <Check accent={accent} />
                {c.meta}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 sm:gap-3.5 mt-3 sm:mt-3.5">
        <button
          onClick={() => go(i - 1)}
          aria-label="Previous"
          className="w-[34px] h-[34px] rounded-full border border-white/10 grid place-items-center text-white hover:text-white/80 transition shrink-0"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round">
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>
        <div className="flex gap-2">
          {cards.map((_, idx) => (
            <button
              key={idx}
              onClick={() => go(idx)}
              aria-label={`Slide ${idx + 1}`}
              className={['h-1 rounded-sm transition-all', idx === i ? 'w-9' : 'w-6 bg-white/[0.18]'].join(' ')}
              style={idx === i ? { background: accent, width: 36 } : undefined}
            />
          ))}
        </div>
        <button
          onClick={() => go(i + 1)}
          aria-label="Next"
          className="w-[34px] h-[34px] rounded-full border border-white/10 grid place-items-center text-white hover:text-white/80 transition shrink-0"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round">
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>
        <div className="ml-auto text-[11px] sm:text-[12px] text-white/50 tabular-nums tracking-wider">
          {String(i + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}
        </div>
      </div>
    </div>
  );
}
