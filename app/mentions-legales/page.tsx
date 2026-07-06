import type { Metadata } from "next";
import Link from "next/link";
import { company } from "@/data/company";

export const metadata: Metadata = {
  title: "Mentions légales",
  robots: { index: false },
};

export default function MentionsLegales() {
  return (
    <main className="container-site max-w-3xl py-24">
      <Link
        href="/"
        className="text-sm font-semibold text-brass-700 transition-colors hover:text-brass-600"
      >
        ← Retour au site
      </Link>

      <h1 className="heading-display mt-6 text-3xl sm:text-4xl">
        Mentions légales
      </h1>

      <div className="mt-10 space-y-10 text-sm leading-relaxed text-smoke-600 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-medium [&_h2]:text-smoke-950 [&_p]:mt-3">
        <section>
          <h2>Éditeur du site</h2>
          <p>
            {company.name} — Atelier de miroiterie, vitraux d&apos;art et
            verre sur-mesure
            <br />
            {company.address}
            <br />
            Téléphone : {company.phoneDisplay}
            <br />
            Email : {company.email}
          </p>
        </section>

        <section>
          <h2>Hébergement</h2>
          <p>
            Site hébergé sur un serveur privé virtuel (VPS) fourni par
            Contabo GmbH — Aschauer Straße 32a, 81549 Munich, Allemagne —
            contabo.com
          </p>
        </section>

        <section>
          <h2>Propriété intellectuelle</h2>
          <p>
            L&apos;ensemble des contenus de ce site (textes, photographies de
            réalisations, logo, éléments graphiques) est la propriété de{" "}
            {company.name}, sauf mention contraire. Toute reproduction,
            représentation ou diffusion, totale ou partielle, sans
            autorisation écrite préalable est interdite.
          </p>
        </section>

        <section>
          <h2>Données personnelles</h2>
          <p>
            Les informations transmises via le formulaire de demande de devis
            (nom, téléphone, ville, description du projet) sont utilisées
            uniquement pour répondre à votre demande. Elles sont transmises
            via WhatsApp et/ou par email à {company.name} et ne sont ni
            revendues ni communiquées à des tiers.
          </p>
          <p>
            Conformément à la loi marocaine n° 09-08 relative à la protection
            des personnes physiques à l&apos;égard du traitement des données à
            caractère personnel, vous disposez d&apos;un droit d&apos;accès,
            de rectification et d&apos;opposition sur vos données. Pour
            l&apos;exercer, contactez-nous à {company.email}.
          </p>
        </section>

        <section>
          <h2>Cookies</h2>
          <p>
            Ce site n&apos;utilise pas de cookies de suivi publicitaire. Seuls
            des cookies techniques strictement nécessaires au fonctionnement
            du site peuvent être déposés.
          </p>
        </section>

        <section>
          <h2>Responsabilité</h2>
          <p>
            {company.name} s&apos;efforce de maintenir les informations de ce
            site exactes et à jour, sans pouvoir garantir l&apos;absence
            d&apos;erreurs. Les photographies de réalisations sont non
            contractuelles.
          </p>
        </section>
      </div>
    </main>
  );
}
