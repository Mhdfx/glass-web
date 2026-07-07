"use client";

import {
  createElement,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Délai en secondes — utilisé pour les cascades */
  delay?: number;
  /** Déplacement vertical initial en px */
  y?: number;
  as?: "div" | "section" | "li" | "span";
}

/** useLayoutEffect côté client, useEffect côté serveur (pas de warning SSR) */
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

/**
 * Apparition au scroll : fade + translation + mise au point (blur → net).
 *
 * Zéro risque d'hydratation PAR CONSTRUCTION : le serveur et le premier
 * rendu client produisent exactement le même HTML (élément visible, aucun
 * style d'état). Le masquage n'intervient qu'après montage, dans un
 * layout-effect (avant peinture — pas de flash), puis un
 * IntersectionObserver déclenche la transition CSS. Sans JavaScript, le
 * contenu reste simplement visible. Respecte prefers-reduced-motion.
 */
export default function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
  as = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  // "idle" = rendu serveur/initial (visible) · "armed" = masqué, en attente
  // d'entrer à l'écran · "shown" = transition de révélation jouée
  const [phase, setPhase] = useState<"idle" | "armed" | "shown">("idle");

  useIsoLayoutEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;

    setPhase("armed");
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPhase("shown");
          io.disconnect();
        }
      },
      { rootMargin: "-64px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const style: CSSProperties =
    phase === "armed"
      ? { opacity: 0, transform: `translateY(${y}px)`, filter: "blur(5px)" }
      : phase === "shown"
        ? {
            opacity: 1,
            transform: "translateY(0px)",
            filter: "blur(0px)",
            transition: `opacity 0.65s ${EASE} ${delay}s, transform 0.65s ${EASE} ${delay}s, filter 0.65s ${EASE} ${delay}s`,
          }
        : {};

  return createElement(as, { ref, className, style }, children);
}
