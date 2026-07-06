"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Scroll fluide (Lenis) — réglage « réactif » : lissage léger basé sur
 * lerp (suit la molette de près, sans effet de traîne) et molette
 * légèrement amplifiée. Désactivé si prefers-reduced-motion.
 * Le défilement tactile natif est conservé.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      lerp: 0.16,
      wheelMultiplier: 1.15,
      anchors: { offset: -72 },
    });

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
