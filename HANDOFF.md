# HANDOFF — Chaimae Glass

> Complete handoff document for any engineer or AI model taking over this project.
> Read this file first; it explains what the site is, how it's built, where every
> piece of data lives, what remains to be done, and how to deploy it.

Last updated: 2026-07-05 · Status: **built & verified locally, NOT deployed yet** (client wants to test first).

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
| 3D | **react-three-fiber + drei + three** | Decorative glass prism in the hero (`components/three/GlassScene.tsx`), lazy-loaded, disabled on reduced-motion |
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
- **`data/gallery.ts`** — the 19 gallery items (src, alt, caption, category,
  `span`). **`span` controls the mosaic tile shape and was deliberately chosen
  to match each photo's NATIVE aspect ratio** so photos display whole, without
  zoomed crops (a past client complaint — do not regress this). The tile
  order + spans close an exact 3-column mosaic (row math documented at the top
  of the file and in `Gallery.tsx`).

## 4. Project structure

```
app/
  layout.tsx              Root layout: fonts, full SEO metadata, LocalBusiness JSON-LD, Lenis
  page.tsx                The one-pager: Header → Hero → WhyUs → Expertises → Gallery
                          → Stats → QuoteForm → Contact → Footer → WhatsAppFloat
  globals.css             Tailwind v4 @theme tokens (palette, fonts, shadows) + hero CSS
                          animation + Lenis/scroll fixes. THE design-token file.
  mentions-legales/       Legal notice page (reads company.ts)
  robots.ts / sitemap.ts  Generated from company.siteUrl
  icon.svg                Favicon
  api/health/route.ts     Returns ok — used by Docker healthcheck & deploy.sh
  api/quote/route.ts      POST endpoint of the quote form (see §7)

components/
  layout/    Header (fixed, scroll-aware), Footer, WhatsAppFloat (floating CTA)
  sections/  One file per homepage section (Hero, WhyUs, Expertises, Gallery,
             Stats, QuoteForm, Contact)
  three/     GlassScene.tsx — R3F glass prism (hero decoration)
  ui/        Button, icons (inline SVG set), Reveal (hydration-safe scroll reveal)
  SmoothScroll.tsx  Lenis wrapper

data/        company.ts · services.ts · gallery.ts   ← edit content HERE
lib/         whatsapp.ts — builds wa.me links (generic + pre-filled quote message)
scripts/     process-client-photos.mjs  — pipeline used on raw client photos
             (trim, mirror-flop, top-extract, attention crop → public/images/gallery)
             generate-placeholders.mjs  — generated the 3 abstract placeholder images
photos-client/  RAW client photos (source material — not served)
public/images/  hero/, og.jpg, expertises/ (4), gallery/ (19 processed JPGs)

Dockerfile · docker-compose.yml · deploy.sh · nginx/   ← deployment (see §8)
.env.example                                            ← env template (see §7)
```

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
- **Gallery**: 19 tiles, lightbox with keyboard nav. The first two tiles
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

## 9. ✅ REMAINING WORK (the actual to-do list)

Nothing is broken. Everything below is either client input or the deferred deployment.

**Blocked on client information:**
1. **3 placeholder gallery photos** — `porte-vitrail.jpg`, `coupole-vitrail.jpg`,
   `douche-italienne.jpg` are AI/abstract stand-ins (marked `[PLACEHOLDER]` in
   `data/gallery.ts`). Replace the files in `public/images/gallery/` (keep the
   same filenames, or update src + pick the right `span` for the new aspect ratio).
2. **Confirm `foundedYear: 2005`** and **`projectsCount: 1000`** in `data/company.ts`.
3. **Social links** — `company.social.instagram/facebook` are `null`; fill when available (Footer/Contact render them conditionally).
4. **Confirm the domain** — `siteUrl: "https://chaimaeglass.ma"` drives sitemap,
   robots, canonical/OG URLs and JSON-LD. Verify it's purchased and correct.
5. **Exact workshop address** — Maps embed currently points at the Aïn Sebaâ
   neighborhood; swap `mapsEmbedUrl` for the exact-address embed if desired.
6. **Legal page** — `app/mentions-legales/page.tsx` lacks RC/ICE registration
   numbers and the hosting-provider (hébergeur) section customary in Morocco;
   add once the client provides them and hosting is final.

**Optional / infrastructure:**
7. **Resend API key** if email copies of quotes are wanted (site works without).
8. **`git init` + remote** — the project has NO version control. Required before
   `deploy.sh` can work, and strongly recommended before further edits.
   Suggested `.gitignore`: `node_modules/`, `.next/`, `.env`, `tsconfig.tsbuildinfo`.
9. **Deploy** (§8) once the client approves after testing.
10. Housekeeping: delete the stray `Generated Image July 03, 2026 - 5_24PM.png`
    in the root (unused); `photos-client/` raw photos could be moved out of the
    repo before pushing (large, not served).

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
