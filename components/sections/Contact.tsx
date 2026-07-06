import { company } from "@/data/company";
import { whatsappLink } from "@/lib/whatsapp";
import Reveal from "@/components/ui/Reveal";
import {
  ClockIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  WhatsAppIcon,
} from "@/components/ui/icons";

const rows = [
  {
    icon: WhatsAppIcon,
    label: "WhatsApp",
    value: company.phoneDisplay,
    href: whatsappLink(),
    external: true,
  },
  {
    icon: PhoneIcon,
    label: "Téléphone",
    value: company.phoneDisplay,
    href: `tel:+${company.phoneRaw}`,
  },
  {
    icon: MailIcon,
    label: "Email",
    value: company.email,
    href: `mailto:${company.email}`,
  },
  {
    icon: MapPinIcon,
    label: "Atelier",
    value: company.address,
  },
];

/**
 * Contact v2 : la carte occupe toute la largeur ; la fiche de l'atelier
 * la chevauche en panneau blanc (profondeur par superposition, pas par
 * ombre gratuite). En mobile, la fiche passe au-dessus de la carte.
 */
export default function Contact() {
  return (
    <section
      id="contact"
      className="bg-porcelain-50 py-24 sm:py-32"
      aria-labelledby="contact-titre"
    >
      <div className="container-site">
        <Reveal className="max-w-2xl">
          <h2
            id="contact-titre"
            className="heading-display text-3xl sm:text-4xl lg:text-[2.75rem] lg:leading-tight"
          >
            Venez voir le travail de l&apos;atelier
          </h2>
        </Reveal>

        <Reveal delay={0.1} className="relative mt-12">
          {/* Fiche atelier — chevauche la carte sur desktop */}
          <div className="pane relative z-10 rounded-2xl p-6 sm:p-8 md:absolute md:top-8 md:left-8 md:max-w-sm">
            <ul className="space-y-5">
              {rows.map((row) => {
                const Icon = row.icon;
                const inner = (
                  <>
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brass-600/25 bg-brass-500/10 text-brass-700">
                      <Icon className="h-4.5 w-4.5" />
                    </span>
                    <span>
                      <span className="block text-xs tracking-wide text-smoke-500 uppercase">
                        {row.label}
                      </span>
                      <span className="mt-0.5 block text-sm font-medium break-all text-smoke-950">
                        {row.value}
                      </span>
                    </span>
                  </>
                );
                return (
                  <li key={row.label}>
                    {row.href ? (
                      <a
                        href={row.href}
                        {...(row.external
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                        className="group flex items-center gap-4"
                      >
                        {inner}
                      </a>
                    ) : (
                      <div className="flex items-center gap-4">{inner}</div>
                    )}
                  </li>
                );
              })}
            </ul>

            <div className="mt-6 border-t border-smoke-950/10 pt-5">
              <span className="flex items-center gap-2 text-xs tracking-wide text-smoke-500 uppercase">
                <ClockIcon className="h-4 w-4" />
                Horaires
              </span>
              <dl className="mt-3 space-y-1.5">
                {company.hours.map((slot) => (
                  <div
                    key={slot.days}
                    className="flex justify-between gap-4 text-sm"
                  >
                    <dt className="text-smoke-600">{slot.days}</dt>
                    <dd className="font-medium text-smoke-950">{slot.hours}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* Carte — pleine largeur, sous la fiche */}
          {company.mapsEmbedUrl ? (
            <div className="mt-6 h-[320px] overflow-hidden rounded-2xl border border-smoke-950/10 md:mt-0 md:h-[560px]">
              <iframe
                src={company.mapsEmbedUrl}
                title={`Localisation de l'atelier ${company.name}`}
                className="h-full w-full grayscale-[0.35]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="mt-6 flex h-[320px] flex-col items-center justify-center rounded-2xl border border-smoke-950/10 bg-porcelain-100 p-8 text-center md:mt-0 md:h-[560px]">
              <MapPinIcon className="h-10 w-10 text-brass-600/70" />
              <p className="mt-4 font-display text-xl font-medium text-smoke-950">
                {company.address}
              </p>
              <p className="mt-2 max-w-xs text-sm text-smoke-500">
                {company.serviceArea}, déplacement pour prise de mesure sur
                demande.
              </p>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
