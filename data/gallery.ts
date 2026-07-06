import type { ServiceCategoryId } from "./services";

export interface GalleryItem {
  /** Chemin de l'image — remplacer le fichier en gardant le même nom */
  src: string;
  alt: string;
  caption: string;
  category: ServiceCategoryId;
  /**
   * Format de tuile — choisi selon le format NATIF de la photo pour
   * qu'elle s'affiche entière, sans zoom :
   * wide = paysage 2col, tall = portrait 3:4, xtall = portrait étroit 9:16,
   * square = carré, undefined = paysage standard 4:3
   */
  span?: "tall" | "wide" | "square" | "xtall";
}

/**
 * Photos réelles de l'atelier (traitées via scripts/process-client-photos.mjs).
 * Les 3 anciens visuels d'ambiance [PLACEHOLDER] (porte-vitrail, coupole-vitrail,
 * douche-italienne) ont été retirés le 2026-07-06 à la demande du client —
 * la catégorie « vitraux » n'a plus de photo et son filtre est masqué
 * automatiquement (voir galleryFilters ci-dessous). Rajouter simplement un
 * item `category: "vitraux"` quand de vraies photos arriveront : le filtre
 * réapparaîtra tout seul.
 */
/**
 * Chaque tuile épouse le format natif de sa photo (aucun zoom) et
 * l'ordre + les formats ferment une mosaïque exacte sur 3 colonnes :
 * square = 1×3, xtall = 1×5, wide = 2×3, tall = 1×4, std = 1×2
 * (rangées de 7.5rem — voir Gallery.tsx). Total = 63 cellules = 21 rangées
 * pleines, les 3 colonnes finissent à ras (vérifié par simulation du
 * placement `grid-auto-flow: dense`) — préserver cet équilibre en cas d'ajout.
 */
export const galleryItems: GalleryItem[] = [
  {
    src: "/images/gallery/agencement-restaurant.jpg",
    alt: "Entrée de restaurant avec arche circulaire et claustras décoratifs en bois",
    caption: "Agencement décoratif — restaurant, Casablanca",
    category: "menuiserie",
    span: "square",
  },
  {
    src: "/images/gallery/facade-lobby.jpg",
    alt: "Lobby d'hôtel avec grande façade vitrée toute hauteur et banquette circulaire",
    caption: "Façade vitrée toute hauteur — lobby hôtel",
    category: "structurel",
    span: "xtall",
  },
  {
    src: "/images/gallery/mur-losanges-sables.jpg",
    alt: "Mur en miroir à motifs losanges sablés dans une chambre",
    caption: "Mur miroir — motifs losanges sablés",
    category: "miroiterie",
    span: "tall",
  },
  {
    src: "/images/gallery/miroir-led-marbre.jpg",
    alt: "Miroir rétroéclairé LED sur mur en marbre avec robinetterie dorée",
    caption: "Miroir LED rétroéclairé — salle de bain marbre",
    category: "miroiterie",
    span: "tall",
  },
  {
    src: "/images/gallery/panneau-biseaute-artdeco.jpg",
    alt: "Panneau mural en miroir biseauté aux lignes géométriques, style Art Déco",
    caption: "Panneau miroir biseauté — esprit Art Déco",
    category: "miroiterie",
    span: "tall",
  },
  {
    src: "/images/gallery/agencement-cafe.jpg",
    alt: "Intérieur de café avec comptoirs en marbre et mezzanine",
    caption: "Agencement bar & mezzanine — café",
    category: "menuiserie",
    span: "xtall",
  },
  {
    src: "/images/gallery/miroir-losange-laiton.jpg",
    alt: "Miroir mural toute hauteur à motifs losanges et cadre doré dans une entrée",
    caption: "Miroir toute hauteur, cadre doré — entrée",
    category: "miroiterie",
    span: "tall",
  },
  {
    src: "/images/gallery/garde-corps-escalier.jpg",
    alt: "Garde-corps en verre trempé avec main courante en acier noir sur un escalier",
    caption: "Garde-corps verre trempé & acier — escalier",
    category: "structurel",
    span: "tall",
  },
  {
    src: "/images/gallery/table-laquee.jpg",
    alt: "Table de salle à manger à plateau laqué crème avec chaises assorties",
    caption: "Plateau laqué sur-mesure — mobilier",
    category: "menuiserie",
    span: "tall",
  },
  {
    src: "/images/gallery/miroirs-organiques.jpg",
    alt: "Deux miroirs de forme organique rétroéclairés au-dessus de vasques noires",
    caption: "Miroirs organiques rétroéclairés — double vasque",
    category: "miroiterie",
    span: "tall",
  },
  {
    src: "/images/gallery/table-verre.jpg",
    alt: "Table de salle à manger à plateau en verre trempé clair",
    caption: "Table à plateau en verre trempé",
    category: "menuiserie",
    span: "tall",
  },
  {
    src: "/images/gallery/habillage-miroir-salon.jpg",
    alt: "Salon habillé d'un mur en panneaux de miroir biseautés avec lustres dorés",
    caption: "Habillage mural miroir biseauté — salon, Casablanca",
    category: "miroiterie",
    span: "wide",
  },
  {
    src: "/images/gallery/miroir-fume.jpg",
    alt: "Habillage mural en miroir fumé à croisillons acier noir sur boiserie",
    caption: "Habillage miroir fumé, cadre acier noir",
    category: "miroiterie",
    span: "tall",
  },
  {
    src: "/images/gallery/residence-vitrages.jpg",
    alt: "Résidence avec terrasses vitrées et garde-corps en verre",
    caption: "Programme résidentiel — vitrages & garde-corps",
    category: "structurel",
    span: "tall",
  },
  {
    src: "/images/gallery/miroir-led-modele.jpg",
    alt: "Miroir de salle de bain rétroéclairé LED au-dessus d'une vasque",
    caption: "Miroir LED — modèle sur commande",
    category: "miroiterie",
  },
  {
    src: "/images/gallery/garde-corps-vue.jpg",
    alt: "Vue d'ensemble d'un escalier avec garde-corps en verre trempé",
    caption: "Garde-corps en verre — vue d'ensemble",
    category: "structurel",
  },
];

const allFilters = [
  { id: "all", label: "Tout" },
  { id: "miroiterie", label: "Miroiterie" },
  { id: "vitraux", label: "Vitraux" },
  { id: "structurel", label: "Structurel" },
  { id: "menuiserie", label: "Menuiserie" },
] as const;

/**
 * Seules les catégories ayant au moins une photo sont proposées en filtre —
 * un filtre qui afficherait une grille vide est masqué automatiquement.
 */
export const galleryFilters = allFilters.filter(
  (f) => f.id === "all" || galleryItems.some((item) => item.category === f.id),
);

export type GalleryFilterId = (typeof allFilters)[number]["id"];
