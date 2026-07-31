"use client";

import { useEffect, useRef, useState } from "react";
import { stats } from "@/lib/book-data";

/**
 * Signature element: numbers grow along an exponential (compounding-style)
 * curve rather than a linear count-up — slow at first, then accelerating —
 * a small, literal echo of the book's core thesis (Chapter 1 and 41) that
 * growth compounds rather than arriving all at once.
 */
function useCompoundingCount(target: number, active: boolean, duration = 1800) {
  const [value, setValue] = useState(0);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) return;
    let raf: number;
    const step = (ts: number) => {
      if (startRef.current === null) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const t = Math.min(elapsed / duration, 1);
      // exponential ease-in: mirrors a compound-growth curve
      const eased = t === 1 ? 1 : Math.pow(2, 10 * (t - 1));
      setValue(Math.round(eased * target));
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration]);

  return value;
}

function StatItem({
  value,
  suffix,
  label,
  active,
  delay,
}: {
  value: number;
  suffix: string;
  label: string;
  active: boolean;
  delay: number;
}) {
  const count = useCompoundingCount(value, active, 1400 + delay);
  return (
    <div className="text-center">
      <p className="font-heading text-4xl font-bold text-white sm:text-5xl">
        {count}
        {suffix}
      </p>
      <p className="mt-2 text-sm font-medium text-white/60">{label}</p>
    </div>
  );
}

export function TrustedNumbers() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          setActive(true);
          obs.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="bg-slate-ink py-16">
      <div className="container-content grid grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((s, i) => (
          <StatItem
            key={s.label}
            value={s.value}
            suffix={s.suffix}
            label={s.label}
            active={active}
            delay={i * 120}
          />
        ))}
      </div>
    </section>
  );
}
