# Global instructions (all projects)

## Reusable playbooks

- **Business one-pager / local-business marketing site** — before starting
  any new project of this kind (client website, artisan/shop/service
  one-pager, landing page for a local business), READ
  `~/.claude/playbooks/business-onepager-playbook.md`. It distills the
  complete stack, architecture rules, component kit, design method,
  deployment kit and working process proven on the Chaimae Glass project.
  Reference implementation: github.com/Mhdfx/glass-web (local:
  `C:\laragon\www\site chaimae glass`, see TEMPLATE.md + HANDOFF.md there).
  Default move: clone/copy that skeleton and swap the `data/*` files —
  do not rebuild from scratch.

## Cross-project conventions

- Every project gets a `HANDOFF.md` at repo root (status, single-source
  rules, "where do I change X" table, remaining to-dos) — create it early,
  keep it current.
- Verify every change end-to-end before declaring done: build → run on a
  throwaway port → curl/exercise the affected flow → stop the server.
- Windows note: this machine's username contains spaces ("LENOVO LEGION
  5") — quote paths everywhere; if graphify git hooks fail to find
  Python, pin the interpreter in the hooks' `_PINNED` variable.
