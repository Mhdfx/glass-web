import { pillars } from "@/data/services";
import Reveal from "@/components/ui/Reveal";

/**
 * « Pourquoi nous » v2 : registre d'atelier. Trois lignes éditoriales
 * séparées par des filets chrome, numéral gravé en Cormorant à gauche.
 * Aucune carte : l'espace et les filets organisent la lecture.
 */
export default function WhyUs() {
  return (
    <section
      id="pourquoi-nous"
      className="bg-porcelain-50 py-24 sm:py-32"
      aria-labelledby="pourquoi-nous-titre"
    >
      <div className="container-site">
        <Reveal className="max-w-2xl">
          <h2
            id="pourquoi-nous-titre"
            className="heading-display text-3xl sm:text-4xl lg:text-[2.75rem] lg:leading-tight"
          >
            Un métier d&apos;art, une exigence d&apos;ingénieur
          </h2>
        </Reveal>

        <div className="mt-14 border-y border-smoke-950/10">
          {pillars.map((pillar, i) => (
            <Reveal
              key={pillar.title}
              delay={i * 0.1}
              className={`grid gap-4 py-10 sm:grid-cols-[6rem_1fr] lg:grid-cols-[8rem_20rem_1fr] lg:gap-10 ${
                i > 0 ? "border-t border-smoke-950/10" : ""
              }`}
            >
              <span
                aria-hidden
                className="font-display text-5xl leading-none font-medium text-smoke-300 lg:text-6xl"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-display text-2xl font-medium text-smoke-950">
                {pillar.title}
              </h3>
              <p className="max-w-prose leading-relaxed text-smoke-600">
                {pillar.description}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
