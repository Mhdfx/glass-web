# TEMPLATE.md — Reusable inventory from the Chaimae Glass project

> Everything this project uses, built, or learned — catalogued as raw material
> for a reusable "local-business one-pager" template. Each item is marked
> **[CORE]** (belongs in every template instance), **[OPTION]** (include per
> project), or **[PROCESS]** (workflow/tooling, not shipped code).

---

## 1. Tech stack [CORE]

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 16 App Router (Turbopack), React 19, TypeScript strict | |
| Styling | Tailwind CSS v4 | Tokens via `@theme` in `globals.css`; custom `@utility` blocks; **no tailwind.config file** |
| Animation | Framer Motion 12 | + pure-CSS keyframes for pre-hydration entrances |
| Smooth scroll | Lenis | `components/SmoothScroll.tsx` mounted in root layout |
| Fonts | `next/font/google` | Display serif + body sans exposed as `--font-display` / `--font-sans` |
| Images | sharp (scripts) + `next/image` | AVIF/WebP formats, custom `deviceSizes`, `qualities: [75, 90]` (Next 16 400s on unlisted qualities) |
| Email | Resend | Optional — see §4 graceful degradation |
| 3D | react-three-fiber + drei (retired in v2, in git history) | [OPTION] |

## 2. Architecture patterns [CORE — the template's backbone]

1. **Single source of truth data layer** — `data/company.ts` holds every
   business fact (name, phones, WhatsApp, email, address parts, hours,
   counts, siteUrl, socials, maps embed). 14 importers; zero hardcoded
   facts in components. `data/services.ts` (categories + pillars + derived
   form options), `data/gallery.ts` (photos + captions + tile spans).
   **Template move: swap these 3 files → new client site.**
2. **Conversion backbone** — `lib/whatsapp.ts`: `whatsappLink()` +
   `quoteWhatsappLink(values)` with prefilled message. Every CTA converges
   on one channel. Swappable per project (tel:, Calendly, form-only).
3. **One-pager composition** — `app/page.tsx` = ordered section list:
   Header → Hero → WhyUs → Expertises → Gallery → Stats → QuoteForm →
   Contact → Footer → Float. Sections are self-contained files.
4. **SEO from data** — `layout.tsx` builds metadata/OG + LocalBusiness
   JSON-LD from `company`; `sitemap.ts` / `robots.ts` derive from
   `company.siteUrl`. Change data file → all SEO updates.
5. **Legal page** (`mentions-legales`) fed from the same data layer.
6. **Custom branded 404** reusing the button/heading system.

## 3. Component/UX inventory

- **[CORE] `Reveal.tsx`** — hydration-safe scroll reveal (opacity + rise +
  blur→focus), `useReducedMotion`, viewport-once, per-item delay.
- **[CORE] Pure-CSS hero entrance** — `.hero-in` keyframes + `--hero-delay`
  cascade; plays before JS hydrates. Never convert to JS motion.
- **[CORE] Button system** — variants (primary/ghost/whatsapp), `Shine`
  sweep, `ArrowCap` nested icon-in-pill, press scale, custom cubic-bezier.
- **[CORE] Header** — fixed 72px, scroll-aware backdrop, IntersectionObserver
  scroll-spy (`aria-current`), underline-sweep hover, morphing burger
  (2 bars → X), staggered mobile menu, scroll lock.
- **[CORE] QuoteForm** — client validation w/ touched/blur logic, errors
  auto-clear when section leaves viewport, honeypot, dual channel
  (WhatsApp open + best-effort POST), success state, a11y wiring
  (aria-invalid/describedby, focus first error).
- **[CORE] API routes** — `/api/health` (Docker healthcheck), `/api/quote`
  (length-capped, HTML-escaped, never blocks user on email failure:
  missing key → `{ok, email:"skipped"}`).
- **[OPTION] Gallery** — 3-col mosaic where each tile `span` matches the
  photo's NATIVE aspect ratio (square/tall/xtall/wide/std); tile order
  closes the grid flush (verify with the dense-grid simulation script);
  filters DERIVED from items (empty categories auto-hide); lightbox with
  keyboard nav, scroll lock, anchor-click auto-close.
- **[OPTION] Stats CountUp** — renders final value server-side, animates
  40%→target only in view; never flashes 0.
- **[OPTION] WhatsAppFloat** — ping capped at 3 iterations (never
  perpetual), tooltip, safe-area bottom.
- **[CORE] a11y baseline** — global `:focus-visible`, skip link,
  `prefers-reduced-motion` kill-switch block, scroll-margin-top for
  anchors under fixed header, WCAG AA contrast.

## 4. Design system method [CORE]

- Tokens in `@theme`: 3 families max — surfaces, ink, ONE brand accent
  (+functional WhatsApp green). Shadows always tinted, never pure black.
- Utilities: `container-site` (76rem), `section-label` (eyebrow — max 1
  per 3 sections), `heading-display`, `pane`/`glass-panel` (surface w/
  inner-highlight "double bezel"), `fluted` (CSS texture), `.grain-overlay`
  (fixed, pointer-events-none, opacity ~0.02).
- Radius rule documented in CSS: pill = interactive, 1rem = surfaces,
  0.5rem = fields.
- Motion rules: transform/opacity/filter only; custom bezier
  `cubic-bezier(0.22,1,0.36,1)` everywhere; enter = fade+rise+blur,
  exits subtler; no looping attention-seekers; everything gated on
  reduced-motion.
- Performance rules: backdrop-blur ONLY on fixed/sticky elements; grain
  on fixed overlay; `min-h-dvh` never `h-screen`; hero image `priority`.
- Two proven palettes in git history: **dark warm** (ink/ivory/brass,
  `redesign` branch) and **light cold** ("lumière froide":
  porcelain/smoke/chrome + brass accent, shipped master).

## 5. Deployment kit [CORE]

- `Dockerfile` (standalone output gated behind `DOCKER_BUILD` env — never
  set locally), `docker-compose.yml` (binds 127.0.0.1:3000).
- `deploy.sh` — git pull, image build, container swap, `/api/health` poll
  (60s), **auto-rollback** to previous image on failure.
- `nginx/site.conf` — TLS (certbot), gzip, long-cache `/_next/static/`,
  maintenance page on 502/503/504 (`nginx/maintenance/index.html`).
- `.env.example` — every var optional; site fully works with zero env.

## 6. Asset pipeline [PROCESS]

- `scripts/process-client-photos.mjs` — sharp jobs table: trim, mirror-flop,
  top-extract, attention-crop → sized gallery JPEGs.
- `scripts/generate-placeholders.mjs` — seeded abstract SVG placeholders.
- Hero photo recipe: AVIF/HEIF in → `sharp().resize({width:1920,
  kernel:'lanczos3'}).sharpen({sigma:0.9})` → JPEG q88 → `quality={90}`
  on `next/image` (+ allowlist in next.config).
- Raw client photos live in `photos-client/` (git-ignored source material).

## 7. AI workflow layer [PROCESS — the meta-template]

- **CLAUDE.md** — mandates: graph-first exploration (graphify), freshness
  check, design skills before styling, ui-ux-pro-max script runs.
- **HANDOFF.md** — canonical takeover doc: what/why/where-to-change-X
  cheat sheet, behaviors-worth-knowing, remaining-work list. Kept current
  every session.
- **graphify** — code graph in `graphify-out/` (git-ignored), auto-rebuilt
  by post-commit/post-checkout hooks. Gotcha solved: usernames with spaces
  break the pointer-file probe → pin interpreter in `_PINNED` var inside
  `.git/hooks/*`.
- **impeccable** — PostToolUse hook runs a deterministic design linter on
  every UI file edit (caught: gradient-text, bounce easing).
- **Skills used and how they chained:**
  - `redesign-existing-projects` — audit-first checklist (typography,
    color, layout, states, AI-tells), fix-priority order.
  - `high-end-visual-design` — premium standards: double-bezel surfaces,
    nested CTA icons, custom beziers, macro-whitespace.
  - `design-motion-principles` — designer weighting (Jakub polish primary
    for marketing), frequency gate, enter/exit recipes, gotcha self-check.
  - `design-taste-frontend` — design-read + 3 dials (variance/motion/
    density), palette-rotation ban (broke the beige+brass default → cold
    luxury), eyebrow rationing, em-dash ban, pre-flight checklist.
  - `ui-ux-pro-max` — palette/pattern lookups + pre-delivery checklist.
- **Verification pattern** — after every change: `npm run build` → `next
  start` on a throwaway port → `curl` the HTML and assert markers (new
  classes, image URLs, absent placeholders, HTTP codes) → kill server.
- **Git pattern** — branch per design direction (`redesign`, `redesign-v2`),
  `--no-ff` merge to record the decision, branches pushed to GitHub as
  archive. Commit messages document design rationale.
- **Mosaic solver** — small Node script simulating CSS grid dense
  auto-placement to brute-force tile orders that close the grid flush
  (kept in session scratchpad; recreate on demand, logic documented in
  `data/gallery.ts` header).

## 8. Template blueprint (proposed next step)

A `business-onepager-template` repo containing:

1. This stack + §2 architecture with `data/*` reduced to typed schemas +
   example content; `[BUSINESS_NAME]` placeholders nowhere else.
2. Both palettes as ready `@theme` presets (dark-warm / light-cold) +
   token slots for a per-client accent.
3. All [CORE] components; [OPTION] sections behind simple removal
   (delete file + line in page.tsx).
4. Deployment kit as-is (domain placeholder in nginx conf).
5. CLAUDE.md + HANDOFF.md skeletons; graphify + impeccable hook setup
   notes (incl. the spaced-username fix).
6. A `NEW-PROJECT.md` checklist: fill data files → pick palette → swap
   fonts → process photos → run pre-flight (eyebrow count, em-dash scan,
   contrast, CTA intent dedupe) → build/verify loop.
