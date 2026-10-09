# AGENTS.md — Archived Agent Notes

Archived Agent Notes under the kind directories are frozen historical snapshots, not current authority. Never edit, reformat, repair, delete, or move a sealed artifact; use an active Agent Note or current documentation for new decisions and facts.

The archival change may only relocate the complete file, insert the identical `Archived: YYYY-MM-DD` line below `Status: implemented`, and repair or delete inbound links. Do not inspect, verify, or repair links out of archived notes.

Run the [archive-agent-notes](../../skills/archive-agent-notes/SKILL.md) workflow and append new artifact hashes with `pnpm run verify-archived-agent-notes -- --write`. The normal verifier rejects changed or missing sealed artifacts, unknown kind folders, and invalid archive metadata.
