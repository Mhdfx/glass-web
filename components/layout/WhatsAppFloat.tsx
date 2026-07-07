import { whatsappLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/ui/icons";

/** Bouton WhatsApp flottant — visible en permanence */
export default function WhatsAppFloat() {
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Discuter sur WhatsApp"
      className="wa-float group fixed right-5 bottom-[max(1.25rem,env(safe-area-inset-bottom))] z-50 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-whatsapp text-smoke-950 shadow-[0_8px_30px_-6px_rgb(37_211_102/0.5)] transition-all duration-300 hover:scale-105 hover:shadow-[0_12px_40px_-6px_rgb(37_211_102/0.6)] active:scale-95 sm:right-7 sm:bottom-7"
    >
      {/* Onde d'appel limitée à 3 battements après le chargement, puis
          silence — jamais de pulsation perpétuelle */}
      <span
        aria-hidden
        className="absolute inset-0 -z-10 animate-ping rounded-full bg-whatsapp/40 [animation-duration:2.5s] [animation-iteration-count:3] motion-reduce:hidden"
      />
      <WhatsAppIcon className="h-7 w-7" />
      <span className="pointer-events-none absolute right-full mr-3 rounded-lg bg-smoke-900 px-3 py-1.5 text-xs font-medium whitespace-nowrap text-porcelain-50 opacity-0 transition-opacity duration-200 group-hover:opacity-100 max-sm:hidden">
        Discuter sur WhatsApp
      </span>
    </a>
  );
}
