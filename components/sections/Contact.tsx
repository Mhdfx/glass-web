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

const cards = [
  {
    icon: WhatsAppIcon,
    title: "WhatsApp",
    value: company.phoneDisplay,
    href: whatsappLink(),
    external: true,
  },
  {
    icon: PhoneIcon,
    title: "Téléphone",
    value: company.phoneDisplay,
    href: `tel:+${company.phoneRaw}`,
  },
  {
    icon: MailIcon,
    title: "Email",
    value: company.email,
    href: `mailto:${company.email}`,
  },
  {
    icon: MapPinIcon,
    title: "Atelier",
    value: company.address,
  },
];

export default function Contact() {
  return (
    <section
      id="contact"
      className="bg-ink-950 py-24 sm:py-32"
      aria-labelledby="contact-titre"
    >
      <div className="container-site">
        <Reveal className="max-w-2xl">
          <p className="section-label">Contact</p>
          <h2
            id="contact-titre"
            className="heading-display mt-4 text-3xl sm:text-4xl lg:text-[2.75rem] lg:leading-tight"
          >
            Venez voir le travail de l&apos;atelier
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <div className="grid gap-4 sm:grid-cols-2">
            {cards.map((card, i) => {
              const Icon = card.icon;
              const inner = (
                <>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-brass-500/25 bg-brass-500/10 text-brass-400">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-xs tracking-wide text-stone-400 uppercase">
                      {card.title}
                    </span>
                    <span className="mt-1 block text-sm font-medium break-all text-ivory-100">
                      {card.value}
                    </span>
                  </span>
                </>
              );
              const cls =
                "glass-panel glass-edge flex items-center gap-4 rounded-2xl p-5 transition-all duration-300";
              return (
                <Reveal key={card.title} delay={i * 0.08}>
                  {card.href ? (
                    <a
                      href={card.href}
                      {...(card.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className={`${cls} cursor-pointer hover:-translate-y-1 hover:border-brass-500/30 hover:shadow-glass`}
                    >
                      {inner}
                    </a>
                  ) : (
                    <div className={cls}>{inner}</div>
                  )}
                </Reveal>
              );
            })}

            {/* Horaires */}
            <Reveal delay={0.32} className="sm:col-span-2">
              <div className="glass-panel glass-edge flex items-start gap-4 rounded-2xl p-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-brass-500/25 bg-brass-500/10 text-brass-400">
                  <ClockIcon className="h-5 w-5" />
                </span>
                <div className="flex-1">
                  <span className="block text-xs tracking-wide text-stone-400 uppercase">
                    Horaires
                  </span>
                  <dl className="mt-2 space-y-1">
                    {company.hours.map((slot) => (
                      <div
                        key={slot.days}
                        className="flex justify-between gap-4 text-sm"
                      >
                        <dt className="text-stone-300">{slot.days}</dt>
                        <dd className="font-medium text-ivory-100">
                          {slot.hours}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Carte Google Maps — affichée seulement si l'URL est renseignée */}
          <Reveal delay={0.15}>
            {company.mapsEmbedUrl ? (
              <div className="h-full min-h-[320px] overflow-hidden rounded-2xl border border-white/[0.06]">
                <iframe
                  src={company.mapsEmbedUrl}
                  title={`Localisation de l'atelier ${company.name}`}
                  className="h-full w-full grayscale-[0.4]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="glass-panel glass-edge flex h-full min-h-[320px] flex-col items-center justify-center rounded-2xl p-8 text-center">
                <MapPinIcon className="h-10 w-10 text-brass-500/60" />
                <p className="mt-4 font-display text-xl text-ivory-100">
                  {company.address}
                </p>
                <p className="mt-2 max-w-xs text-sm text-stone-400">
                  {company.serviceArea} — déplacement pour prise de mesure sur
                  demande.
                </p>
              </div>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
