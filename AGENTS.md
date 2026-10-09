# AGENTS.md

This repository carries an agentic-collaboration governance layer: standing orders for agents, a decision-record tree, and mechanically executed documentation gates. The rules originate from deepseek-harness (dsh); [UPSTREAM.md](UPSTREAM.md) maps every file to its source. Read [docs/architecture.md](docs/architecture.md) before changing source; follow [docs/AGENTS.md](docs/AGENTS.md) for documentation.

## Conventions

- **Registrations are effects.** Every contribution that acquires a resource, listener, or registration goes through an explicit teardown path; a registry's `register()` returns the disposer.
- **Switch on discriminant tags.** Closed unions end in `assertNever`; extensible unions fall through a documented default.
- **Misconfiguration fails loud** at load when self-contained, otherwise at the earliest resolvable point; never silently skip a missing referent.
- **Explicit > implicit at module boundaries:** defaulting is an explicit `resolve(request): Spec` step in the owning implementation, never a hidden `?? default` inside `run()`.
- **No hardcoded tunables in modules:** deployment-varying choices are validated config fields; a `DEFAULT_*` constant or test hook is not configurability.
- **Trust static types at typed same-process boundaries.** Validate at parser/config, queue, wire, file, and process boundaries only — not between two typed modules in one process.
- **An empty `catch` names the error** and why; keep its `try` to one statement.
- **Keep comments local.** Do not restate code, expand unrelated comments, or explain distant behavior without local need. State contracts, not reasoning transcripts; use [prose-standard](.agents/skills/prose-standard/SKILL.md).
- **Prefer symmetry for parallel values**; unexplained asymmetry usually signals a missed extraction.
- **Tests describe behavior, not correctness.** Change obsolete behavior with its tests; explain why in the PR.
- TODO markers: `FIXME`/`TODO`/`XXX` by urgency.
- Files end with exactly one trailing newline; `git diff --cached --check` (pre-commit) gates it.

## Decisions and documentation

- **Non-trivial changes MUST include an Agent Note in the same PR;** only mechanical/local edits are exempt ([scope](.agents/notes/README.md#when-to-write-one)). Archived notes are frozen: never edit or treat them as current authority.
- **Docs accompany every code change:** update affected README and JSDoc contracts together, per [docs/AGENTS.md](docs/AGENTS.md).
- **One home per fact.** Rationale → Agent Notes; incidents → [postmortems](docs/postmortem/README.md); procedures → [cookbook](docs/cookbook/responding-to-pr-review-on-a-stack.md); standing orders → this file with a rationale link.
- Gate scopes and blocked terms are configured in [scripts/governance-config.ts](scripts/governance-config.ts); change them there, never inside a gate.

## Checks

- Run `pnpm run test:docs` before pushing; CI runs the same aggregate on PRs.
- Match evidence to the surface: focused behavior tests for behavior, `test:docs` for docs. Never repeat a passing check for commit or push; CI owns exhaustive coverage.
- Wire mechanically checkable invariants into an executed gate and prove each changed acceptance path rejects an invalid case.

## PR history

- **Choose PR history deliberately.** Split independent changes; fix the introducing PR before propagation. Standalone/stack branches may merge-forward or rebase. Rewrites use `--force-with-lease`, abort on remote movement, never raw `--force`.
- Dependent PR chains use GitHub's official stacked-PR feature: [merging-stacked-prs](.agents/skills/merging-stacked-prs/SKILL.md) owns landing; [responding to review on a stack](docs/cookbook/responding-to-pr-review-on-a-stack.md) owns fix placement.

## Editing these instructions

`CLAUDE.md` links `AGENTS.md` (copy or symlink it when your agent reads `CLAUDE.md`). Keep each rule self-contained while linking high-level docs; condense when clarity survives; raise a `verify-doc-budgets` ceiling only with PR justification.
