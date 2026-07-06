"use client";

import { serviceCategories } from "@/data/services";
import Reveal from "@/components/ui/Reveal";
import { ArrowRightIcon } from "@/components/ui/icons";

/**
 * Événement custom écouté par la galerie pour se filtrer quand on
 * clique « Voir les réalisations » d'une expertise.
 */
export function goToGallery(categoryId: string) {
  window.dispatchEvent(
    new CustomEvent("gallery:filter", { detail: categoryId }),
  );
}

export default function Expertises() {
  return (
    <section
      id="expertises"
      className="bg-ink-900 py-24 sm:py-32"
      aria-labelledby="expertises-titre"
    >
      <div className="container-site">
        <Reveal className="max-w-2xl">
          <p className="section-label">Nos expertises</p>
          <h2
            id="expertises-titre"
            className="mt-4 font-display text-3xl font-medium text-balance text-ivory-50 sm:text-4xl lg:text-[2.75rem] lg:leading-tight"
          >
            Toute la chaîne du verre, réalisée en interne
          </h2>
          <p className="mt-5 leading-relaxed text-stone-300">
            Découpe, trempe, façonnage, biseautage et pose — en verre de 3 à
            15&nbsp;mm, aluminium et inox. Quatre grands métiers, un seul
            atelier.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {serviceCategories.map((cat, i) => (
            <Reveal key={cat.id} delay={(i % 2) * 0.12}>
              <article className="glass-panel glass-edge group relative flex h-full flex-col overflow-hidden rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-brass-500/30 hover:shadow-glass sm:p-9">
                {/* Numéro en filigrane */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute -top-5 right-3 font-display text-[6.5rem] leading-none text-brass-500/[0.08] select-none transition-colors duration-300 group-hover:text-brass-500/[0.14]"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div className="flex items-center gap-4">
                  <span className="section-label">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    aria-hidden
                    className="h-px flex-1 bg-gradient-to-r from-brass-500/40 to-transparent"
                  />
                </div>

                <h3 className="mt-5 font-display text-2xl text-ivory-50">
                  {cat.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-stone-300">
                  {cat.description}
                </p>

                <ul className="mt-6 space-y-2 text-sm text-ivory-200/75">
                  {cat.items.map((item) => (
                    <li key={item} className="flex gap-2.5">
                      <span
                        aria-hidden
                        className="mt-[0.55rem] h-px w-3 shrink-0 bg-brass-500"
                      />
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-7">
                  <a
                    href="#galerie"
                    onClick={() => goToGallery(cat.id)}
                    className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 text-sm font-semibold text-brass-400 transition-colors hover:text-brass-300"
                  >
                    Voir les réalisations
                    <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </a>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
