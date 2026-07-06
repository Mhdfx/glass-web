"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Délai en secondes — utilisé pour les cascades */
  delay?: number;
  /** Déplacement vertical initial en px */
  y?: number;
  as?: "div" | "section" | "li" | "span";
}

/**
 * Apparition au scroll : fade + translation verticale douce.
 * Désactivée automatiquement si prefers-reduced-motion.
 */
export default function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
  as = "div",
}: RevealProps) {
  const reduce = useReducedMotion();
  const Tag = motion[as];

  // initial identique serveur/client (pas de mismatch d'hydratation) ;
  // si reduced-motion, la transition est instantanée au lieu d'animée.
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-64px" }}
      transition={
        reduce
          ? { duration: 0 }
          : { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }
      }
    >
      {children}
    </Tag>
  );
}
