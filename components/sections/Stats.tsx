"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { company, yearsOfExperience } from "@/data/company";
import Reveal from "@/components/ui/Reveal";

/**
 * Compteur animé — affiche la valeur FINALE par défaut (jamais « 0 »
 * visible, même en scroll rapide) ; l'animation 0 → cible ne démarre
 * que lorsque la section entre à l'écran.
 */
function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const [value, setValue] = useState(target);

  useEffect(() => {
    if (!inView || reduce) return;
    const duration = 1100;
    // Le compteur démarre à ~40% de la cible — jamais de « 0 » à l'écran
    const from = Math.ceil(target * 0.4);
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(from + (target - from) * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, reduce]);

  return (
    <span ref={ref} className="tabular-nums">
      {value}
      {suffix}
    </span>
  );
}

export default function Stats() {
  const stats: { value: React.ReactNode; label: string }[] = [
    {
      value: <CountUp target={yearsOfExperience()} />,
      label: `ans d'expérience, depuis ${company.foundedYear}`,
    },
    company.projectsCount
      ? {
          value: <CountUp target={company.projectsCount} suffix="+" />,
          label: "projets réalisés",
        }
      : {
          value: "4",
          label: "métiers du verre maîtrisés en interne",
        },
    { value: "3–15 mm", label: "d'épaisseurs travaillées" },
    { value: company.serviceArea, label: "zone d'intervention" },
  ];

  return (
    <section
      className="glass-edge relative overflow-hidden border-y border-white/[0.05] bg-ink-800 py-16 sm:py-20"
      aria-label="Chiffres clés"
    >
      {/* Reflet diagonal en fond */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-1/2 left-1/4 h-[200%] w-40 rotate-[20deg] bg-gradient-to-b from-transparent via-brass-500/[0.06] to-transparent"
      />

      <div className="container-site grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Reveal key={stat.label} delay={i * 0.1} className="text-center">
            <p className="font-display text-3xl text-brass-400 sm:text-4xl">
              {stat.value}
            </p>
            <p className="mx-auto mt-2 max-w-[200px] text-sm leading-snug text-stone-300">
              {stat.label}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
