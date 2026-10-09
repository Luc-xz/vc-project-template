# Agent Governance Template

A copyable project scaffold carrying the agentic-collaboration governance layer of [deepseek-harness](https://github.com/deepseek-ai/deepseek-harness): standing orders for AI agents, an Agent Note decision-record tree, and documentation gates that run as commands. Business code is deliberately absent — bring your own product; keep the governance.

It targets TypeScript + pnpm projects on Node ^22.19 || >=24.

## What is inside

| Area | What it gives you |
|---|---|
| [AGENTS.md](AGENTS.md) | Standing orders agents read every session: conventions, decision rules, check policy, PR history rules |
| [.agents/notes/](.agents/notes/README.md) | Decision records with a lifecycle (proposed → implemented / rejected → archived), enforced file format, and a frozen archive sealed by content hashes |
| [.agents/skills/](.agents/skills/prose-standard/SKILL.md) | Four agent workflows: prose standard, chain-of-thought leakage trimming, stacked-PR landing, Agent Note archiving |
| [docs/AGENTS.md](docs/AGENTS.md) | Documentation standard: tier taxonomy (one home per fact), writing rules, slop checklist, word-count budgets |
| [scripts/](scripts/run-gates.ts) | Eight gates behind `pnpm run doc-sync` / `pnpm run test:docs`: markdown links, one-line paragraphs, doc budgets, doc references in code, blocked ambiguous labels, and three Agent Note gates |
| [lefthook.yml](lefthook.yml) | Pre-commit whitespace and archive checks; pre-push hook slot |

## Initialize a project from this template

1. Copy this directory to your project root (or copy its contents into an existing repository).
2. Rename the package in `package.json`, then:

```sh
git init
git add -A
git commit -m "chore: initialize from agent-governance-template"   # verify-concrete-terms needs tracked files
pnpm install        # also installs lefthook git hooks
pnpm run test:docs  # must pass green on the pristine tree
```

3. Make the template yours:
   - Edit [AGENTS.md](AGENTS.md): keep the governance, add your project's domain rules, drop what does not apply.
   - Edit [scripts/governance-config.ts](scripts/governance-config.ts): set the Markdown globs your repo maintains, TypeScript globs for doc-reference checks, excluded prefixes, blocked ambiguous labels, and required tracked areas.
   - Edit [scripts/doc-budgets.manifest.json](scripts/doc-budgets.manifest.json): budget your standing docs (the file lists this template's own four).
   - Fill in [docs/architecture.md](docs/architecture.md) with your system map.
   - Add a `CLAUDE.md` that links or copies `AGENTS.md` if your agent reads `CLAUDE.md` (on Windows, copy; symlinks need developer mode).
4. After the first commit, switch CI to `pnpm install --frozen-lockfile` in [.github/workflows/ci.yml](.github/workflows/ci.yml).

## The gates

| Command | Rejects |
|---|---|
| `verify-md-links` | Broken relative Markdown links and anchors |
| `verify-md-wrap` | Prose paragraphs spanning multiple physical lines |
| `verify-doc-budgets` | Standing docs over their word ceiling (`--list` reports usage) |
| `verify-doc-refs` | Documentation paths cited in TypeScript that do not exist |
| `verify-concrete-terms` | Blocked ambiguous origin labels; configured in governance-config.ts |
| `verify-agent-note-classification` | Agent Notes outside the lifecycle/class tree |
| `verify-agent-note-format` | Agent Notes missing the header/status/section format |
| `verify-archived-agent-notes` | Edits to sealed archive artifacts; `-- --write` seals new ones |

`pnpm run test:docs` is the fast subset for every push; `pnpm run doc-sync` runs everything and is what CI-equivalent verification uses.

## What was intentionally left out

The upstream repository carries more machinery this template does not include, to keep a fresh project light: bilingual translation pairing (`.zh.md` + `.i18n.yaml` sidecars with blob-hash consistency), markdown TypeScript-fence compilation (`doc-typecheck`), export-JSDoc completeness, Mermaid diagram validation, generated catalogs, and the documentation website projection. [UPSTREAM.md](UPSTREAM.md) maps every file to its source and notes where each omitted piece lives, so you can extract it deliberately when your project earns it.

Extracted from deepseek-harness (MIT) at the baseline recorded in [UPSTREAM.md](UPSTREAM.md); see [LICENSE](LICENSE).
