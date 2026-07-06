import Image from "next/image";
import { company } from "@/data/company";
import { whatsappLink } from "@/lib/whatsapp";
import { ButtonLink } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";

/** Délai de cascade pour l'animation CSS d'entrée (voir globals.css) */
const d = (i: number) =>
  ({ "--hero-delay": `${0.1 + i * 0.1}s` }) as React.CSSProperties;

/**
 * Hero pleine image. La photo « finition » occupe tout l'écran ; le texte
 * se pose dessus derrière un voile de porcelaine dégradé — jamais de
 * scrim noir sur une direction lumineuse. Le voile est latéral sur
 * desktop (texte à gauche, matière visible à droite) et vertical sur
 * mobile (texte ancré en bas, là où le voile est le plus dense).
 * Entrée 100% CSS (.hero-in) : visible avant l'hydratation.
 */
export default function Hero() {
  return (
    <section
      id="accueil"
      className="relative flex min-h-dvh items-end overflow-hidden border-b border-smoke-950/10 lg:items-center"
    >
      {/* Photo pleine largeur */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero/hero-v2.jpg"
          alt={`Intérieur de restaurant en marbre et verre : garde-corps vitrés, vitrines et façade toute hauteur, réalisation de l'atelier ${company.name}`}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        {/* Voile mobile — monte du bas, le texte s'assoit dessus */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-porcelain-50 via-porcelain-50/80 to-porcelain-50/20 lg:hidden"
        />
        {/* Voile desktop — latéral, laisse le lustre et la façade respirer */}
        <div
          aria-hidden
          className="absolute inset-0 hidden bg-gradient-to-r from-porcelain-50/95 via-porcelain-50/60 to-transparent lg:block"
        />
        {/* Voile de tête — garantit la lisibilité du header transparent */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-porcelain-50/80 to-transparent"
        />
      </div>

      <div className="container-site relative w-full pt-[72px]">
        <div className="max-w-2xl pt-10 pb-16 lg:py-24">
          <p className="section-label hero-in" style={d(0)}>
            Atelier verrier, {company.shortLocation}
          </p>

          <h1
            className="hero-in heading-display mt-6 text-5xl leading-[1.04] sm:text-6xl lg:text-[5.25rem] lg:leading-[1.02]"
            style={d(1)}
          >
            Le verre, taillé pour la{" "}
            <em className="font-semibold text-brass-600">lumière</em>.
          </h1>

          <p
            className="hero-in mt-6 max-w-md text-lg leading-relaxed text-smoke-700"
            style={d(2)}
          >
            Miroirs, vitraux et verre trempé sur-mesure, façonnés et posés par
            notre atelier depuis {company.foundedYear}.
          </p>

          <div className="hero-in mt-9 flex flex-wrap items-center gap-4" style={d(3)}>
            <ButtonLink href="#devis" variant="primary" arrow>
              Demander un devis
            </ButtonLink>
            <ButtonLink
              href={whatsappLink()}
              variant="ghost"
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsAppIcon className="h-5 w-5 text-whatsapp" />
              Discuter sur WhatsApp
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
