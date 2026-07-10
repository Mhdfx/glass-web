"use client";

import { useState } from "react";
import { ChevronDownIcon } from "@/components/ui/icons";

export interface AccordionItem {
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItem[];
  /** Identifiant unique de préfixe (pour lier bouton ↔ panneau via aria) */
  idPrefix?: string;
}

/**
 * Accordéon FAQ accessible : un seul panneau ouvert à la fois.
 * Le bouton porte aria-expanded et pointe vers son panneau via aria-controls ;
 * le panneau se replie en CSS (grid-rows 0fr → 1fr) sans mesurer de hauteur.
 * Respecte prefers-reduced-motion via la règle globale de globals.css.
 */
export default function Accordion({ items, idPrefix = "faq" }: AccordionProps) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-smoke-950/10 border-y border-smoke-950/10">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.question}>
            <h3>
              <button
                type="button"
                id={`${idPrefix}-btn-${i}`}
                aria-expanded={isOpen}
                aria-controls={`${idPrefix}-panel-${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full cursor-pointer items-center justify-between gap-4 py-5 text-left transition-colors hover:text-brass-700"
              >
                <span className="font-display text-lg font-medium text-smoke-950 sm:text-xl">
                  {item.question}
                </span>
                <ChevronDownIcon
                  className={`h-5 w-5 shrink-0 text-brass-600 transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
            </h3>
            <div
              id={`${idPrefix}-panel-${i}`}
              role="region"
              aria-labelledby={`${idPrefix}-btn-${i}`}
              className={`grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <p className="max-w-2xl pb-6 leading-relaxed text-smoke-600">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
