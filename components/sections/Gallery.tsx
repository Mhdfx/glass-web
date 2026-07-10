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
  const [ratio, setRatio] = useState<number | null>(null);
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const visible =
    filter === "all"
      ? galleryItems
      : galleryItems.filter((item) => item.category === filter);

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

  useEffect(() => {
    setRatio(null);
    if (lightbox !== null) closeBtnRef.current?.focus();
  }, [lightbox]);

  useEffect(() => {
    if (lightbox === null) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        close();
      }
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };

    const onAnchorClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest?.('a[href^="#"]');
      if (anchor) close();
    };

    document.addEventListener("keydown", onKey, true);
    document.addEventListener("click", onAnchorClick, true);
    window.addEventListener("hashchange", close);
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey, true);
      document.removeEventListener("click", onAnchorClick, true);
      window.removeEventListener("hashchange", close);
      document.documentElement.style.overflow = "";
    };
  }, [lightbox, close, step]);

  const currentItem = lightbox !== null ? visible[lightbox] : null;

  return (
    <section
      ref={sectionRef}
      id="galerie"
      className="border-y border-smoke-950/5 bg-porcelain-100 py-24 sm:py-32"
      aria-labelledby="galerie-titre"
    >
      <div className="container-site">
        <Reveal className="max-w-2xl">
          <h2
            id="galerie-titre"
            className="heading-display text-3xl sm:text-4xl lg:text-[2.75rem] lg:leading-tight"
          >
            Nos réalisations
          </h2>
        </Reveal>

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
                  className={`min-h-[44px] cursor-pointer rounded-full px-5 py-2 text-sm font-medium transition-colors duration-200 ${
                    active
                      ? "bg-smoke-950 text-porcelain-50"
                      : "border border-smoke-950/15 text-smoke-600 hover:text-smoke-950"
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </Reveal>

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
                  className="group relative block h-full w-full cursor-zoom-in overflow-hidden rounded-2xl border border-smoke-950/10"
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
                  <span className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <span className="absolute inset-x-0 bottom-0 translate-y-2 p-4 text-left text-sm font-medium text-ivory-50 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    {item.caption}
                  </span>
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>

        <p className="mt-8 text-center text-sm text-smoke-500">
          Chaque pièce est unique, votre projet mérite le même soin.{" "}
          <a
            href="#devis"
            className="font-semibold text-brass-700 transition-colors hover:text-brass-600"
          >
            Parlons-en
          </a>
        </p>
      </div>

      <AnimatePresence>
        {currentItem && lightbox !== null && (
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={currentItem.caption}
            aria-describedby="lightbox-caption"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[80] flex flex-col bg-ink-950/98 backdrop-blur-sm"
            onClick={close}
          >
            <button
              ref={closeBtnRef}
              type="button"
              onClick={close}
              aria-label="Fermer"
              className="absolute top-[max(1rem,env(safe-area-inset-top))] right-4 z-20 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-ink-800/95 text-ivory-100 shadow-lg transition-colors hover:border-brass-500/40 hover:text-brass-400"
            >
              <CloseIcon />
            </button>

            <div
              className="relative flex min-h-0 flex-1 items-center justify-center px-4 pt-16 pb-28 sm:px-8 sm:pb-32"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.figure
                initial={reduce ? false : { scale: 0.96, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={reduce ? undefined : { scale: 0.96, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="relative w-full max-w-5xl"
              >
                <div
                  className={`relative mx-auto h-[58dvh] overflow-hidden rounded-xl sm:h-[68dvh] ${
                    ratio
                      ? "w-[min(100%,calc(var(--lb-r)*58dvh))] sm:w-[min(100%,calc(var(--lb-r)*68dvh))]"
                      : "w-full"
                  }`}
                  style={
                    ratio ? ({ "--lb-r": ratio } as React.CSSProperties) : undefined
                  }
                >
                  <Image
                    src={currentItem.src}
                    alt={currentItem.alt}
                    fill
                    sizes="(min-width: 1280px) 1024px, 100vw"
                    className="object-contain"
                    priority
                    onLoad={(e) => {
                      const img = e.currentTarget;
                      if (img.naturalWidth && img.naturalHeight) {
                        setRatio(img.naturalWidth / img.naturalHeight);
                      }
                    }}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label="Image précédente"
                  className="absolute top-1/2 left-0 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-ink-950/80 text-ivory-100 backdrop-blur transition-colors hover:border-brass-500/40 hover:text-brass-400 sm:-left-4"
                >
                  <ChevronLeftIcon />
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label="Image suivante"
                  className="absolute top-1/2 right-0 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-ink-950/80 text-ivory-100 backdrop-blur transition-colors hover:border-brass-500/40 hover:text-brass-400 sm:-right-4"
                >
                  <ChevronRightIcon />
                </button>
              </motion.figure>
            </div>

            <div
              id="lightbox-caption"
              className="absolute inset-x-0 bottom-0 border-t border-white/10 bg-ink-950/95 px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] text-center sm:px-8"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="text-sm font-medium text-ivory-50 sm:text-base">
                {currentItem.caption}
              </p>
              <p className="mt-1 text-xs text-stone-300 tabular-nums sm:text-sm">
                {lightbox + 1} / {visible.length}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
