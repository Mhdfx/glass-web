# PLAN DE RÉALISATION — Site vitrine miroiterie & vitraux d'art

> Document de suivi issu de l'analyse de `needed.md`. Décrit comment le projet va être construit, dans quel ordre, avec quelles décisions prises pour pouvoir démarrer malgré les informations manquantes.

---

## 0. Hypothèses de démarrage (à corriger dès que possible)

Le brief contient des placeholders non remplis. Pour ne pas bloquer le développement, les choix suivants sont faits **par défaut**, clairement isolés dans le code pour être remplacés en une seule fois :

| Élément | Décision de démarrage | Où c'est centralisé |
|---|---|---|
| Nom entreprise, année, téléphone, WhatsApp, email, adresse, villes | Placeholders explicites (`[NOM_ENTREPRISE]`, etc.) | `/data/company.ts` (fichier unique, seule source de vérité) |
| Photos de réalisations | Images stock haute qualité (verre/miroir/architecture), libres de droits | `/public/images/gallery/` — à remplacer photo par photo, mêmes noms de fichiers |
| Textes de service | Rédigés à partir du catalogue fourni dans `needed.md` (contenu réel, pas du lorem ipsum) | `/data/services.ts` |
| Nombre de projets réalisés (stat) | Placeholder `[À DÉFINIR]` affiché clairement | `/data/company.ts` |

**Rien de tout ça n'est codé en dur dans les composants** — un seul fichier de données à éditer avant mise en ligne.

---

## 1. Stack technique (confirmée, section 6 du brief)

- **Next.js 14+ (App Router)** + **TypeScript**
- **Tailwind CSS** — design tokens custom (couleurs, typo) dans `tailwind.config.ts`
- **Framer Motion** — animations d'interface uniquement (Phase 3)
- **React Three Fiber + drei** — élément 3D unique (Phase 3, en dernier)
- **next/image** — optimisation photos, lazy loading
- Contenu en fichiers TS structurés (`/data/*.ts`) — pas de CMS
- Formulaire devis → lien `wa.me` pré-rempli + email via **Resend**
- Déploiement **Contabo VPS** : Docker + Docker Compose + Nginx + Certbot (pas Vercel)

---

## 2. Arborescence cible

```
/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                  # assemble toutes les sections (one-page)
│   ├── api/
│   │   ├── quote/route.ts        # traitement formulaire devis (email)
│   │   └── health/route.ts       # endpoint santé (Phase 5)
│   └── globals.css
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── WhatsAppFloatButton.tsx
│   ├── sections/
│   │   ├── Hero.tsx
│   │   ├── WhyUs.tsx
│   │   ├── Expertises.tsx
│   │   ├── Gallery.tsx
│   │   ├── Stats.tsx
│   │   ├── QuoteForm.tsx
│   │   └── Contact.tsx
│   ├── ui/                       # boutons, cartes, badges réutilisables
│   └── three/
│       └── GlassScene.tsx        # scène 3D (Phase 3)
├── data/
│   ├── company.ts                # infos entreprise, coordonnées (placeholders)
│   ├── services.ts                # 4 catégories + items catalogue
│   └── gallery.ts                 # items galerie (image, catégorie, légende)
├── public/
│   └── images/
│       ├── hero/
│       └── gallery/
├── lib/
│   └── whatsapp.ts                # génération lien wa.me pré-rempli
├── Dockerfile
├── docker-compose.yml
├── deploy.sh
├── nginx/
│   ├── site.conf
│   └── maintenance/index.html
└── PLAN.md
```

---

## 3. Phases de réalisation (ordre strict, non mélangé)

### Phase 1 — Structure & contenu
- Squelette Next.js, toutes les sections de la page 1 par 1 (Header, Hero, Pourquoi nous, Expertises, Galerie, Stats, Formulaire, Contact, Footer)
- Contenu texte réel (catalogue, pas de lorem ipsum) avec placeholders isolés dans `/data/company.ts`
- Aucune animation, aucun style fin — HTML/structure sémantique + Tailwind minimal
- **Livrable** : page navigable de haut en bas, tout le contenu présent, zéro 3D/animation
- **Checkpoint** : validation du contenu et de la structure avant de passer au design

### Phase 2 — Design
- Application de la direction artistique (section 4 du brief) : palette anthracite/blanc cassé + accent laiton `#C9A66B`, typo Playfair Display/Fraunces (titres) + Inter/Manrope (texte)
- Mise en page fine, espacements, hiérarchie visuelle, responsive complet
- Galerie visuelle (grille photos, tabs de filtre — sans interactivité avancée encore)
- **Checkpoint** : comparaison explicite avec luxuryhabitat.ma — justification écrite de en quoi c'est supérieur avant de continuer

### Phase 3 — Animations & 3D (jamais mélangé avec la structure)
- Framer Motion : scroll-reveal en cascade, micro-interactions hover (cartes, boutons), transitions de filtre galerie
- Parallaxe léger hero
- Élément 3D unique (React Three Fiber) : objet verre/miroir stylisé réagissant à la souris dans le hero (piste retenue par défaut, à valider) + fallback image statique mobile/perf faible
- Respect de `prefers-reduced-motion`
- **Checkpoint** : re-comparaison avec luxuryhabitat.ma sur les 3 axes (fluidité, animations, 3D)

### Phase 4 — Fonctionnalités & polish
- Galerie filtrable par catégorie + lightbox (zoom, navigation flèches)
- Formulaire de devis fonctionnel : génère message WhatsApp pré-rempli + envoi email (Resend)
- SEO : meta par section, structured data `LocalBusiness`, sitemap.xml
- Responsive mobile-first vérifié sur tous les breakpoints
- Audit Lighthouse (cible mobile 85+) — optimisation images/3D si besoin

### Phase 5 — Déploiement Contabo VPS
- `next.config` en mode `standalone`
- Dockerfile + docker-compose.yml (`restart: unless-stopped`, healthcheck sur `/api/health`)
- Nginx reverse proxy : pages d'erreur brandées (502/503/504 → page de maintenance statique), timeouts, `upstream` avec `max_fails`/`fail_timeout`
- SSL via Certbot (Let's Encrypt)
- `deploy.sh` : build nouvelle image → bascule → vérif `/api/health` → rollback auto si échec (tag `:previous`)
- Monitoring : UptimeRobot ou Uptime Kuma sur `/api/health`
- Test final en production sur le domaine réel

---

## 4. Système de design (référence pour Phase 2)

- **Couleurs** : fond `#0B0B0C` (anthracite) ou `#F7F3EC` (blanc cassé chaud) selon section, accent `#C9A66B` (laiton), neutres gris chauds
- **Typo** : Fraunces/Playfair Display pour titres, Inter/Manrope pour texte courant
- **Effets** : reflets/transparence subtils sur cartes et boutons (clin d'œil verre/miroir), grands espaces négatifs, photos toujours au premier plan
- **Animations** : 200–500ms max, jamais de ralentissement perçu

---

## 5. Contenu des sections (résumé exécutable)

1. **Header sticky** — logo, nav ancrée (Accueil/Expertises/Galerie/Devis/Contact), tél cliquable, CTA devis, bouton WhatsApp flottant permanent
2. **Hero** — photo plein écran réalisation phare, titre + sous-titre, CTA double (devis / WhatsApp)
3. **Pourquoi nous** — 3 piliers : savoir-faire artisanal, sécurité certifiée, sur-mesure clé en main
4. **Nos expertises** — grille 4 catégories (image + titre + description + lien galerie filtrée)
5. **Galerie** — filtrable par catégorie, hover + lightbox
6. **Chiffres clés** — bande stat contrastée (années d'expérience, projets réalisés, épaisseurs 3–15mm, zones d'intervention)
7. **Formulaire devis** — nom, téléphone/WhatsApp, ville, type de projet (dropdown), description → génère `wa.me` + email
8. **Contact** — WhatsApp/tél/email/adresse/horaires + Google Maps embed
9. **Footer** — nav, coordonnées, réseaux sociaux, mentions légales

---

## 6. Critère de validation à chaque étape

Avant de clore une phase, appliquer le test du brief :
> *"Est-ce que ce rendu donne davantage envie de faire confiance à cette entreprise que luxuryhabitat.ma ne le fait pour la sienne ?"*

Si la réponse n'est pas clairement oui avec une justification concrète, itérer avant de passer à la phase suivante.

---

## 7. Informations encore nécessaires du client

À fournir dès que possible pour remplacer les placeholders dans `/data/company.ts` :
- Nom réel de l'entreprise
- Année de création
- Téléphone / WhatsApp
- Email
- Adresse de l'atelier (Casablanca)
- Zones d'intervention (Casablanca uniquement / Grand Casablanca / national)
- Photos haute résolution des réalisations (idéalement non scannées)
- Nombre de projets réalisés (pour la stat)

---

## 8. Prochaine étape immédiate

Démarrer **Phase 1** : scaffold Next.js + TypeScript + Tailwind, création de `/data/company.ts`, `/data/services.ts`, `/data/gallery.ts`, et squelette de toutes les sections avec contenu réel/placeholders.
