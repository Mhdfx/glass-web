# Chaimae Glass — Site vitrine

Site one-page premium pour un atelier de miroiterie, vitraux d'art et verre
sur-mesure à Casablanca. Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 ·
Framer Motion · React Three Fiber · Lenis.

---

## 🧪 Tester en local

```bash
npm install          # une seule fois
npm run dev          # http://localhost:3000  (développement, rechargement à chaud)
# ou
npm run build && npm run start   # version production exacte
```

Points à tester :
- **Scroll** fluide (Lenis) + apparitions en cascade des sections
- **Hero** : parallaxe au scroll + **prisme 3D** qui suit la souris (desktop uniquement)
- **Nos expertises** : « Voir les réalisations » filtre automatiquement la galerie
- **Galerie** : filtres animés, lightbox (clic, flèches ◀ ▶, Échap)
- **Formulaire devis** : validation champ par champ, puis ouverture de WhatsApp
  avec le message pré-rempli ; l'email est envoyé seulement si Resend est configuré
- **Mobile** : menu burger, boutons ≥ 44px, pas de 3D (fallback image), WhatsApp flottant
- **Accessibilité** : navigation clavier complète, `prefers-reduced-motion` respecté

## ✏️ Avant la mise en ligne — à remplacer

| Quoi | Où |
|---|---|
| Nom, année, téléphone, WhatsApp, email, adresse, zones | `data/company.ts` (unique fichier à éditer) |
| Nombre de projets réalisés (stat) | `data/company.ts` → `projectsCount` |
| URL Google Maps de l'atelier | `data/company.ts` → `mapsEmbedUrl` |
| Domaine réel | `data/company.ts` → `siteUrl` + `nginx/site.conf` |
| **Photos réelles** | `public/images/gallery/`, `public/images/expertises/`, `public/images/hero/` — mêmes noms de fichiers, puis ajuster `alt`/`caption` dans `data/gallery.ts` |
| Numéro WhatsApp de la page maintenance | `nginx/maintenance/index.html` |
| Clé Resend + email destinataire | `.env` (voir `.env.example`) |

Les images actuelles sont des **compositions abstraites générées**
(`npm run images` les régénère). Le site est conçu pour les vraies photos.

## 📦 Structure

```
app/            layout, page, API (quote, health), sitemap, robots
components/
  layout/       Header, Footer, WhatsAppFloat
  sections/     Hero, WhyUs, Expertises, Gallery, Stats, QuoteForm, Contact
  three/        GlassScene (prisme 3D du hero)
  ui/           Reveal (scroll), Button, icônes SVG
data/           company.ts · services.ts · gallery.ts  ← tout le contenu
lib/            whatsapp.ts (liens wa.me pré-remplis)
scripts/        generate-placeholders.mjs
nginx/ + Dockerfile + docker-compose.yml + deploy.sh   ← déploiement (plus tard)
```

## 🚀 Déploiement Contabo VPS (quand le site est validé)

1. Sur le VPS : installer Docker + compose, `systemctl enable docker`
2. Cloner le repo, `cp .env.example .env` et remplir
3. `nginx/site.conf` → `/etc/nginx/sites-available/` (remplacer le domaine),
   copier `nginx/maintenance/` vers `/var/www/maintenance/`
4. DNS A record → IP du VPS, puis `certbot --nginx -d domaine.ma -d www.domaine.ma`
5. `chmod +x deploy.sh && ./deploy.sh` — build → bascule → healthcheck → rollback auto si échec
6. Monitoring : UptimeRobot ou Uptime Kuma sur `https://domaine.ma/api/health` (5 min)

Pendant un déploiement ou une panne, Nginx sert la page de maintenance brandée
(jamais de 502 nue).
