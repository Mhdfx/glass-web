import { company } from "@/data/company";

/** Lien WhatsApp direct avec message d'accroche générique */
export function whatsappLink(message?: string): string {
  const text =
    message ??
    `Bonjour ${company.name}, je souhaite des informations sur vos services de miroiterie et verre sur-mesure.`;
  return `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(text)}`;
}

export interface QuoteRequest {
  name: string;
  phone: string;
  city: string;
  projectType: string;
  description: string;
}

/** Message WhatsApp pré-rempli généré depuis le formulaire de devis */
export function quoteWhatsappLink(quote: QuoteRequest): string {
  const lines = [
    `Bonjour ${company.name}, je souhaite un devis gratuit.`,
    ``,
    `Nom : ${quote.name}`,
    `Téléphone : ${quote.phone}`,
    `Ville : ${quote.city}`,
    `Type de projet : ${quote.projectType}`,
    ``,
    `Description :`,
    quote.description,
  ];
  return `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(
    lines.join("\n"),
  )}`;
}
