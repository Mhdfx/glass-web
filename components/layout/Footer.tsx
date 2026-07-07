import { company } from "@/data/company";
import { whatsappLink } from "@/lib/whatsapp";
import { MailIcon, MapPinIcon, PhoneIcon, WhatsAppIcon } from "@/components/ui/icons";

export default function Footer() {
  return (
    <footer className="border-t border-smoke-950/10 bg-porcelain-100">
      <div className="container-site grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-3">
        {/* Marque */}
        <div>
          <p className="font-display text-2xl font-medium text-smoke-950">
            {company.name}
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-smoke-600">
            Atelier de miroiterie, vitraux d&apos;art, verre trempé et
            menuiserie verre sur-mesure à {company.shortLocation}, depuis{" "}
            {company.foundedYear}.
          </p>
        </div>

        {/* Navigation */}
        <nav aria-label="Navigation pied de page">
          <p className="section-label">Navigation</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {[
              ["#accueil", "Accueil"],
              ["#expertises", "Nos expertises"],
              ["#galerie", "Galerie"],
              ["#devis", "Devis gratuit"],
              ["#contact", "Contact"],
              ["/mentions-legales", "Mentions légales"],
            ].map(([href, label]) => (
              <li key={href}>
                <a
                  href={href}
                  className="text-smoke-600 transition-colors hover:text-brass-700"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Coordonnées */}
        <div>
          <p className="section-label">Coordonnées</p>
          <ul className="mt-4 space-y-3 text-sm text-smoke-600">
            <li>
              <a
                href={`tel:+${company.phoneRaw}`}
                className="flex items-center gap-2.5 transition-colors hover:text-brass-700"
              >
                <PhoneIcon className="h-4 w-4 shrink-0 text-brass-600" />
                {company.phoneDisplay}
              </a>
            </li>
            <li>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 transition-colors hover:text-brass-700"
              >
                <WhatsAppIcon className="h-4 w-4 shrink-0 text-brass-600" />
                WhatsApp
              </a>
            </li>
            <li>
              <a
                href={`mailto:${company.email}`}
                className="flex items-center gap-2.5 transition-colors hover:text-brass-700"
              >
                <MailIcon className="h-4 w-4 shrink-0 text-brass-600" />
                {company.email}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-brass-600" />
              {company.address}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-smoke-950/10">
        <div className="container-site flex flex-col items-center justify-between gap-2 py-5 text-xs text-smoke-500 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {company.name}. Tous droits réservés
          </p>
          <p>
            Miroiterie · Vitraux d&apos;art · Verre trempé · {company.city}
          </p>
        </div>
      </div>
    </footer>
  );
}
