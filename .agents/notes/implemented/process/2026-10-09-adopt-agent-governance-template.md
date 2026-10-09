# Agent Note: Adopt the agent-governance template

Status: implemented

## Problem

A repository developed heavily by AI agents accumulates rules faster than any human enforces them: which docs exist, where decisions live, what a PR must carry, and how prose should read. Without mechanical enforcement, every one of those rules decays into folklore — agents re-litigate settled decisions, documentation drifts from code, and review becomes the only quality gate.

## Decision

This repository carries a governance layer extracted from deepseek-harness: a root [AGENTS.md](../../../AGENTS.md) of standing orders, this Agent Note tree as the decision record, a documentation standard with word-count budgets, and a `doc-sync` gate aggregate that mechanically enforces links, wrapping, budgets, blocked ambiguous labels, and Agent Note structure. Gate scopes and blocked terms are configured in one place: [scripts/governance-config.ts](../../../scripts/governance-config.ts). PRs update the affected gates together with the behavior they govern.

## Alternatives considered

**Rules-only AGENTS.md with no gates.** Cheapest to adopt, but every rule then depends on reviewer attention; drift is detected only when someone notices. Rejected because the problem being solved is precisely that attention does not scale to agent-generated volumes.

**Full replication of the upstream doc-sync surface.** Carrying bilingual translation pairing, markdown TypeScript-fence compilation, export-JSDoc checks, and generated catalogs matches the source repository exactly, but each piece drags in infrastructure a fresh project does not have yet. Rejected as premature; the upstream pieces remain documented for later extraction in [UPSTREAM.md](../../../UPSTREAM.md).

**An interactive `create-` initializer CLI.** Parameterized scaffolding is friendlier, but it requires real consumers and maintenance before it earns its complexity — the same reasoning that led the upstream repository to delete its own scaffold package. Rejected until several projects have adopted the copyable form.

## Consequences

Governance is enforced at `pnpm run test:docs` (fast subset) and `pnpm run doc-sync` (full), so violations surface as command failures rather than review findings. New decisions must land as Agent Notes in the same PR that implements them, which costs a small amount of writing discipline and buys an audit trail of why. Adopters must customize `governance-config.ts`, the budget manifest, and the root AGENTS.md before the gates describe their repository rather than this template.
