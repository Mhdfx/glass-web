import { company } from "@/data/company";

export type ServiceCategoryId =
  | "miroiterie"
  | "vitraux"
  | "structurel"
  | "menuiserie";

export interface ServiceCategory {
  id: ServiceCategoryId;
  title: string;
  shortTitle: string;
  description: string;
  /** Items du catalogue, affichés en liste dans la carte / au survol */
  items: string[];
  image: string;
  imageAlt: string;
}

export const serviceCategories: ServiceCategory[] = [
  {
    id: "miroiterie",
    title: "Miroiterie décorative & habillage",
    shortTitle: "Miroiterie",
    description:
      "Miroirs antiques, panneaux bronze et gris, Lacobel laqué, cadres laiton : l'habillage miroir qui transforme plafonds, murs et mobilier en pièces d'exception.",
    items: [
      "Habillage plafond, pilier & mur en miroir antique",
      "Panneaux décoratifs — bronze, gris, motifs géométriques",
      "Habillage mural & comptoirs en Lacobel noir",
      "Miroirs de salle de bain avec ruban LED intégré",
      "Miroir maquillage « Hollywood » à ampoules LED",
      "Miroirs à cadres laiton & dorures classiques",
      "Consoles et cheminées habillées miroir",
    ],
    image: "/images/expertises/miroiterie.jpg",
    imageAlt:
      "Mur habillé de miroir à motifs losanges sablés — réalisation de l'atelier",
  },
  {
    id: "vitraux",
    title: "Vitraux d'art",
    shortTitle: "Vitraux",
    description:
      "Portes, fenêtres, séparations et coupoles en vitrail peint à la main — motifs floraux, classiques ou orientaux, réalisés en atelier comme au premier jour du métier.",
    items: [
      "Portes & fenêtres en vitrail — motifs floraux, style oriental",
      "Coupoles en vitrail — dômes décoratifs architecturaux",
      "Séparations & cabines de douche à motifs peints",
      "Portes sécurit à motif sablé (dépoli)",
      "Verre bombé avec motif sablé",
      "Portes accordéon en verre dépoli",
    ],
    image: "/images/expertises/vitraux.jpg",
    imageAlt: "Coupole en vitrail aux motifs colorés traversée par la lumière",
  },
  {
    id: "structurel",
    title: "Verre trempé structurel",
    shortTitle: "Structurel",
    description:
      "Escaliers, garde-corps, passerelles, façades et vitrines en verre trempé sécurit — le façonnage aux normes qui allie transparence et sécurité certifiée.",
    items: [
      "Escaliers en verre trempé sécurit",
      "Garde-corps — escaliers, terrasses, mezzanines",
      "Passerelles en verre feuilleté",
      "Façades & vitrines de commerces en sécurit",
      "Cloisons de bureau en verre trempé",
      "Fixations inox & profilés aluminium",
    ],
    image: "/images/expertises/structurel.jpg",
    imageAlt:
      "Garde-corps d'escalier en verre trempé avec main courante acier — réalisation de l'atelier",
  },
  {
    id: "menuiserie",
    title: "Menuiserie verre",
    shortTitle: "Menuiserie",
    description:
      "Portes sécurit fixes ou coulissantes et cabines de douche trempées sur-mesure — de la prise de mesure à la pose, tout est réalisé en interne.",
    items: [
      "Portes sécurit fixes",
      "Portes sécurit coulissantes",
      "Cabines de douche à l'italienne",
      "Cabines avec niche ou parois dépolies",
      "Configurations sur-mesure toutes dimensions",
    ],
    image: "/images/expertises/menuiserie.jpg",
    imageAlt: "Cabine de douche à l'italienne en verre trempé sur-mesure",
  },
];

/** Options du champ « Type de projet » du formulaire de devis */
export const projectTypes = [
  ...serviceCategories.map((c) => c.title),
  "Autre projet",
];

export const pillars = [
  {
    title: "Savoir-faire artisanal",
    description:
      `Vitraux peints à la main, dorures, miroirs antiques : un métier rare, transmis et perfectionné dans notre atelier à ${company.shortLocation}.`,
    icon: "hand" as const,
  },
  {
    title: "Sécurité certifiée",
    description:
      "Verre trempé sécurit et façonnage aux normes pour garde-corps, escaliers, façades et tout ouvrage structurel.",
    icon: "shield" as const,
  },
  {
    title: "Sur-mesure clé en main",
    description:
      "De la prise de mesure à la pose : découpe, trempe, façonnage, biseautage et installation, tout est réalisé en interne.",
    icon: "ruler" as const,
  },
];
