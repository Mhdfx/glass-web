import Image from "next/image";
import { company } from "@/data/company";
import { whatsappLink } from "@/lib/whatsapp";
import { ButtonLink } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";

/** Délai de cascade pour l'animation CSS d'entrée (voir globals.css) */
const d = (i: number) =>
  ({ "--hero-delay": `${0.1 + i * 0.1}s` }) as React.CSSProperties;

/**
 * Hero « lumière froide » : split asymétrique. Le texte respire sur la
 * porcelaine à gauche ; à droite, la photo du lobby monte sur toute la
 * hauteur, bord à bord, séparée par un filet chrome. Composition 100%
 * statique côté serveur — l'entrée est l'animation CSS .hero-in.
 */
export default function Hero() {
  return (
    <section
      id="accueil"
      className="relative flex min-h-dvh items-center overflow-hidden bg-porcelain-50"
    >
      {/* Colonne photo — toute hauteur, désaturée vers le chrome */}
      <div className="absolute inset-y-0 right-0 hidden w-[44%] border-l border-smoke-950/10 lg:block">
        <Image
          src="/images/gallery/facade-lobby.jpg"
          alt={`Lobby d'hôtel à façade vitrée toute hauteur, réalisation de l'atelier ${company.name}`}
          fill
          priority
          sizes="44vw"
          className="object-cover"
        />
        {/* Voile porcelaine léger : la photo rejoint la température de la page */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-porcelain-50/35 via-transparent to-transparent"
        />
      </div>

      <div className="container-site w-full pt-[72px]">
        <div className="max-w-xl py-16 lg:max-w-[46%] lg:py-20">
          <p className="section-label hero-in" style={d(0)}>
            Atelier verrier, {company.shortLocation}
          </p>

          <h1
            className="hero-in heading-display mt-6 text-5xl leading-[1.04] sm:text-6xl lg:text-[4.75rem]"
            style={d(1)}
          >
            Le verre, taillé pour la{" "}
            <em className="font-semibold text-brass-600">lumière</em>.
          </h1>

          <p
            className="hero-in mt-6 max-w-md text-lg leading-relaxed text-smoke-600"
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

        {/* Mobile : la photo devient un bandeau sous le texte */}
        <div className="hero-in relative -mx-5 aspect-[4/3] sm:-mx-8 sm:aspect-[16/9] lg:hidden" style={d(4)}>
          <Image
            src="/images/gallery/facade-lobby.jpg"
            alt=""
            fill
            sizes="100vw"
            className="border-y border-smoke-950/10 object-cover"
          />
        </div>
      </div>
    </section>
  );
}
