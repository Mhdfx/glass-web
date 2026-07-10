"use client";

import {
  Children,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/icons";

interface CarouselProps {
  children: ReactNode;
  /** Libellé accessible du carrousel (lu par les lecteurs d'écran) */
  ariaLabel: string;
  /** Classe appliquée à CHAQUE diapositive — fixe sa largeur responsive */
  slideClassName?: string;
  /** Masquer les puces de navigation (utile pour de longues listes) */
  hideDots?: boolean;
  className?: string;
}

/**
 * Carrousel horizontal accessible, sans dépendance.
 * — Défilement natif à accroche (scroll-snap) : tactile et molette fonctionnent
 *   d'emblée, le glisser au doigt aussi.
 * — Flèches précédent/suivant qui se désactivent en début / fin de piste.
 * — Puces cliquables synchronisées avec la position réelle de défilement
 *   (calculées depuis l'offset des diapositives, robuste quels que soient
 *   la largeur et l'écart).
 * — Clavier : les flèches ← → font défiler quand la piste a le focus.
 * — Respecte prefers-reduced-motion (saut sans animation).
 */
export default function Carousel({
  children,
  ariaLabel,
  slideClassName = "w-[85%] sm:w-[46%] lg:w-[31%]",
  hideDots = false,
  className = "",
}: CarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const slides = Children.toArray(children);
  const [active, setActive] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  /** Recalcule la diapositive active + l'état des flèches depuis le scroll réel */
  const sync = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const items = Array.from(track.children) as HTMLElement[];
    if (items.length === 0) return;

    const scrollLeft = track.scrollLeft;
    // Diapositive active = celle dont le bord gauche est le plus proche du bord visible
    let nearest = 0;
    let min = Infinity;
    items.forEach((el, i) => {
      const d = Math.abs(el.offsetLeft - track.offsetLeft - scrollLeft);
      if (d < min) {
        min = d;
        nearest = i;
      }
    });
    setActive(nearest);
    setAtStart(scrollLeft <= 2);
    setAtEnd(scrollLeft + track.clientWidth >= track.scrollWidth - 2);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    sync();
    track.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      track.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, [sync]);

  const scrollToIndex = useCallback(
    (index: number) => {
      const track = trackRef.current;
      if (!track) return;
      const items = Array.from(track.children) as HTMLElement[];
      const clamped = Math.max(0, Math.min(index, items.length - 1));
      const target = items[clamped];
      if (!target) return;
      track.scrollTo({
        left: target.offsetLeft - track.offsetLeft,
        behavior: prefersReduced ? "auto" : "smooth",
      });
    },
    [prefersReduced],
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      scrollToIndex(active + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      scrollToIndex(active - 1);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Piste défilante */}
      <div
        ref={trackRef}
        role="group"
        aria-label={ariaLabel}
        aria-roledescription="carrousel"
        tabIndex={0}
        onKeyDown={onKeyDown}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brass-600 [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            className={`shrink-0 snap-start ${slideClassName}`}
            aria-label={`${i + 1} sur ${slides.length}`}
            aria-roledescription="diapositive"
          >
            {slide}
          </div>
        ))}
      </div>

      {/* Contrôles : flèches + puces */}
      <div className="mt-6 flex items-center justify-between gap-4">
        {!hideDots ? (
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Choisir une diapositive">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={active === i}
                aria-label={`Aller à la diapositive ${i + 1}`}
                onClick={() => scrollToIndex(i)}
                className={`h-2 cursor-pointer rounded-full transition-all duration-300 ${
                  active === i
                    ? "w-7 bg-brass-500"
                    : "w-2 bg-smoke-950/20 hover:bg-smoke-950/40"
                }`}
              />
            ))}
          </div>
        ) : (
          <span />
        )}

        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => scrollToIndex(active - 1)}
            disabled={atStart}
            aria-label="Précédent"
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-smoke-950/15 text-smoke-700 transition-colors duration-200 hover:border-brass-600/50 hover:text-brass-700 disabled:cursor-default disabled:opacity-30 disabled:hover:border-smoke-950/15 disabled:hover:text-smoke-700"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollToIndex(active + 1)}
            disabled={atEnd}
            aria-label="Suivant"
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-smoke-950/15 text-smoke-700 transition-colors duration-200 hover:border-brass-600/50 hover:text-brass-700 disabled:cursor-default disabled:opacity-30 disabled:hover:border-smoke-950/15 disabled:hover:text-smoke-700"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
