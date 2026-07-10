import type { ServiceCategoryId } from "@/data/services";

/**
 * Contenu long de chaque page d'expertise (/expertises/[slug]).
 * Rédigé pour un visiteur qui NE CONNAÎT PAS le métier : chaque page
 * explique ce qu'est le service, comment il se fabrique (étapes), où il
 * s'emploie, le vocabulaire technique, et répond aux questions courantes.
 *
 * Sources documentaires (techniques du verre) :
 *  - Idéoverre, Sud Vitrail Mosaïque (techniques du vitrail plomb / Tiffany / fusing)
 *  - Norme NF P01-012 (garde-corps), Inox Design / ACQ (verre feuilleté trempé)
 *  - Sphinx Glass, Miroir Émoi (argenture & fabrication du miroir)
 *  - E-miroiterie, Shower & Co (parois de douche sur-mesure)
 */

export interface ProcessStep {
  /** Numéro affiché (01, 02…) — dérivé de l'ordre, gardé ici pour la clarté */
  title: string;
  description: string;
}

export interface Application {
  title: string;
  description: string;
}

export interface Technique {
  /** Terme de métier expliqué simplement — construit un mini-glossaire */
  term: string;
  definition: string;
}

export interface ServiceFaq {
  question: string;
  answer: string;
}

export interface ServiceDetail {
  slug: ServiceCategoryId;
  /** Sur-titre court affiché au-dessus du H1 (« Expertise 01 ») */
  index: string;
  /** Accroche d'une ligne posée sous le titre du hero */
  heroSubtitle: string;
  heroImage: string;
  heroImageAlt: string;
  /** Bloc pédagogique « c'est quoi ? » — 2 à 3 paragraphes accessibles */
  intro: { heading: string; paragraphs: string[] };
  /** Bénéfices concrets pour le client (pourquoi le choisir) */
  benefits: { title: string; description: string }[];
  /** Étapes de fabrication — affichées en carrousel numéroté */
  process: ProcessStep[];
  /** Où ce savoir-faire s'emploie — affiché en carrousel de cartes */
  applications: Application[];
  /** Mini-glossaire — démystifie le vocabulaire du métier */
  techniques: Technique[];
  /** Questions fréquentes — accordéon */
  faq: ServiceFaq[];
  metaTitle: string;
  metaDescription: string;
}

const details: Record<ServiceCategoryId, ServiceDetail> = {
  /* ————————————————————————————————————————————————————————————————
     1. MIROITERIE DÉCORATIVE & HABILLAGE
  ———————————————————————————————————————————————————————————————— */
  miroiterie: {
    slug: "miroiterie",
    index: "Expertise 01",
    heroSubtitle:
      "L'art d'habiller murs, plafonds et mobilier de miroir — pour agrandir l'espace, multiplier la lumière et signer une pièce.",
    heroImage: "/images/gallery/habillage-miroir-salon.jpg",
    heroImageAlt:
      "Salon habillé d'un mur en panneaux de miroir biseautés avec lustres dorés",
    intro: {
      heading: "La miroiterie décorative, qu'est-ce que c'est ?",
      paragraphs: [
        "Un miroir n'est rien d'autre qu'une plaque de verre dont une face reçoit une fine couche de métal réfléchissant — l'argenture. La miroiterie décorative, c'est l'art d'utiliser ce matériau non plus comme un simple objet à accrocher, mais comme un véritable revêtement : on en habille un pan de mur entier, un plafond, un pilier, une console ou une cheminée.",
        "Le résultat transforme une pièce. Un mur de miroir double visuellement la surface, renvoie la lumière du jour dans les zones sombres et donne de la profondeur aux petits espaces. Selon la finition choisie — biseau, teinte bronze ou fumée, effet ancien patiné — l'habillage passe du très contemporain au franchement classique.",
        "Tout se joue dans le sur-mesure : chaque panneau est découpé, façonné et posé aux dimensions exactes de votre mur, avec des joints maîtrisés et des angles nets. C'est ce qui sépare un habillage d'atelier d'un simple miroir de grande surface.",
      ],
    },
    benefits: [
      {
        title: "Agrandit l'espace",
        description:
          "Un pan de miroir repousse visuellement les murs et convient particulièrement aux entrées, couloirs et petites pièces.",
      },
      {
        title: "Capte la lumière",
        description:
          "La surface réfléchissante renvoie la lumière naturelle et celle des luminaires, éclaircissant les zones les plus sombres.",
      },
      {
        title: "Finitions sur-mesure",
        description:
          "Biseau, bronze, gris, Lacobel laqué, patine ancienne ou cadre laiton : la finition s'accorde à votre décoration.",
      },
      {
        title: "Pose soignée",
        description:
          "Découpe au millimètre, angles ajustés, fixation invisible : un habillage posé par l'atelier, pas un panneau standard.",
      },
    ],
    process: [
      {
        title: "Prise de mesure",
        description:
          "Nous relevons sur place les dimensions exactes, les prises électriques et les défauts d'aplomb du support à habiller.",
      },
      {
        title: "Choix de la finition",
        description:
          "Vous choisissez le type de miroir (clair, bronze, fumé, antique), le biseau, les motifs sablés et l'éventuel éclairage LED.",
      },
      {
        title: "Découpe & façonnage",
        description:
          "Le verre argenté est découpé aux cotes, puis ses bords sont polis ou biseautés pour un rendu net et sans danger.",
      },
      {
        title: "Décor & gravure",
        description:
          "Selon le projet, on ajoute les motifs par sablage, la patine « ancienne » ou l'intégration d'un ruban LED au dos.",
      },
      {
        title: "Pose sur site",
        description:
          "Les panneaux sont collés et fixés sur un support préparé, joints ajustés, pour un habillage parfaitement plan.",
      },
    ],
    applications: [
      {
        title: "Murs & pans entiers",
        description:
          "Salon, salle à manger, entrée : un mur de miroir qui agrandit la pièce et capte la lumière.",
      },
      {
        title: "Plafonds & piliers",
        description:
          "Habillage de plafond ou de colonnes en miroir antique pour un effet d'apparat classique.",
      },
      {
        title: "Salles de bain",
        description:
          "Miroirs avec ruban LED intégré, miroir maquillage « Hollywood » à ampoules, plans en Lacobel.",
      },
      {
        title: "Mobilier & cheminées",
        description:
          "Consoles, dessus de commode et manteaux de cheminée habillés de miroir biseauté ou patiné.",
      },
      {
        title: "Commerces & réception",
        description:
          "Halls, restaurants et boutiques : le miroir décoratif crée une ambiance et agrandit les espaces d'accueil.",
      },
    ],
    techniques: [
      {
        term: "Argenture",
        definition:
          "La fine couche métallique déposée au dos du verre qui le rend réfléchissant. Sa qualité détermine la durée de vie du miroir.",
      },
      {
        term: "Biseau",
        definition:
          "Bord du miroir taillé en pente polie. Il crée un liseré lumineux qui capte et décompose la lumière, façon cristal.",
      },
      {
        term: "Miroir antique / vieilli",
        definition:
          "Miroir traité pour imiter une patine ancienne, avec des taches et voiles maîtrisés — chaleur et charme d'époque.",
      },
      {
        term: "Lacobel",
        definition:
          "Verre laqué opaque (non réfléchissant) d'une couleur unie et profonde, utilisé pour crédences, comptoirs et habillages muraux.",
      },
      {
        term: "Sablage",
        definition:
          "Projection de sable fin sous pression pour dépolir le verre et y graver des motifs mats, translucides ou décoratifs.",
      },
    ],
    faq: [
      {
        question: "Peut-on poser un miroir sur tout un mur ?",
        answer:
          "Oui. Le mur est habillé en un ou plusieurs panneaux découpés sur-mesure. Nous préparons le support pour qu'il soit plan et sain, puis les panneaux sont collés et fixés avec des joints maîtrisés.",
      },
      {
        question: "Quelle est la différence entre un miroir clair et un miroir bronze ou fumé ?",
        answer:
          "Le miroir clair renvoie une image fidèle et lumineuse. Les miroirs bronze et fumé sont teintés dans la masse : ils adoucissent le reflet et apportent une ambiance plus feutrée et haut de gamme.",
      },
      {
        question: "Peut-on intégrer un éclairage LED ?",
        answer:
          "Oui, c'est très courant en salle de bain et pour les miroirs de maquillage. Le ruban LED est intégré au dos ou en pourtour du miroir, avec une lumière chaude ou neutre selon votre choix.",
      },
      {
        question: "Un habillage miroir est-il fragile ?",
        answer:
          "Correctement posé sur un support préparé, un habillage mural est très durable. Pour les zones exposées aux chocs, nous conseillons des épaisseurs adaptées et, si besoin, un traitement de sécurité.",
      },
    ],
    metaTitle: "Miroiterie décorative & habillage mural miroir sur-mesure",
    metaDescription:
      "Habillage mural, plafond et mobilier en miroir sur-mesure : biseau, bronze, fumé, miroir antique, Lacobel et LED intégrée. Prise de mesure et pose par l'atelier.",
  },

  /* ————————————————————————————————————————————————————————————————
     2. VITRAUX D'ART
  ———————————————————————————————————————————————————————————————— */
  vitraux: {
    slug: "vitraux",
    index: "Expertise 02",
    heroSubtitle:
      "Des morceaux de verre coloré assemblés à la main pour dessiner la lumière — portes, fenêtres, coupoles et séparations.",
    heroImage: "/images/gallery/porte-vitrail.jpg",
    heroImageAlt:
      "Porte en vitrail avec motifs floraux et géométriques colorés traversés par la lumière",
    intro: {
      heading: "Le vitrail d'art, qu'est-ce que c'est ?",
      paragraphs: [
        "Un vitrail est un tableau fait de lumière. On découpe des morceaux de verre coloré selon un dessin, puis on les assemble bord à bord à l'aide de fines baguettes de plomb ou de rubans de cuivre soudés. Quand la lumière du jour traverse l'ensemble, les couleurs s'illuminent et projettent leurs teintes dans la pièce.",
        "C'est l'un des plus anciens métiers d'art du verre — celui des cathédrales — et il se réalise encore aujourd'hui entièrement à la main. Chaque pièce est unique : le tracé du dessin, le choix des verres, la peinture des détails à la grisaille et l'assemblage sont autant de gestes d'artisan.",
        "Au-delà des fenêtres classiques, le vitrail habille aujourd'hui des portes intérieures, des coupoles et dômes décoratifs, des séparations de pièces et même des parois de douche à motifs — partout où l'on veut filtrer un regard tout en laissant passer la lumière.",
      ],
    },
    benefits: [
      {
        title: "Pièce unique",
        description:
          "Chaque vitrail est dessiné et assemblé à la main : un motif, des couleurs et des dimensions qui n'existent qu'une fois.",
      },
      {
        title: "Lumière colorée",
        description:
          "Le verre teinté filtre la lumière et projette ses couleurs dans la pièce, créant une atmosphère qui évolue avec le jour.",
      },
      {
        title: "Intimité préservée",
        description:
          "Un vitrail masque les regards tout en laissant passer la clarté — idéal pour portes, impostes et séparations.",
      },
      {
        title: "Savoir-faire d'atelier",
        description:
          "Motifs floraux, classiques ou orientaux peints et cuits à l'atelier, comme au premier jour du métier.",
      },
    ],
    process: [
      {
        title: "Maquette grandeur nature",
        description:
          "Le dessin du vitrail est tracé à taille réelle. Il sert de plan : il fixe les couleurs, les formes et le tracé des plombs.",
      },
      {
        title: "Gabarits & découpe",
        description:
          "Chaque forme est reportée en gabarit, puis le verre coloré est coupé au coupe-verre pièce par pièce, selon le dessin.",
      },
      {
        title: "Meulage",
        description:
          "Les bords de chaque morceau sont meulés pour que toutes les pièces s'ajustent parfaitement les unes aux autres.",
      },
      {
        title: "Peinture & cuisson",
        description:
          "Les détails (visages, feuillages, ombres) sont peints à la grisaille puis cuits au four pour fixer le décor dans le verre.",
      },
      {
        title: "Sertissage & soudure",
        description:
          "Les pièces sont serties dans le plomb (ou cerclées de cuivre, méthode Tiffany), puis chaque jonction est soudée à l'étain.",
      },
      {
        title: "Masticage & pose",
        description:
          "Un mastic rend l'ensemble étanche et rigide ; le vitrail est ensuite nettoyé, patiné, puis posé dans son ouverture.",
      },
    ],
    applications: [
      {
        title: "Portes & fenêtres",
        description:
          "Portes intérieures, impostes et fenêtres en vitrail — motifs floraux, classiques ou orientaux.",
      },
      {
        title: "Coupoles & dômes",
        description:
          "Coupoles en vitrail au plafond : un dôme de lumière colorée, pièce maîtresse d'un salon ou d'un patio.",
      },
      {
        title: "Séparations de pièces",
        description:
          "Cloisons et claustras vitrés qui délimitent l'espace sans le cloisonner, tout en laissant filer la lumière.",
      },
      {
        title: "Parois de douche",
        description:
          "Séparations et cabines de douche à motifs peints ou sablés, pour allier intimité et décor.",
      },
      {
        title: "Portes sablées",
        description:
          "Portes sécurit à motif sablé (dépoli) et verre bombé décoré, alternative sobre au vitrail coloré.",
      },
    ],
    techniques: [
      {
        term: "Sertissage au plomb",
        definition:
          "Méthode traditionnelle : les verres sont encastrés dans des baguettes de plomb en H, soudées à l'étain aux intersections.",
      },
      {
        term: "Méthode Tiffany",
        definition:
          "Inventée vers 1870 : chaque pièce est cerclée d'un ruban de cuivre adhésif puis soudée. Idéale pour les motifs fins et courbes.",
      },
      {
        term: "Grisaille",
        definition:
          "Peinture vitrifiable appliquée sur le verre puis cuite au four pour dessiner les ombres et les détails de façon permanente.",
      },
      {
        term: "Fusing",
        definition:
          "Technique où plusieurs verres sont superposés et fondus ensemble au four, sans plomb, pour des effets de matière et de relief.",
      },
      {
        term: "Mastic",
        definition:
          "Pâte (à base d'huile de lin) glissée entre verre et plomb : elle rend le vitrail étanche, rigide et durable.",
      },
    ],
    faq: [
      {
        question: "Un vitrail laisse-t-il passer la lumière ?",
        answer:
          "Oui, c'est tout son intérêt. Le verre coloré filtre la lumière et projette ses teintes dans la pièce. Selon les verres choisis (transparents, translucides, opalescents), on règle le niveau d'intimité et de clarté.",
      },
      {
        question: "Peut-on faire un vitrail sur-mesure avec mon propre motif ?",
        answer:
          "Absolument. Tout part d'une maquette dessinée à vos dimensions. Motifs floraux, géométriques, classiques ou orientaux : le dessin est validé avec vous avant la découpe des verres.",
      },
      {
        question: "Quelle différence entre la technique au plomb et la méthode Tiffany ?",
        answer:
          "Le plomb, robuste, convient aux grandes surfaces (fenêtres, portes). La méthode Tiffany, au ruban de cuivre, permet des pièces plus fines et des courbes délicates — parfaite pour les décors très détaillés et les objets.",
      },
      {
        question: "Un vitrail est-il fragile ou difficile à entretenir ?",
        answer:
          "Un vitrail bien réalisé et masticé traverse les décennies. Il s'entretient avec un chiffon doux et sec. Pour les portes et zones de passage, on peut le doubler d'un verre de protection.",
      },
    ],
    metaTitle: "Vitraux d'art sur-mesure — portes, fenêtres & coupoles",
    metaDescription:
      "Vitraux d'art peints et assemblés à la main : portes, fenêtres, coupoles et séparations. Techniques plomb et Tiffany, motifs floraux, classiques et orientaux sur-mesure.",
  },

  /* ————————————————————————————————————————————————————————————————
     3. VERRE TREMPÉ STRUCTUREL
  ———————————————————————————————————————————————————————————————— */
  structurel: {
    slug: "structurel",
    index: "Expertise 03",
    heroSubtitle:
      "Le verre qui porte, protège et sécurise — garde-corps, escaliers, passerelles et façades en verre trempé aux normes.",
    heroImage: "/images/gallery/garde-corps-escalier.jpg",
    heroImageAlt:
      "Garde-corps en verre trempé avec main courante en acier noir sur un escalier",
    intro: {
      heading: "Le verre trempé structurel, qu'est-ce que c'est ?",
      paragraphs: [
        "Le verre structurel, c'est du verre qui assure une fonction de sécurité ou de portance : il retient une chute (garde-corps), on marche dessus (marche d'escalier, passerelle) ou il tient une façade. Pour cela, un verre ordinaire ne suffit pas — on le renforce par la trempe.",
        "La trempe consiste à chauffer le verre à environ 700 °C puis à le refroidir brutalement à l'air. Cela crée des tensions internes qui le rendent jusqu'à cinq fois plus résistant. Autre avantage capital : en cas de casse, il se fragmente en petits morceaux non coupants — d'où son nom de verre « sécurit ».",
        "Pour les garde-corps et les sols, on va plus loin avec le verre feuilleté : deux verres trempés collés par un film plastique. Même brisé, l'ensemble reste solidaire et en place. C'est ce qui permet de répondre aux normes de sécurité comme la NF P01-012 sur la protection contre les chutes.",
      ],
    },
    benefits: [
      {
        title: "Jusqu'à 5× plus résistant",
        description:
          "La trempe multiplie la résistance du verre aux chocs, à la flexion et aux écarts de température.",
      },
      {
        title: "Sécurité en cas de casse",
        description:
          "Le verre sécurit se brise en petits morceaux non tranchants ; le feuilleté, lui, reste en place même fissuré.",
      },
      {
        title: "Transparence sans obstacle",
        description:
          "Garde-corps et cloisons en verre protègent et délimitent sans couper la vue ni la lumière.",
      },
      {
        title: "Conforme aux normes",
        description:
          "Épaisseurs, feuilletage et fixations dimensionnés pour répondre aux exigences de sécurité (ex. NF P01-012).",
      },
    ],
    process: [
      {
        title: "Étude & mesure",
        description:
          "On relève les dimensions, la configuration et l'usage (hauteur de chute, passage) pour dimensionner le verre et les fixations.",
      },
      {
        title: "Découpe & perçage",
        description:
          "Le verre est découpé aux cotes et percé si besoin. Important : tout façonnage se fait AVANT la trempe.",
      },
      {
        title: "Façonnage des bords",
        description:
          "Les chants sont polis (joint plat, arrondi) car après la trempe le verre ne peut plus être ni coupé ni percé.",
      },
      {
        title: "Trempe thermique",
        description:
          "Le verre est chauffé à ~700 °C puis refroidi brusquement : il devient « sécurit », bien plus résistant.",
      },
      {
        title: "Feuilletage (si requis)",
        description:
          "Pour garde-corps et sols, deux verres trempés sont assemblés par un film (EVA/PVB) : ils restent solidaires même brisés.",
      },
      {
        title: "Pose & fixation",
        description:
          "Mise en œuvre sur profilés aluminium, pinces ou fixations inox, avec réglages d'aplomb et contrôle final.",
      },
    ],
    applications: [
      {
        title: "Garde-corps",
        description:
          "Escaliers, terrasses, mezzanines et balcons : protéger contre les chutes sans masquer la vue.",
      },
      {
        title: "Escaliers en verre",
        description:
          "Marches et limons en verre trempé sécurit pour un escalier aérien, lumineux et spectaculaire.",
      },
      {
        title: "Passerelles & sols",
        description:
          "Planchers et passerelles en verre feuilleté, dimensionnés pour supporter le passage en toute sécurité.",
      },
      {
        title: "Façades & vitrines",
        description:
          "Façades et vitrines de commerces en verre sécurit, toute hauteur, pour un maximum de lumière.",
      },
      {
        title: "Cloisons de bureau",
        description:
          "Séparations vitrées qui structurent les espaces de travail tout en préservant clarté et acoustique.",
      },
    ],
    techniques: [
      {
        term: "Trempe thermique",
        definition:
          "Chauffe à ~700 °C puis refroidissement rapide qui met le verre sous tension : il devient jusqu'à 5× plus résistant.",
      },
      {
        term: "Verre sécurit",
        definition:
          "Autre nom du verre trempé : en cas de casse, il éclate en petits fragments non coupants au lieu de longs éclats.",
      },
      {
        term: "Verre feuilleté",
        definition:
          "Deux verres collés par un film plastique (EVA/PVB). Même brisé, il tient d'un bloc — obligatoire pour les garde-corps.",
      },
      {
        term: "NF P01-012",
        definition:
          "Norme française des garde-corps : elle fixe la hauteur (1 m mini) et la résistance à la poussée pour prévenir les chutes.",
      },
      {
        term: "Fixations inox",
        definition:
          "Pinces, platines et profilés en acier inoxydable qui maintiennent le verre : durables et adaptés à l'extérieur.",
      },
    ],
    faq: [
      {
        question: "Un garde-corps tout en verre est-il vraiment sûr ?",
        answer:
          "Oui, à condition d'utiliser le bon verre. Pour un garde-corps, on emploie du verre feuilleté (deux verres trempés collés) : même en cas de fissure, il reste en place et continue de retenir. Les épaisseurs et fixations sont calculées selon la hauteur et l'usage.",
      },
      {
        question: "Quelle différence entre verre trempé et verre feuilleté ?",
        answer:
          "Le verre trempé est renforcé par la chaleur et se brise en petits morceaux non coupants. Le feuilleté superpose deux verres avec un film plastique qui les maintient solidaires même brisés. Pour les garde-corps et les sols, on utilise du feuilleté (souvent trempé et feuilleté à la fois).",
      },
      {
        question: "Peut-on percer ou découper le verre après coup ?",
        answer:
          "Non. Toute la découpe, le perçage et le façonnage des bords doivent être réalisés AVANT la trempe. Après trempe, le verre ne peut plus être modifié sous peine de casser. C'est pourquoi une prise de mesure précise est essentielle.",
      },
      {
        question: "Le verre structurel convient-il à l'extérieur ?",
        answer:
          "Oui. Le verre trempé résiste aux écarts de température et, associé à des fixations en inox, il équipe terrasses, balcons et façades. Le feuilleté ajoute une sécurité supplémentaire en extérieur et en hauteur.",
      },
    ],
    metaTitle: "Verre trempé structurel — garde-corps, escaliers & façades",
    metaDescription:
      "Garde-corps, escaliers, passerelles et façades en verre trempé et feuilleté sécurit, aux normes (NF P01-012). Étude, façonnage et pose sur fixations inox et aluminium.",
  },

  /* ————————————————————————————————————————————————————————————————
     4. MENUISERIE VERRE
  ———————————————————————————————————————————————————————————————— */
  menuiserie: {
    slug: "menuiserie",
    index: "Expertise 04",
    heroSubtitle:
      "Portes et cabines de douche en verre trempé, conçues et posées sur-mesure — de la prise de mesure à l'installation.",
    heroImage: "/images/expertises/menuiserie.jpg",
    heroImageAlt:
      "Cabine de douche à l'italienne en verre trempé sur-mesure",
    intro: {
      heading: "La menuiserie verre, qu'est-ce que c'est ?",
      paragraphs: [
        "La menuiserie verre, c'est fabriquer avec du verre ce qu'on ferait habituellement en bois ou en aluminium : des portes, des cloisons, et surtout des cabines et parois de douche. Le verre y apporte transparence, sensation d'espace et facilité d'entretien.",
        "Le matériau de référence est le verre trempé sécurit de 8 mm : assez épais pour être rigide et stable, et surtout sécurisé — en cas de choc, il se désagrège en milliers de petits morceaux lisses qui ne coupent pas. C'est la norme pour toute paroi de douche.",
        "Tout est affaire de configuration et de sur-mesure : douche à l'italienne à paroi fixe, porte coulissante pour gagner de la place, porte battante ou pivotante, retour d'angle, soupente… Chaque cabine est dessinée pour votre salle de bain, fabriquée puis posée avec la quincaillerie adaptée.",
      ],
    },
    benefits: [
      {
        title: "Sur-mesure intégral",
        description:
          "Chaque paroi est fabriquée aux dimensions exactes de votre pièce, y compris pour les angles et sous-pentes difficiles.",
      },
      {
        title: "Sécurité sécurit 8 mm",
        description:
          "Le verre trempé se brise, s'il cède, en petits morceaux non coupants — la référence pour une salle de bain.",
      },
      {
        title: "Sensation d'espace",
        description:
          "La transparence du verre agrandit la salle de bain et laisse circuler la lumière, contrairement aux parois opaques.",
      },
      {
        title: "Entretien facile",
        description:
          "Surface lisse, option traitement anticalcaire : le verre se nettoie d'un geste et conserve son éclat.",
      },
    ],
    process: [
      {
        title: "Prise de mesure",
        description:
          "Relevé précis de la salle de bain : dimensions, aplombs, receveur et contraintes (soupente, angle, arrivée d'eau).",
      },
      {
        title: "Conception",
        description:
          "On choisit ensemble la configuration (fixe, coulissante, battante), le verre (clair, dépoli, teinté) et la quincaillerie.",
      },
      {
        title: "Découpe & façonnage",
        description:
          "Le verre est découpé, percé et ses bords polis avant la trempe — car après, plus aucune modification n'est possible.",
      },
      {
        title: "Trempe sécurit",
        description:
          "Passage à la trempe pour obtenir un verre sécurit 8 mm, résistant et sûr en cas de choc.",
      },
      {
        title: "Pose & réglage",
        description:
          "Installation de la paroi, réglage des charnières ou du rail coulissant et pose des joints d'étanchéité.",
      },
    ],
    applications: [
      {
        title: "Douche à l'italienne",
        description:
          "Paroi fixe épurée, de plain-pied : le grand classique contemporain, ouvert et facile d'accès.",
      },
      {
        title: "Portes coulissantes",
        description:
          "La porte glisse le long de la paroi — idéale pour les petites salles de bain où l'on gagne chaque centimètre.",
      },
      {
        title: "Portes battantes & pivotantes",
        description:
          "Ouverture classique sur charnières pour un accès large et une étanchéité soignée.",
      },
      {
        title: "Cabines & retours d'angle",
        description:
          "Cabines complètes, niches et retours d'angle en verre pour épouser toutes les configurations.",
      },
      {
        title: "Portes & cloisons sécurit",
        description:
          "Portes sécurit fixes ou coulissantes et cloisons vitrées, au-delà de la seule salle de bain.",
      },
    ],
    techniques: [
      {
        term: "Verre sécurit 8 mm",
        definition:
          "Verre trempé de 8 mm, standard des parois de douche : rigide, stable et non coupant en cas de casse.",
      },
      {
        term: "Douche à l'italienne",
        definition:
          "Douche de plain-pied sans bac surélevé, souvent fermée d'une simple paroi fixe en verre — accès facile et esthétique épurée.",
      },
      {
        term: "Verre dépoli",
        definition:
          "Verre rendu translucide (par sablage ou acidage) : il laisse passer la lumière tout en préservant l'intimité.",
      },
      {
        term: "Traitement anticalcaire",
        definition:
          "Couche invisible appliquée sur le verre qui limite l'accroche du calcaire et facilite grandement le nettoyage.",
      },
      {
        term: "Quincaillerie",
        definition:
          "Charnières, rails, pinces et poignées (souvent en inox) qui assurent l'ouverture, la fixation et l'étanchéité de la paroi.",
      },
    ],
    faq: [
      {
        question: "Quelle épaisseur de verre pour une paroi de douche ?",
        answer:
          "Le standard est le verre trempé sécurit de 8 mm. Il offre le bon compromis entre rigidité, stabilité et sécurité. Pour de très grandes parois, une épaisseur supérieure ou un renfort peut être conseillé.",
      },
      {
        question: "Coulissante ou battante : que choisir ?",
        answer:
          "La porte coulissante est parfaite quand l'espace est compté, car elle n'empiète pas sur la pièce. La porte battante ou pivotante offre un accès plus large et une étanchéité un peu plus simple — le choix dépend de la place disponible.",
      },
      {
        question: "Peut-on s'adapter à une salle de bain avec sous-pente ou angle ?",
        answer:
          "Oui, c'est tout l'intérêt du sur-mesure. Après prise de mesure, la paroi est découpée pour épouser une soupente, un angle ou une niche. Les configurations atypiques sont notre quotidien.",
      },
      {
        question: "Comment entretenir une paroi en verre ?",
        answer:
          "Un raclette après la douche et un nettoyage doux suffisent. L'option traitement anticalcaire réduit fortement les traces et l'accroche du calcaire, pour un verre qui reste net plus longtemps.",
      },
    ],
    metaTitle: "Menuiserie verre — cabines & parois de douche sur-mesure",
    metaDescription:
      "Cabines et parois de douche en verre trempé sécurit 8 mm sur-mesure : douche à l'italienne, portes coulissantes, battantes et pivotantes. Prise de mesure et pose par l'atelier.",
  },
};

/** Toutes les fiches, dans l'ordre des expertises (01 → 04) */
export const serviceDetailsList: ServiceDetail[] = Object.values(details);

/** Récupère la fiche détaillée d'un service par son identifiant/slug */
export function getServiceDetail(
  slug: string,
): ServiceDetail | undefined {
  return details[slug as ServiceCategoryId];
}

/** Slugs valides — pour generateStaticParams */
export const serviceSlugs = Object.keys(details) as ServiceCategoryId[];
