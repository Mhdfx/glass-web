# HANDOFF — Chaimae Glass

> Complete handoff document for any engineer or AI model taking over this project.
> Read this file first; it explains what the site is, how it's built, where every
> piece of data lives, what remains to be done, and how to deploy it.

Last updated: 2026-07-07 · Status: **built & verified locally, NOT deployed yet** (domain not purchased yet).

> **Design note (2026-07-07):** master now carries the light **« lumière froide »
> v2 design** (porcelain/smoke palette, Cormorant Garamond display, full-bleed
> photo hero, brass as sole accent) — chosen by the client over the dark
> version. The dark designs remain on the `redesign` (polished) branch and in
> pre-merge history. Palette/typography references below that mention the dark
> theme describe the retired v1.

---

## 1. What this project is

A **one-page marketing website** (plus a legal notice page) for **Chaimae Glass**,
an artisan glass workshop (miroiterie / vitraux / verre trempé) located in
**Aïn Sebaâ, Casablanca, Morocco**. All site content is in **French**.

Business goal: generate quote requests. The **primary conversion channel is
WhatsApp** — every CTA (hero buttons, floating button, quote form) opens a
pre-filled WhatsApp message. Email notification of quotes is a *secondary,
optional* channel (Resend), and the site works fully without it.

Original brief: `needed.md` · Implementation plan: `PLAN.md` (both in repo root,
in French — useful for background but this file supersedes them for current state).

## 2. Tech stack

| Layer | Tech | Notes |
|---|---|---|
| Framework | **Next.js 16** (App Router, Turbopack) | React 19, TypeScript 6 (strict) |
| Styling | **Tailwind CSS v4** | Tokens defined in CSS via `@theme` in `app/globals.css` — there is **no `tailwind.config`** file |
| Animations | **Framer Motion 12** | Scroll reveals, gallery lightbox, form states |
| 3D | ~~react-three-fiber + drei + three~~ | **UNUSED.** `components/three/GlassScene.tsx` is not imported anywhere; the `three`/`@react-three/*` deps are dead weight (~30 MB in node_modules). Safe to delete deps + file. |
| Smooth scroll | **Lenis** | `components/SmoothScroll.tsx`, mounted in root layout |
| Email | **Resend** | Only in `/api/quote`; optional (see §7) |
| Images | **sharp** | Used by the two scripts in `scripts/` only |
| Fonts | Fraunces (display/serif) + Manrope (sans) | via `next/font/google`, exposed as `--font-display` / `--font-sans` |

Run locally:

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build — passes clean as of 2026-07-05
npm start        # serve the production build
```

## 3. THE most important rule: single source of truth

**`data/company.ts`** holds ALL business facts: name, phone, WhatsApp number,
email, address/neighborhood/city, opening hours, projects count, founding year,
Google Maps embed URL, site URL, social links.

**Never hardcode** a phone number, address, or company name in a component.
Header, Footer, Hero, Contact, QuoteForm, JSON-LD (`app/layout.tsx`),
the maintenance page and the quote email all read from this file.
To change any business fact → edit `data/company.ts` only.

The other two data files follow the same pattern:

- **`data/services.ts`** — the 4 service categories (miroiterie, vitraux,
  structurel, menuiserie) with catalogue items, plus the 3 "why us" pillars and
  the quote-form project-type options (derived from categories automatically).
- **`data/gallery.ts`** — the 16 gallery items (src, alt, caption, category,
  `span`). **`span` controls the mosaic tile shape and was deliberately chosen
  to match each photo's NATIVE aspect ratio** so photos display whole, without
  zoomed crops (a past client complaint — do not regress this). The tile
  order + spans close an exact 3-column mosaic — 63 cells = 21 flush rows
  (row math documented at the top of the file and in `Gallery.tsx`).
  Category filters are derived from the items: a category with no photo
  (currently `vitraux`) is hidden automatically and reappears when an item
  with that category is added.

## 4. Project structure

```
app/
  layout.tsx              Root layout: fonts, full SEO metadata, LocalBusiness JSON-LD, Lenis
  page.tsx                The one-pager: Header → Hero → WhyUs → Expertises → Gallery
                          → Stats → QuoteForm → Contact → Footer → WhatsAppFloat
  globals.css             Tailwind v4 @theme tokens (palette, fonts, shadows) + hero CSS
                          animation + Lenis/scroll fixes. THE design-token file.
  expertises/[slug]/      4 detailed service pages (SSG). One dynamic route
                          renders miroiterie/vitraux/structurel/menuiserie from
                          data/service-details.ts. Reached by clicking any card
                          in the homepage Expertises bento. (see §4.1)
  mentions-legales/       Legal notice page (reads company.ts)
  robots.ts / sitemap.ts  Generated from company.siteUrl (sitemap includes the 4 expertise pages)
  icon.svg                Favicon
  api/health/route.ts     Returns ok — used by Docker healthcheck & deploy.sh
  api/quote/route.ts      POST endpoint of the quote form (see §7)

components/
  layout/    Header (fixed, scroll-aware; hash links become /#… on sub-pages), Footer, WhatsAppFloat
  sections/  One file per homepage section (Hero, WhyUs, Expertises, Gallery,
             Stats, QuoteForm, Contact)
  three/     GlassScene.tsx — UNUSED R3F prism, not imported anywhere (dead code; three/* deps unused)
  ui/        Button, icons (inline SVG set), Reveal (hydration-safe scroll reveal),
             Carousel (scroll-snap, arrows+dots, a11y), Accordion (FAQ)
  SmoothScroll.tsx  Lenis wrapper

data/        company.ts · services.ts · gallery.ts · service-details.ts   ← edit content HERE
lib/         whatsapp.ts — builds wa.me links (generic + pre-filled quote message)
scripts/     process-client-photos.mjs  — pipeline used on raw client photos
             (trim, mirror-flop, top-extract, attention crop → public/images/gallery)
             generate-placeholders.mjs  — generated the 3 abstract placeholder images
photos-client/  RAW client photos (source material — not served)
public/images/  hero/, og.jpg, expertises/ (4), gallery/ (16 processed JPGs)

Dockerfile · docker-compose.yml · deploy.sh · nginx/   ← deployment (see §8)
.env.example                                            ← env template (see §7)
```

## 4.1. Expertise detail pages (added 2026-07-07)

Each of the 4 homepage Expertises cards is now **fully clickable** and links to a
dedicated, in-depth page at **`/expertises/<slug>`** (slug = the `ServiceCategoryId`:
`miroiterie`, `vitraux`, `structurel`, `menuiserie`). Goal: a visitor who knows
nothing about glasswork can understand each service.

- **Content lives in `data/service-details.ts`** (single source of truth, same
  pattern as the other data files). Per service: educational intro ("what is it"),
  benefits, **process steps**, **applications**, a **techniques glossary**, and a
  **FAQ**, plus per-page SEO (`metaTitle`/`metaDescription`). Content is
  research-backed (glass-trade sources cited in the file header). To edit copy →
  edit this file only.
- **Page template: `app/expertises/[slug]/page.tsx`** — one dynamic route,
  `generateStaticParams` pre-renders all 4 as static HTML (SSG), `generateMetadata`
  sets per-page SEO + OpenGraph + canonical, and emits `Service` JSON-LD. Sections:
  hero (brand veil, breadcrumb) → intro → benefits → process carousel → applications
  carousel → **realisations photo carousel** (reuses `data/gallery.ts`, filtered by
  category) → glossary → FAQ accordion → CTA → cross-links to the other 3 pages.
- **Reusable UI added:** `components/ui/Carousel.tsx` (scroll-snap track, prev/next
  arrows that disable at the ends, synced dot indicators, keyboard ← →, respects
  reduced-motion) and `components/ui/Accordion.tsx` (single-open FAQ, grid-rows
  collapse animation, full aria wiring).
- **Header is now route-aware:** on sub-pages the nav hash links render as `/#…`
  (via `usePathname`) so "Galerie", "Devis", etc. jump back to the homepage
  sections; active-section highlight is gated to the homepage only.
- Cards: `components/sections/Expertises.tsx` is now a plain server component (the
  old `goToGallery` custom-event filter was removed; the Gallery still listens for
  `gallery:filter` harmlessly). Whole card = one `<Link>`, surface style + hover lift
  moved onto the link element.
- **Verified 2026-07-07:** clean production build (4 SSG pages), browser-tested —
  navigation, all 3 carousels (arrows+dots+scroll), FAQ single-open, cross-links,
  breadcrumb, mobile hero, per-page titles, invalid slug → 404, sitemap lists all 4.

## 5. Design system (quick reference)

Palette (defined in `app/globals.css` `@theme`, used as Tailwind classes):

- `ink-950/900/800/700` — near-black warm backgrounds (site is dark-themed)
- `ivory-50/100/200` — warm off-white text
- `brass-300…700` — gold/brass accent (CTAs, highlights) — `brass-500 #c9a66b` is the primary accent
- `stone-300/400/500` — muted secondary text
- `font-display` = Fraunces (headings) · `font-sans` = Manrope (body)

Motion conventions:
- Section entrances use `components/ui/Reveal.tsx` (hydration-safe — renders
  visible on server, animates only after mount).
- **The hero entrance is pure CSS** (`.hero-in` keyframes in globals.css) so it
  plays before JS hydrates on slow connections. Don't convert it to Framer Motion.
- Everything respects `prefers-reduced-motion` (animations off, 3D scene off).
- Fixed header is 72px → all `section[id]` have `scroll-margin-top: 5.5rem`.

## 6. Behaviors worth knowing before you modify anything

- **Quote form (`components/sections/QuoteForm.tsx`)**: on submit it (1) opens
  WhatsApp with the pre-filled message from `lib/whatsapp.ts`, and (2) fires a
  best-effort POST to `/api/quote` for the email copy. Validation errors clear
  when the section scrolls out of view. Field labels/options come from
  `data/services.ts` and `data/company.ts`.
- **Stats counter (`Stats.tsx`)**: renders the final number server-side and only
  animates count-up after mount — fixed a "flashes 0" bug; keep it that way.
  `projectsCount` may be `null` in company.ts → the stat hides itself.
- **Gallery**: 16 tiles, lightbox with keyboard nav. The first two tiles
  (restaurant arch, hotel lobby) lead the gallery **per explicit client request**.
  The lobby photo was recovered from a mirrored video capture and horizontally
  flopped — that's intentional.
- **Expertise cards are typographic (no images)** on the section itself — also an
  explicit client decision; the `image` fields in services.ts are kept for
  potential future use.
- Known harmless warning: `THREE.Clock` deprecation logged by R3F internals —
  upstream, ignore it.

## 7. Environment variables & the quote email

No `.env` exists locally and **none is required to run or build**. Template: `.env.example`.

| Var | Purpose |
|---|---|
| `RESEND_API_KEY` | Resend key. **Missing → `/api/quote` responds `{ok:true, email:"skipped"}`** and the site behaves normally (WhatsApp remains the channel). |
| `QUOTE_EMAIL_TO` | Recipient of quote notifications (currently outboutmehdi@gmail.com in the template). |
| `QUOTE_EMAIL_FROM` | Verified Resend sender; falls back to `onboarding@resend.dev`. |
| `DOCKER_BUILD` | Set only inside the Docker image build → switches `next.config.ts` to `output: "standalone"`. **Never set it locally** or `next start` breaks. |

The API route never blocks the user on email failure (returns `ok:true` with
`email:"failed"`). Inputs are length-capped and HTML-escaped.

## 8. Deployment (prepared, NOT executed)

Target: a **Contabo VPS**, Docker + host Nginx. **The client explicitly asked not
to deploy yet** — they want to test first. When green-lit:

1. Put the repo on the VPS (note: `deploy.sh` runs `git pull` — the project must
   be a git repo with a remote by then; **it currently is not under git at all**).
2. Copy `.env.example` → `.env`, fill values.
3. `nginx/site.conf` → `/etc/nginx/sites-available/`, replace `VOTRE-DOMAINE.ma`
   with the real domain, symlink to sites-enabled, run `certbot --nginx`.
4. Copy `nginx/maintenance/index.html` → `/var/www/maintenance/` (Nginx serves it
   on 502/503/504 instead of a bare error).
5. Run `./deploy.sh` — it builds the image, swaps containers, polls
   `/api/health` (60s max), and **auto-rolls-back** to the previous image on failure.

The app container binds to `127.0.0.1:3000` only; Nginx is the public entry,
handles TLS, gzip, long-cache for `/_next/static/`.

`.dockerignore` (added 2026-07-07) keeps node_modules, AI-tooling folders,
raw photos, scripts and internal docs out of the build context — the final
image contains only the standalone server, static chunks and `public/`.
Secrets never enter the image: compose passes `.env` at runtime (`env_file`).

## 9. ✅ REMAINING WORK (the actual to-do list)

Nothing is broken. Everything below is either client input or the deferred deployment.

**Blocked on client information:**
1. **Vitraux photos (optional)** — the 3 abstract placeholders (porte-vitrail,
   coupole-vitrail, douche-italienne) were REMOVED 2026-07-06 at the client's
   request; the gallery is now 16 tiles, all real photos, and the empty
   `vitraux` filter hides itself. If real vitraux photos arrive later: process
   via `scripts/process-client-photos.mjs`, add items to `data/gallery.ts`
   with spans matching native aspect ratios, and re-check the mosaic closes
   flush (21-row math in the file header).
2. **Social links** — `company.social.instagram/facebook` are `null`; fill when available (Footer/Contact render them conditionally).
3. **Buy the domain** — `siteUrl: "https://chaimaeglass.ma"` drives sitemap,
   robots, canonical/OG URLs and JSON-LD. Client confirmed 2026-07-06 the domain
   is NOT purchased yet — must be bought (and DNS pointed) before deploy.
4. **Exact workshop address** — Maps embed currently points at the Aïn Sebaâ
   neighborhood; swap `mapsEmbedUrl` for the exact-address embed if desired.
5. **Legal page** — `app/mentions-legales/page.tsx` lacks RC/ICE registration
   numbers and the hosting-provider (hébergeur) section customary in Morocco;
   add once the client provides them and hosting is final.

**Optional / infrastructure:**
6. **Resend API key** if email copies of quotes are wanted (site works without).
7. **git remote** — repo initialized with first commit 2026-07-06 (`photos-client/`
   is git-ignored as raw source material). Still needs a remote before
   `deploy.sh` (which runs `git pull`) can work.
8. **Deploy** (§8) once the client approves after testing AND the domain exists.

**Done 2026-07-06:** `git init` + initial commit; `foundedYear: 2005` and
`projectsCount: 1000` confirmed by client; stray root PNG deleted.

**Tooling note (2026-07-06):** `graphify` is installed — a code graph lives in
`graphify-out/` (git-ignored) and auto-rebuilds via post-commit/post-checkout
hooks (interpreter pinned in `.git/hooks/` — re-pin if graphify is reinstalled).
See `CLAUDE.md` for how AI assistants should query it (`graphify explain`,
`graphify path`, freshness check against `built_at_commit`).

## 10. "Where do I change X?" cheat sheet

| Change | File |
|---|---|
| Phone / WhatsApp / email / address / hours / counts | `data/company.ts` |
| Service categories & catalogue items | `data/services.ts` |
| Gallery photos, captions, tile shapes | `data/gallery.ts` + `public/images/gallery/` |
| Colors, fonts, shadows (design tokens) | `app/globals.css` (`@theme` block) |
| SEO title/description/OG/JSON-LD | `app/layout.tsx` |
| Section order on the homepage | `app/page.tsx` |
| WhatsApp message wording | `lib/whatsapp.ts` |
| Quote email content/recipient | `app/api/quote/route.ts` + `.env` |
| Hero 3D prism | `components/three/GlassScene.tsx` |
| Domain in server config | `nginx/site.conf` + `data/company.ts` (`siteUrl`) |
