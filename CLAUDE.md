# Project knowledge — where to look

Two complementary sources. Use BOTH before working on this codebase:

1. **`graphify-out/` (code graph)** — structure: who imports what, call
   relationships, hubs, communities. Consult it EVERY time you need knowledge
   about the project's structure before grepping or reading source.
2. **`HANDOFF.md` (repo root)** — behavior & intent: the canonical takeover doc.
   Deliberate decisions the graph cannot see (pure-CSS hero entrance, gallery
   span/aspect-ratio rules, hydration fixes, deployment status, to-do list).
   Read it before modifying anything; keep it updated when project state changes.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- **Check freshness first**: compare `built_at_commit` in graphify-out/graph.json (also shown in GRAPH_REPORT.md) against `git rev-parse HEAD`. If they differ, run `graphify update .` before trusting the graph.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
- Known quirks: the graph indexes the markdown docs (BRIEF, PLAN, HANDOFF) alongside code, so doc headings appear as nodes; `compilerOptions`/`devDependencies` rank as "god nodes" but are just config keys — ignore refactor suggestions about them.

## Key facts the graph confirms (verified 2026-07-06)

- `data/company.ts` → `company` is the single source of truth: 14 importers
  (every section, layout, API routes, sitemap, robots). Never hardcode business
  facts in components.
- `lib/whatsapp.ts` → `whatsappLink()` is the conversion backbone (Hero, Footer,
  WhatsAppFloat, QuoteForm all call it).
- No import cycles.
