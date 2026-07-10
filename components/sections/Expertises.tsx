import Link from "next/link";
import { serviceCategories } from "@/data/services";
import Reveal from "@/components/ui/Reveal";
import { ArrowRightIcon } from "@/components/ui/icons";

/**
 * Bento asymétrique 4 cellules (2+1 / 1+2) — chaque cellule a sa propre
 * matière : blanc plaque, verre cannelé, teinte laiton, porcelaine.
 * Typographique par décision client : pas d'images dans ces cartes.
 *
 * Chaque carte est ENTIÈREMENT cliquable et mène à la page détaillée de
 * l'expertise (/expertises/[slug]) : présentation, étapes de fabrication,
 * cas d'usage, glossaire, galerie et FAQ.
 */

/** Portée dans la grille (colonnes larges pour les cellules 1 et 4) */
const cellSpan = ["lg:col-span-2", "", "", "lg:col-span-2"];

/** Matière de surface — appliquée à l'élément cliquable lui-même */
const cellSurface = [
  "pane",
  "fluted border border-smoke-950/10 bg-porcelain-100",
  "border border-brass-600/20 bg-brass-500/[0.08]",
  "border border-smoke-950/10 bg-porcelain-100",
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
            atelier. Cliquez sur une expertise pour tout comprendre.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {serviceCategories.map((cat, i) => (
            <Reveal key={cat.id} delay={(i % 2) * 0.1} className={cellSpan[i]}>
              <Link
                href={`/expertises/${cat.id}`}
                aria-label={`${cat.title} — découvrir cette expertise`}
                className={`group flex h-full flex-col rounded-2xl p-7 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-brass-600/40 hover:shadow-pane sm:p-9 ${cellSurface[i]}`}
              >
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
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-brass-700 transition-colors group-hover:text-brass-600">
                    Découvrir cette expertise
                    <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
