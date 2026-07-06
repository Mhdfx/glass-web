"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { company, yearsOfExperience } from "@/data/company";
import { whatsappLink } from "@/lib/whatsapp";
import { ButtonLink } from "@/components/ui/Button";
import { ChevronDownIcon, WhatsAppIcon } from "@/components/ui/icons";

// Scène 3D chargée uniquement côté client, hors du bundle initial
const GlassScene = dynamic(() => import("@/components/three/GlassScene"), {
  ssr: false,
});

/** N'active la 3D que sur desktop performant, sans reduced-motion */
function use3DEnabled() {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine) and (min-width: 1024px)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const lowMemory =
      "deviceMemory" in navigator &&
      (navigator as { deviceMemory?: number }).deviceMemory !== undefined &&
      (navigator as { deviceMemory?: number }).deviceMemory! < 4;
    if (fine.matches && !reduce.matches && !lowMemory) {
      // Différé pour laisser le contenu critique s'afficher d'abord
      const id = window.setTimeout(() => setEnabled(true), 400);
      return () => window.clearTimeout(id);
    }
  }, []);
  return enabled;
}

/** Délai de cascade pour l'animation CSS d'entrée (voir globals.css) */
const d = (i: number) =>
  ({ "--hero-delay": `${0.1 + i * 0.1}s` }) as React.CSSProperties;

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const show3D = use3DEnabled();
  const [heroVisible, setHeroVisible] = useState(true);

  // La scène 3D ne rend que lorsque le hero est visible à l'écran
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setHeroVisible(entry.isIntersecting),
      { threshold: 0.05 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Parallaxe léger — appliqué après montage via rAF, aucun style
  // divergent entre serveur et client (pas de mismatch d'hydratation).
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const p = Math.min(window.scrollY / window.innerHeight, 1);
      if (imageRef.current) {
        imageRef.current.style.transform = `translateY(${(p * 16).toFixed(2)}%) scale(1.08)`;
      }
      if (contentRef.current) {
        contentRef.current.style.opacity = String(
          Math.max(0.15, 1 - p * 1.25),
        );
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="accueil"
      className="relative flex min-h-dvh items-center overflow-hidden"
    >
      {/* Image de fond + parallaxe */}
      <div
        ref={imageRef}
        className="absolute inset-0 -z-20 scale-[1.08] will-change-transform"
      >
        <Image
          src="/images/hero/hero.jpg"
          alt={`Salon habillé d'un mur en miroir biseauté et lustres dorés — réalisation de l'atelier à ${company.shortLocation}`}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      {/* Voiles de contraste pour la lisibilité du texte */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink-950/90 via-ink-950/60 to-ink-950/20" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink-950 via-transparent to-ink-950/40" />

      {/* Scène 3D — moitié droite, desktop uniquement */}
      {show3D && (
        <div
          className="absolute inset-y-0 right-0 -z-[5] hidden w-1/2 lg:block"
          aria-hidden="true"
        >
          <GlassScene active={heroVisible} />
        </div>
      )}

      <div ref={contentRef} className="container-site pt-[72px]">
        <div className="max-w-2xl py-20">
          <p className="section-label hero-in" style={d(0)}>
            Atelier verrier — {company.shortLocation}
          </p>

          <h1
            className="hero-in mt-5 font-display text-[2.6rem] leading-[1.08] font-medium text-balance text-ivory-50 sm:text-6xl lg:text-[4.2rem]"
            style={d(1)}
          >
            Miroiterie, vitraux{" "}
            <em className="bg-gradient-to-r from-brass-300 via-brass-500 to-brass-300 bg-clip-text font-normal text-transparent not-italic">
              &amp; verre sur-mesure
            </em>
          </h1>

          <p
            className="hero-in mt-6 max-w-xl text-lg leading-relaxed text-ivory-200/85"
            style={d(2)}
          >
            Artisanat et sécurité, depuis {company.foundedYear} à{" "}
            {company.shortLocation}. Vitraux peints à la main, miroirs
            antiques, verre trempé structurel — chaque pièce est façonnée et
            posée par notre atelier.
          </p>

          <div className="hero-in mt-9 flex flex-wrap items-center gap-4" style={d(3)}>
            <ButtonLink href="#devis" variant="primary">
              Demander un devis gratuit
            </ButtonLink>
            <ButtonLink
              href={whatsappLink()}
              variant="ghost"
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsAppIcon className="h-5 w-5 text-whatsapp" />
              Discuter sur WhatsApp
            </ButtonLink>
          </div>

          {/* Rangée de confiance */}
          <dl className="hero-in mt-14 flex flex-wrap gap-x-10 gap-y-4" style={d(4)}>
            {[
              [`${yearsOfExperience()} ans`, "de savoir-faire"],
              ["3 – 15 mm", "verre trempé & feuilleté"],
              ["100% atelier", "de la mesure à la pose"],
            ].map(([value, label]) => (
              <div key={label} className="border-l border-brass-500/30 pl-4">
                <dt className="sr-only">{label}</dt>
                <dd>
                  <span className="font-display text-xl text-brass-400">
                    {value}
                  </span>
                  <span className="block text-xs tracking-wide text-stone-400">
                    {label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Indicateur de scroll */}
      <a
        href="#pourquoi-nous"
        aria-label="Découvrir la suite"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full p-2 text-stone-400 transition-colors hover:text-brass-400 motion-safe:animate-bounce [animation-duration:2.2s]"
      >
        <ChevronDownIcon className="h-6 w-6" />
      </a>
    </section>
  );
}
