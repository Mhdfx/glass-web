# Playbook — Local-business one-pager (distilled from the Chaimae Glass project)

> Self-contained build guide for the next client site. Reference
> implementation: **github.com/Mhdfx/glass-web** (branch `master` = light
> "lumière froide" design; branch `redesign` = dark brass/ink design; local
> copy at `C:\laragon\www\site chaimae glass`, see its `TEMPLATE.md` and
> `HANDOFF.md`). When starting a new project of this kind, clone that repo
> as the starting skeleton rather than rebuilding from scratch.

## 1. Stack (proven combination — reuse as-is)

- Next.js 16 App Router (Turbopack) · React 19 · TypeScript strict
- Tailwind CSS v4: tokens via `@theme` in `app/globals.css`, custom
  `@utility` blocks, **no tailwind.config file**
- Framer Motion 12 + pure-CSS keyframes for pre-hydration entrances
- Lenis smooth scroll (`components/SmoothScroll.tsx` in root layout)
- `next/font/google` (display + sans exposed as `--font-display`/`--font-sans`)
- sharp for asset pipeline scripts; Resend for optional email

## 2. Architecture rules (non-negotiable)

1. **Single source of truth**: `data/company.ts` = ALL business facts
   (name, phones, whatsapp, email, address parts, hours, counts, siteUrl,
   socials, mapsEmbedUrl). `data/services.ts` = offer categories + pillars
   (+ form options derived). `data/gallery.ts` = photos/captions/spans.
   Components never hardcode a business fact. New client = swap 3 files.
2. **Conversion backbone**: `lib/whatsapp.ts` (`whatsappLink()`,
   `quoteWhatsappLink(values)` prefilled). Every CTA converges on one
   channel; email is secondary and optional.
3. **One-pager composition** in `app/page.tsx`: Header → Hero → WhyUs →
   Expertises → Gallery → Stats → QuoteForm → Contact → Footer → Float.
4. **SEO derives from data**: metadata/OG + LocalBusiness JSON-LD in
   `layout.tsx`, `sitemap.ts`/`robots.ts` from `company.siteUrl`.
5. **APIs**: `/api/health` (Docker healthcheck) and `/api/quote`
   (length-capped, HTML-escaped, honeypot honored, NEVER blocks the user:
   missing RESEND_API_KEY → `{ok:true, email:"skipped"}`).
6. Custom branded 404 + legal page (mentions légales) fed from data.

## 3. Component kit (port from reference repo)

- `Reveal.tsx` — hydration-safe scroll reveal: opacity + y + blur(5px)→0,
  `useReducedMotion`, viewport once, delay prop.
- Pure-CSS `.hero-in` cascade with `--hero-delay` — hero must animate
  before JS loads; never convert to Framer Motion.
- `Button.tsx` — primary/ghost/whatsapp variants, `Shine` sweep,
  `ArrowCap` (icon nested in its own pill), `active:scale-[0.98]`.
- Header — fixed 72px (anchors need `scroll-margin-top: 5.5rem`),
  scroll-aware backdrop, IntersectionObserver scroll-spy with
  `aria-current`, underline-sweep hover, morphing burger (2 bars → X),
  staggered mobile menu + scroll lock.
- QuoteForm — touched/blur validation, errors auto-clear offscreen
  (IntersectionObserver), honeypot, success state, focus-first-error,
  aria-invalid/describedby.
- Gallery (optional) — mosaic where tile `span` matches each photo's
  NATIVE aspect ratio (client complaint history: never crop-zoom);
  tile order must close the 3-col grid flush (simulate grid-auto-flow
  dense placement with a small Node script to verify); filters DERIVED
  from items so empty categories auto-hide; lightbox w/ keyboard nav.
- Stats CountUp — render final value server-side, animate 40%→target in
  view only (never flash 0).
- WhatsAppFloat — ping animation capped `[animation-iteration-count:3]`.

## 4. Design system method

- Tokens: 3 families max — surfaces, ink, ONE brand accent (+ functional
  WhatsApp green). Shadows always tinted (never pure black). Two proven
  palettes to preset from: dark-warm (ink #0b0a08 / ivory / brass #c9a66b)
  and light-cold (porcelain #f7f8f9 / smoke #17191c / chrome hairlines /
  brass accent only).
- Utilities to recreate: `container-site` (76rem), `section-label`
  (eyebrow — RATION: max 1 per 3 sections), `heading-display`, `pane`
  (surface w/ inner top highlight = "double bezel"), `.grain-overlay`
  (fixed, pointer-events-none, opacity 0.02-0.03).
- Radius system, documented in CSS: pill = interactive, 1rem = surfaces,
  0.5rem = fields.
- Motion: transform/opacity/filter ONLY; house bezier
  `cubic-bezier(0.22,1,0.36,1)`; enter = fade+rise+blur, exits subtler;
  NO perpetual loops (pulses capped); ALL motion gated on
  `prefers-reduced-motion` (global kill block + per-component).
- Performance: backdrop-blur only on fixed/sticky; `min-h-dvh` never
  `h-screen`; hero `priority`; Next 16 gotcha — non-default
  `quality={90}` must be allowlisted: `images.qualities: [75, 90]`.
- Text-over-photo on a light design: porcelain veil gradients (lateral
  desktop / bottom-up mobile + thin top veil for the transparent header),
  never a black scrim.
- Anti-AI-tells (from taste skills): no em-dashes in visible copy, no
  scroll cues, no 3-equal-cards rows, no section-number eyebrows, no
  beige+brass default for premium briefs (rotate palette families), no
  Fraunces/Instrument Serif defaults, hero = max 4 text elements,
  one CTA label per intent page-wide.

## 5. Asset pipeline

- Raw client photos → `photos-client/` (git-ignored).
- `scripts/process-client-photos.mjs` pattern: sharp jobs table (trim,
  mirror-flop, extractTop, attention crop) → sized JPEGs in
  `public/images/`.
- Low-res hero rescue recipe: `sharp(src).resize({width:1920,
  kernel:'lanczos3'}).sharpen({sigma:0.9}).jpeg({quality:88,mozjpeg:true})`
  + `quality={90}` on next/image.
- Duplicate check before adding client photos: `md5sum` against existing.

## 6. Deployment kit (in reference repo)

- Dockerfile with `output:"standalone"` gated behind `DOCKER_BUILD` env
  (never set locally); compose binds `127.0.0.1:3000`.
- `deploy.sh`: git pull → build → swap → poll `/api/health` 60s →
  auto-rollback on failure.
- `nginx/site.conf`: TLS via certbot, gzip, long-cache `_next/static/`,
  maintenance page on 502/503/504.
- `.env.example` with all-optional vars.
- Prerequisites before deploy: domain purchased + DNS → VPS, repo has a
  git remote.

## 7. Working method (process that made this project fast)

- **HANDOFF.md** at repo root from day one: status line, single-source
  rules, behaviors-worth-knowing, "where do I change X" table, remaining
  to-do list. Update it every session.
- **CLAUDE.md** per project: knowledge sources + design-skill mandates.
- **graphify** — set up in EVERY new project (full recipe in §7bis).
- **Design skill chain for builds/redesigns**: redesign-existing-projects
  (audit first) → high-end-visual-design (standards) →
  design-motion-principles (motion judgment; marketing = Jakub-polish
  primary) → design-taste-frontend (design read + dials + pre-flight
  checklist) → impeccable hook QA (address or classify every finding).
- **Verify loop after every change**: `npm run build` → `npx next start
  -p <throwaway>` → curl the HTML and assert markers (classes, image
  URLs, HTTP codes) → kill server. Never declare done without it.
- **Git pattern**: branch per design direction, `--no-ff` merge records
  the client's choice, push all branches to GitHub as archive.

## 7bis. graphify — full setup for a new project (do this once per repo)

The CLI is installed machine-wide (`graphify.exe` in `~/.local/bin`, a uv
tool; the actual env is `%APPDATA%\uv\tools\graphifyy\Scripts\python.exe`).

1. **Build the graph**: from the repo root run `graphify update .`
   (AST-only, no API cost). Output lands in `graphify-out/`.
2. **Git-ignore it**: add to `.gitignore`:
   ```
   # graphify — generated code graph (rebuilt by hooks / graphify update)
   graphify-out/
   ```
3. **Install the auto-rebuild hooks**: `graphify hook install`
   (creates `.git/hooks/post-commit` + `post-checkout`).
4. **Windows fix (THIS machine — username has spaces)**: the hooks'
   pointer-file probe strips whitespace, so pin the interpreter directly.
   In BOTH hook files replace `_PINNED=''` with:
   ```
   _PINNED='C:/Users/LENOVO LEGION 5/AppData/Roaming/uv/tools/graphifyy/Scripts/python.exe'
   ```
   Then make a test commit and confirm the hook prints
   "launching background rebuild" (log: `~/.cache/graphify-rebuild.log`),
   and that `built_at_commit` in `graphify-out/graph.json` matches
   `git rev-parse HEAD` afterwards.
5. **Copy the graph-first rules into the project's CLAUDE.md** (this exact
   block, proven in the reference repo):
   ```markdown
   ## graphify
   This project has a knowledge graph at graphify-out/.
   Rules:
   - For codebase questions, first run `graphify query "<question>"` when
     graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for
     relationships and `graphify explain "<concept>"` for focused concepts.
   - **Check freshness first**: compare `built_at_commit` in
     graphify-out/graph.json against `git rev-parse HEAD`; if they differ,
     run `graphify update .` before trusting the graph.
   - After modifying code, run `graphify update .`.
   - Known quirks: markdown docs are indexed alongside code (doc headings
     appear as nodes); `compilerOptions`/`devDependencies` rank as god
     nodes but are just config keys — ignore refactor suggestions on them.
   ```
6. **Enforcement hooks — ready-to-copy assets live NEXT TO THIS PLAYBOOK**
   in `~/.claude/playbooks/business-onepager-assets/`:
   - `settings.json` — graphify PreToolUse hooks (inject a "run graphify
     first" reminder whenever Grep/Read/Glob targets source files).
     Fully portable, no dependencies. Copy into the new project:
     ```powershell
     Copy-Item "$env:USERPROFILE\.claude\playbooks\business-onepager-assets\settings.json" ".claude\settings.json"
     ```
     (If the project already has a `.claude/settings.json`, merge the
     `hooks` block instead of overwriting.)
   - `settings-impeccable-hook.json` — the impeccable design-QA
     PostToolUse hook (runs a design linter after every Edit/Write on UI
     files). REQUIRES the impeccable skill installed in the project
     (`.claude/skills/impeccable/` must exist — run `/impeccable init` or
     copy that folder from the reference repo first). Merge its `hooks`
     block into the project's `.claude/settings.local.json`.

   Rules in CLAUDE.md tell Claude what to do; these hooks enforce it
   mechanically — always install BOTH the CLAUDE.md block (step 5) and
   the hooks together.

**Skill-installer gotcha (learned 2026-07-07)**: installers drop duplicate
skill bundles for many AI editors (`.cursor`, `.codex`, `.agents`, …) AND
may create `.claude/skills/*` entries as Windows **junctions into
`.agents/skills/`**. Before deleting the unused mirror folders, check
`Get-ChildItem .claude\skills | ? LinkType` — materialize junctions into
real folders first (delete link with `cmd /c rmdir`, then `git restore`
the path), or Claude loses those skills.

Honest scope note: on a ~40-file one-pager the graph's value is mostly the
freshness-checked `explain`/`path` queries and validating the
single-source-of-truth rule (company.ts importers, no cycles). It earns
more as the codebase grows. HANDOFF.md stays the canonical doc for
*behavioral* knowledge the graph cannot see.

## 8. New-project checklist

1. Clone reference repo → rename → `git init` fresh (or new remote).
2. Fill `data/company.ts`, `services.ts`; process photos → `gallery.ts`
   (spans = native ratios; verify mosaic closes flush).
3. Pick palette preset (dark-warm / light-cold) or derive a new one from
   the brand's logo color; swap display font (rotate serifs/sans — never
   reuse the previous project's).
4. Rewrite hero copy (≤2-line headline, ≤20-word sub, 2 CTAs max).
5. Update fonts, `themeColor`, OG image; check JSON-LD fields.
6. Run pre-flight: eyebrow count, em-dash scan, CTA-intent dedupe,
   contrast (AA), reduced-motion pass, mobile collapse.
7. Build/verify loop; write HANDOFF.md; set up graphify + hooks (§7bis).
8. Deployment when domain exists (§6).
