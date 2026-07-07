# WHATS NEEDED — file map: what's for YOU vs what deploys

> Quick orientation map of the repo. Four groups: your working documents,
> the AI tooling, raw source material, and the actual deployable site.
> Nothing in groups 1-3 is ever served to a visitor.

---

## 1. YOUR working documents (read/keep — not deployed)

| File / folder | What it is |
|---|---|
| `HANDOFF.md` | **The canonical project doc.** Status, rules, behaviors, "where do I change X" table, remaining to-do list. Start here always. |
| `CLAUDE.md` | Instructions Claude loads every session in this repo (graph-first exploration, design-skill mandates, template note). |
| `TEMPLATE.md` | Full inventory of every feature/pattern/skill used here — raw material for the reusable template. |
| `playbook/` | **Backup of the cross-project "ready file" system** (global CLAUDE.md, business-onepager playbook, hook configs + restore commands). Live copies: `~/.claude/`. |
| `WHATS-NEEDED.md` | This file. |
| `needed.md` | The original client brief (French) — historical reference. |
| `PLAN.md` | The original build plan — historical reference. |
| `README.md` | Repo overview: how to run locally, pre-launch checklist, deploy pointers. |

## 2. AI tooling (Claude's working gear — not deployed)

| File / folder | What it is |
|---|---|
| `.claude/settings.json` | Graphify enforcement hooks (graph-first reminders on Grep/Read/Glob). |
| `.claude/settings.local.json` | Impeccable design-QA hook (runs after every UI file edit) + local permissions. |
| `.claude/skills/` | The installed design skills (ui-ux-pro-max, impeccable, design-taste-frontend, high-end-visual-design, design-motion-principles, redesign-existing-projects, etc.). |
| `graphify-out/` | Generated code graph (git-ignored; auto-rebuilt by git hooks on every commit/checkout). Query with `graphify query/explain/path`. |
| `skills-lock.json` | Skill installer's lockfile. |
| `.agents/ .cursor/ .codex/ .gemini/ .windsurf/ .continue/ .roo/ .trae/ .kiro/ .qoder/ .augment/ .codebuddy/ .factory/ .kilocode/ .opencode/ .warp/ .impeccable/ .github/` | Mirror configs the skill installer dropped for OTHER AI editors. Only useful if you use those tools; harmless to keep, safe to delete any you'll never use. |
| `.git/hooks/post-commit`, `post-checkout` | Graphify auto-rebuild hooks — **contain the machine-specific pinned Python path** (`_PINNED`); re-pin if graphify is reinstalled. Not versioned by git. |

## 3. Source material & pipelines (not served — feeds the site)

| File / folder | What it is |
|---|---|
| `photos-client/` | RAW client photos incl. `finition-01.avif` (hero source). Git-ignored — **exists only on this machine, back it up separately.** |
| `scripts/process-client-photos.mjs` | Sharp pipeline that turned raw photos into `public/images/gallery/`. |
| `scripts/generate-placeholders.mjs` | Generated the (since removed) abstract placeholders — kept for history. |

## 4. THE DEPLOYABLE SITE (everything a visitor's browser or the server needs)

| File / folder | What it is |
|---|---|
| `app/` | Pages, layout, SEO, sitemap/robots, API routes, 404, legal page. |
| `components/` | All UI components (layout / sections / ui). |
| `data/` | **The 3 content files** — company.ts, services.ts, gallery.ts. Edit content HERE. |
| `lib/whatsapp.ts` | WhatsApp link builder (conversion backbone). |
| `public/` | Served assets: hero, gallery JPEGs, og.jpg, icons. |
| `package.json` / `package-lock.json` | Dependencies. |
| `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`, `next-env.d.ts` | Build configuration. |
| `Dockerfile`, `docker-compose.yml`, `deploy.sh`, `nginx/` | Deployment kit for the Contabo VPS. |
| `.env.example` | Env template (→ `.env` on the server; all vars optional). |
| `.gitignore` | Keeps groups above out of git where appropriate. |
| `.dockerignore` | Keeps groups 1-3 + docs out of the Docker build context — the image ships only the standalone build + public assets. |

## 5. Outside the repo (machine-level — backed up in `playbook/`)

| Location | What it is |
|---|---|
| `~/.claude/CLAUDE.md` | Global instructions Claude loads in EVERY project (points to the playbook). |
| `~/.claude/playbooks/business-onepager-playbook.md` | The cross-project build guide. |
| `~/.claude/playbooks/business-onepager-assets/` | Ready-to-copy hook configs for new projects. |
| `~/.claude/projects/...:/memory/` | Claude's persistent memory about this project. |

---

**Rule of thumb:** to change the website → group 4 (usually just `data/`).
To understand or hand over the project → group 1. To make Claude work
well → groups 2 and 5. Never deploy-critical: groups 1, 2, 3, 5.
