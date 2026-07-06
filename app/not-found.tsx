import Link from "next/link";
import { company } from "@/data/company";
import { whatsappLink } from "@/lib/whatsapp";
import { ButtonLink } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";

export default function NotFound() {
  return (
    <main className="relative flex min-h-dvh items-center overflow-hidden bg-ink-950">
      {/* Halo laiton — même ambiance que le site */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/4 left-1/2 h-[420px] w-[680px] -translate-x-1/2 rounded-full bg-brass-500/[0.06] blur-3xl"
      />

      <div className="container-site py-24 text-center">
        <p className="section-label">Erreur 404</p>
        <h1 className="heading-display mx-auto mt-5 max-w-xl text-4xl sm:text-5xl">
          Cette page s&apos;est brisée en mille éclats
        </h1>
        <p className="mx-auto mt-5 max-w-md leading-relaxed text-stone-300">
          L&apos;adresse demandée n&apos;existe pas ou plus. Le reste de
          l&apos;atelier {company.name}, lui, est bien en place.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <ButtonLink href="/" variant="primary" arrow>
            Retour à l&apos;accueil
          </ButtonLink>
          <ButtonLink
            href={whatsappLink()}
            variant="ghost"
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsAppIcon className="h-5 w-5 text-whatsapp" />
            Nous écrire sur WhatsApp
          </ButtonLink>
        </div>

        <p className="mt-12 text-sm text-stone-500">
          Vous cherchiez peut-être{" "}
          <Link
            href="/#galerie"
            className="font-semibold text-brass-400 transition-colors hover:text-brass-300"
          >
            nos réalisations
          </Link>{" "}
          ou{" "}
          <Link
            href="/#devis"
            className="font-semibold text-brass-400 transition-colors hover:text-brass-300"
          >
            une demande de devis
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
