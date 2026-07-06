"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  galleryFilters,
  galleryItems,
  type GalleryFilterId,
} from "@/data/gallery";
import Reveal from "@/components/ui/Reveal";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
} from "@/components/ui/icons";

export default function Gallery() {
  const [filter, setFilter] = useState<GalleryFilterId>("all");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const visible =
    filter === "all"
      ? galleryItems
      : galleryItems.filter((item) => item.category === filter);

  // Filtre déclenché depuis les cartes « Nos expertises »
  useEffect(() => {
    const onFilter = (e: Event) => {
      const id = (e as CustomEvent<string>).detail as GalleryFilterId;
      if (galleryFilters.some((f) => f.id === id)) setFilter(id);
    };
    window.addEventListener("gallery:filter", onFilter);
    return () => window.removeEventListener("gallery:filter", onFilter);
  }, []);

  const close = useCallback(() => setLightbox(null), []);
  const step = useCallback(
    (dir: 1 | -1) => {
      setLightbox((cur) =>
        cur === null ? cur : (cur + dir + visible.length) % visible.length,
      );
    },
    [visible.length],
  );

  // Clavier + verrouillage du scroll pendant la lightbox
  // + fermeture automatique si l'utilisateur navigue via une ancre
  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    const onAnchorClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest?.('a[href^="#"]');
      if (anchor) close();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onAnchorClick, true);
    window.addEventListener("hashchange", close);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onAnchorClick, true);
      window.removeEventListener("hashchange", close);
      document.documentElement.style.overflow = "";
    };
  }, [lightbox, close, step]);

  return (
    <section
      ref={sectionRef}
      id="galerie"
      className="bg-ink-950 py-24 sm:py-32"
      aria-labelledby="galerie-titre"
    >
      <div className="container-site">
        <Reveal className="max-w-2xl">
          <p className="section-label">Galerie</p>
          <h2
            id="galerie-titre"
            className="heading-display mt-4 text-3xl sm:text-4xl lg:text-[2.75rem] lg:leading-tight"
          >
            Nos réalisations
          </h2>
        </Reveal>

        {/* Filtres */}
        <Reveal className="mt-10" delay={0.1}>
          <div
            role="tablist"
            aria-label="Filtrer la galerie par catégorie"
            className="flex flex-wrap gap-2"
          >
            {galleryFilters.map((f) => {
              const active = filter === f.id;
              return (
                <button
                  key={f.id}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(f.id)}
                  className={`relative min-h-[44px] cursor-pointer rounded-full px-5 py-2 text-sm font-medium transition-colors duration-200 ${
                    active
                      ? "text-ink-950"
                      : "text-ivory-200/70 hover:text-ivory-50"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="gallery-filter-pill"
                      className="absolute inset-0 rounded-full bg-brass-500"
                      transition={{ duration: reduce ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
                    />
                  )}
                  {!active && (
                    <span className="absolute inset-0 rounded-full border border-white/10" />
                  )}
                  <span className="relative">{f.label}</span>
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* Grille mosaïque — sur desktop, chaque tuile s'aligne sur des
            rangées fixes : wide = 2col × 3rangées, tall = 1×4, std = 1×2 */}
        <motion.ul
          layout={!reduce}
          className="mt-10 grid grid-flow-dense grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 lg:auto-rows-[7.5rem]"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((item, index) => (
              <motion.li
                layout={!reduce}
                key={item.src}
                initial={reduce ? false : { opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduce ? undefined : { opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className={
                  {
                    wide: "col-span-2 aspect-[16/9] lg:aspect-auto lg:row-span-3",
                    tall: "aspect-[3/4] lg:aspect-auto lg:row-span-4",
                    xtall: "aspect-[9/16] lg:aspect-auto lg:row-span-5",
                    square: "aspect-square lg:aspect-auto lg:row-span-3",
                    std: "aspect-[4/3] lg:aspect-auto lg:row-span-2",
                  }[item.span ?? "std"]
                }
              >
                <button
                  type="button"
                  onClick={() => setLightbox(index)}
                  aria-label={`Agrandir : ${item.caption}`}
                  className="group relative block h-full w-full cursor-zoom-in overflow-hidden rounded-xl border border-white/[0.05]"
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes={
                      item.span === "wide"
                        ? "(min-width: 1024px) 66vw, 100vw"
                        : "(min-width: 1024px) 33vw, 50vw"
                    }
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
                  />
                  {/* Voile + légende au survol */}
                  <span className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <span className="absolute inset-x-0 bottom-0 translate-y-2 p-4 text-left text-sm font-medium text-ivory-50 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    {item.caption}
                  </span>
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>

        <p className="mt-8 text-center text-sm text-stone-500">
          Chaque pièce est unique — votre projet mérite le même soin.{" "}
          <a
            href="#devis"
            className="font-semibold text-brass-400 transition-colors hover:text-brass-300"
          >
            Parlons-en
          </a>
        </p>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && visible[lightbox] && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={visible[lightbox].caption}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-ink-950"
            onClick={close}
          >
            <motion.figure
              initial={reduce ? false : { scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={reduce ? undefined : { scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative mx-4 w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Hauteur basée sur l'écran : tous les formats tiennent,
                  la légende et les contrôles restent toujours visibles */}
              <div className="relative h-[66dvh] w-full overflow-hidden rounded-xl sm:h-[74dvh]">
                <Image
                  src={visible[lightbox].src}
                  alt={visible[lightbox].alt}
                  fill
                  sizes="(min-width: 1280px) 1024px, 100vw"
                  className="object-contain"
                />
              </div>
              <figcaption className="mt-4 text-center text-sm text-ivory-200/80">
                {visible[lightbox].caption}
                <span className="ml-3 text-stone-500 tabular-nums">
                  {lightbox + 1} / {visible.length}
                </span>
              </figcaption>

              {/* Contrôles — croix ancrée au viewport, jamais hors écran */}
              <button
                type="button"
                onClick={close}
                aria-label="Fermer"
                className="fixed top-[max(1rem,env(safe-area-inset-top))] right-4 z-10 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-ink-800/90 text-ivory-100 transition-colors hover:border-brass-500/40 hover:text-brass-400"
              >
                <CloseIcon />
              </button>
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Image précédente"
                className="absolute top-1/2 left-1 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-ink-950/60 text-ivory-100 backdrop-blur transition-colors hover:border-brass-500/40 hover:text-brass-400 sm:-left-4"
              >
                <ChevronLeftIcon />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Image suivante"
                className="absolute top-1/2 right-1 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-ink-950/60 text-ivory-100 backdrop-blur transition-colors hover:border-brass-500/40 hover:text-brass-400 sm:-right-4"
              >
                <ChevronRightIcon />
              </button>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
