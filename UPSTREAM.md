# Upstream source map

Every file here descends from the deepseek-harness repository (MIT). This file records the extraction baseline and each adaptation, so a future re-extraction or upstream comparison has a starting point. The blocked ambiguous label is written around in this file on purpose.

**Extraction baseline:** deepseek-harness commit `46a7f68b0922371ce7144b668b90e377d8e799f4` (2026-09-15).

## Verbatim copies

| Template path | Upstream path |
|---|---|
| `LICENSE` | `LICENSE` |
| `scripts/repo-files.ts` | `scripts/repo-files.ts` |
| `scripts/markdown.ts` | `scripts/markdown.ts` |
| `scripts/verify-doc-budgets.ts` | `scripts/verify-doc-budgets.ts` |
| `scripts/agent-note-tree.ts` | `scripts/agent-note-tree.ts` |
| `scripts/verify-agent-note-format.ts` | `scripts/verify-agent-note-format.ts` |

## Adapted copies

| Template path | Upstream path | Adaptation |
|---|---|---|
| `scripts/verify-md-links.ts` | `scripts/verify-md-links.ts` | Scan patterns moved to governance-config; one upstream generator reference removed from a comment |
| `scripts/verify-md-wrap.ts` | `scripts/verify-md-wrap.ts` | Scan patterns moved to governance-config |
| `scripts/verify-doc-refs.ts` | `scripts/verify-doc-refs.ts` | Patterns and exclusions moved to governance-config |
| `scripts/verify-agent-note-classification.ts` | `scripts/verify-agent-note-classification.ts` | Upstream legacy `docs/rfc` guard dropped (no former homes in a fresh project) |
| `scripts/verify-concrete-terms.ts` | `scripts/verify-concrete-terms.ts` | Blocked-term list, exclusions, and required tracked areas moved to governance-config; historical-schema region exclusion dropped |
| `scripts/archived-agent-notes.ts` | `scripts/archived-agent-notes.ts` | Bilingual triplet validation is now optional (`requireBilingualArchive`, default off): a single `.md` is a complete archived artifact |
| `scripts/verify-archived-agent-notes.ts` | `scripts/verify-archived-agent-notes.ts` | `.gitkeep` skipped in empty kind dirs; baseline env renamed `GOVERNANCE_ARCHIVE_BASE_REF`; a repository with no commits yet verifies against an empty baseline instead of failing |
| `.agents/notes/README.md` | `.agents/notes/README.md` | Bilingual counterpart sections and sidecar references removed; skill links renamed |
| `.agents/notes/implemented/AGENTS.md`, `.agents/notes/archived/AGENTS.md` | same | Triplet wording reduced to single files; skill links renamed |
| `.agents/skills/prose-standard/` | `.agents/skills/dsh-prose-standard/` | Renamed; bilingual/generated-catalog and locale-dictionary clauses removed; reference examples rewritten generically |
| `.agents/skills/trim-cot-leakage/` | `.agents/skills/dsh-trim-cot-leakage/` | Renamed; type-equivalence and translation-pairing workflow steps removed; recall batteries ported with translated-counterpart battery generalized; examples rewritten generically |
| `.agents/skills/merging-stacked-prs/SKILL.md` | `.agents/skills/dsh-merging-stacked-prs/SKILL.md` | Renamed; links retargeted to this tree |
| `.agents/skills/archive-agent-notes/SKILL.md` | `.agents/skills/dsh-archive-agent-notes/SKILL.md` | Renamed; triplet steps reduced to single files; calibrated examples generalized; pre-push skill link replaced by the root AGENTS.md check policy |
| `docs/postmortem/README.md` | `docs/postmortem/README.md` | Language switcher and sample entry table emptied for a fresh project |
| `docs/cookbook/responding-to-pr-review-on-a-stack.md` | `docs/cookbook/responding-to-pr-review-on-a-stack.md` | Language switcher removed; skill links retargeted |

## Written for the template

`README.md`, `AGENTS.md`, `docs/AGENTS.md` (condensed from the upstream documentation standard), `docs/architecture.md` (placeholder), `scripts/governance-config.ts`, `scripts/run-gates.ts` (slim scheduler; upstream `run-gates.ts` carries seventeen CI modes, worker budgets, and dependency graphs), `scripts/init.mjs` (template initializer, no upstream counterpart), `scripts/doc-budgets.manifest.json`, `package.json`, `lefthook.yml` (upstream uses a custom 859-line lefthook installer; this template uses plain `lefthook install`), `.github/workflows/ci.yml`, `.agents/notes/implemented/process/2026-10-09-adopt-dsh-governance-template.md` (seed decision record).

## Deliberately not extracted

Bilingual translation pairing (`scripts/translation-pairing*.ts`, `gen-translation-brief.ts`, merge driver, `docs/i18n/`), `doc-typecheck` (TypeScript fences in Markdown), `verify-export-jsdoc`, `verify-mermaid`, `gen-doc-graphs` (type-graph driven), generated catalogs, the documentation website projection, and the skills `dsh-doc`, `dsh-client-ui-ux`, `dsh-pre-push-checks`, `dsh-code-review`, `dsh-find-simplifications`, `dsh-speed-up-perf`, `dsh-ci-test-reliability`. Re-extract any of these from the paths above when your project adopts the corresponding practice.

To re-extract: compare this table's upstream paths at a newer baseline, re-apply the adaptations listed, and update the baseline commit in this file.
