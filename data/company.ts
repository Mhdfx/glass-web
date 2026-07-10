/**
 * SOURCE DE VÉRITÉ UNIQUE — informations entreprise.
 * Téléphone, email, WhatsApp, footer, JSON-LD et formulaire devis
 * lisent toutes ces valeurs.
 */

export const company = {
  name: "Chaimae Glass",
  tagline: "Miroiterie, vitraux & verre sur-mesure",
  foundedYear: 2005,
  phoneDisplay: "+212 6 28 53 25 90",
  phoneRaw: "212628532590",
  whatsapp: "212628532590",
  email: "outboutmehdi@gmail.com",
  /** Affichage complet (contact, footer) */
  address: "Aïn Sebaâ — Casablanca, Maroc",
  /** Quartier + ville (hero, SEO, textes courts) */
  shortLocation: "Aïn Sebaâ, Casablanca",
  neighborhood: "Aïn Sebaâ",
  city: "Casablanca",
  serviceArea: "Casablanca & environs",
  projectsCount: 1000 as number | null,
  hours: [
    { days: "Lundi – Vendredi", hours: "8h30 – 18h30" },
    { days: "Samedi", hours: "9h00 – 13h00" },
    { days: "Dimanche", hours: "Fermé" },
  ],
  /**
   * Google Maps embed (sans clé API). Affiné sur le quartier —
   * remplacer par l'embed de l'adresse exacte de l'atelier si besoin.
   */
  mapsEmbedUrl:
    "https://www.google.com/maps?q=A%C3%AFn%20Seba%C3%A2%2C%20Casablanca&z=14&output=embed" as
      | string
      | null,
  siteUrl: "https://chaimaeglass.ma",
  /** Réseaux sociaux — à ajouter plus tard */
  social: {
    instagram: null as string | null,
    facebook: null as string | null,
  },
} as const;

/** Années d'expérience — constante évaluée au build (pas de décalage SSR) */
export const yearsOfExperience =
  new Date().getFullYear() - company.foundedYear;
