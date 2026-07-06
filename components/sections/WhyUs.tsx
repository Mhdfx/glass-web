import { pillars } from "@/data/services";
import { pillarIcons } from "@/components/ui/icons";
import Reveal from "@/components/ui/Reveal";

export default function WhyUs() {
  return (
    <section
      id="pourquoi-nous"
      className="relative bg-ink-950 py-24 sm:py-32"
      aria-labelledby="pourquoi-nous-titre"
    >
      {/* Halo laiton discret */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-1/2 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-brass-500/[0.05] blur-3xl"
      />

      <div className="container-site">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="section-label">Pourquoi nous</p>
          <h2
            id="pourquoi-nous-titre"
            className="mt-4 font-display text-3xl font-medium text-balance text-ivory-50 sm:text-4xl lg:text-[2.75rem] lg:leading-tight"
          >
            Un métier d&apos;art, une exigence d&apos;ingénieur
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {pillars.map((pillar, i) => {
            const Icon = pillarIcons[pillar.icon];
            return (
              <Reveal
                key={pillar.title}
                delay={i * 0.12}
                className="glass-panel glass-edge group rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-glass"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-brass-500/25 bg-brass-500/10 text-brass-400 transition-colors duration-300 group-hover:bg-brass-500/20">
                  <Icon />
                </div>
                <h3 className="mt-6 font-display text-xl text-ivory-50">
                  {pillar.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-stone-300">
                  {pillar.description}
                </p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
