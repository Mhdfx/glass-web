# Playbook backup — business-onepager "ready file" system

Versioned copy of the cross-project playbook. The **live** copies that
Claude actually loads sit on the machine at:

- `~/.claude/CLAUDE.md`            ← `global-CLAUDE.md` here
- `~/.claude/playbooks/business-onepager-playbook.md`
- `~/.claude/playbooks/business-onepager-assets/` (hook configs)

To restore on a new machine (or after a reset):

```powershell
Copy-Item playbook\global-CLAUDE.md "$env:USERPROFILE\.claude\CLAUDE.md"
New-Item -ItemType Directory -Force "$env:USERPROFILE\.claude\playbooks" | Out-Null
Copy-Item playbook\business-onepager-playbook.md "$env:USERPROFILE\.claude\playbooks\"
Copy-Item -Recurse -Force playbook\business-onepager-assets "$env:USERPROFILE\.claude\playbooks\"
```

When the playbook evolves, update the live copy first, then re-copy here
and commit. This folder is the backup, not the source of truth.
