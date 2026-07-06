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

/**
 * Bento asymétrique 4 cellules (2+1 / 1+2) — chaque cellule a sa propre
 * matière : blanc plaque, verre cannelé, teinte laiton, porcelaine.
 * Typographique par décision client : pas d'images dans ces cartes.
 */
const cellStyles = [
  "pane lg:col-span-2",
  "fluted border border-smoke-950/10 bg-porcelain-100",
  "border border-brass-600/20 bg-brass-500/[0.08]",
  "border border-smoke-950/10 bg-porcelain-100 lg:col-span-2",
];

export default function Expertises() {
  return (
    <section
      id="expertises"
      className="bg-porcelain-50 py-24 sm:py-32"
      aria-labelledby="expertises-titre"
    >
      <div className="container-site">
        <Reveal className="max-w-2xl">
          <p className="section-label">Nos expertises</p>
          <h2
            id="expertises-titre"
            className="heading-display mt-4 text-3xl sm:text-4xl lg:text-[2.75rem] lg:leading-tight"
          >
            Toute la chaîne du verre, réalisée en interne
          </h2>
          <p className="mt-5 max-w-prose leading-relaxed text-smoke-600">
            Découpe, trempe, façonnage, biseautage et pose, en verre de 3 à
            15&nbsp;mm, aluminium et inox. Quatre grands métiers, un seul
            atelier.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {serviceCategories.map((cat, i) => (
            <Reveal key={cat.id} delay={(i % 2) * 0.1} className={cellStyles[i]}>
              <article className="group flex h-full flex-col rounded-2xl p-7 sm:p-9">
                <div className="flex items-center gap-4">
                  <span
                    aria-hidden
                    className="font-display text-3xl leading-none font-medium text-smoke-300"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    aria-hidden
                    className="h-px flex-1 bg-gradient-to-r from-smoke-950/15 to-transparent"
                  />
                </div>

                <h3 className="mt-5 font-display text-3xl font-medium text-smoke-950">
                  {cat.title}
                </h3>
                <p className="mt-3 max-w-prose text-sm leading-relaxed text-smoke-600">
                  {cat.description}
                </p>

                <ul className="mt-6 space-y-2 text-sm text-smoke-700">
                  {cat.items.map((item) => (
                    <li key={item} className="flex gap-2.5">
                      <span
                        aria-hidden
                        className="mt-[0.55rem] h-px w-3 shrink-0 bg-brass-600"
                      />
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-7">
                  <a
                    href="#galerie"
                    onClick={() => goToGallery(cat.id)}
                    className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 text-sm font-semibold text-brass-700 transition-colors hover:text-brass-600"
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
