# vc-project-template

A copyable project scaffold carrying the agentic-collaboration governance layer of [deepseek-harness](https://github.com/deepseek-ai/deepseek-harness) (**dsh**): standing orders for AI agents, an Agent Note decision-record tree, and documentation gates that run as commands. **Every rule in this template originates from dsh**; [UPSTREAM.md](UPSTREAM.md) maps each file to its dsh source and records the extraction baseline. Business code is deliberately absent — bring your own product; keep the governance.

It targets TypeScript + pnpm projects on Node ^22.19 || >=24.

## Quick start a new project

From your GitHub copy of this template repository (make it a template repo once, see below):

```sh
gh repo create my-app --template Luc-xz/vc-project-template --clone
cd my-app
node scripts/init.mjs my-app
```

Without the template feature, degit works the same:

```sh
npx degit Luc-xz/vc-project-template my-app
cd my-app
node scripts/init.mjs my-app
```

`init.mjs` stamps the project name into `package.json` and this README, commits (degit copies only), installs dependencies and lefthook hooks, and runs the gates once so the initialized tree is proven green. It uses only node: builtins, so it runs before `pnpm install`.

## What is inside

| Area | What it gives you |
|---|---|
| [AGENTS.md](AGENTS.md) | Standing orders agents read every session: conventions, decision rules, check policy, PR history rules |
| [.agents/notes/](.agents/notes/README.md) | Decision records with a lifecycle (proposed → implemented / rejected → archived), enforced file format, and a frozen archive sealed by content hashes |
| [.agents/skills/](.agents/skills/prose-standard/SKILL.md) | Four agent workflows: prose standard, chain-of-thought leakage trimming, stacked-PR landing, Agent Note archiving |
| [docs/AGENTS.md](docs/AGENTS.md) | Documentation standard: tier taxonomy (one home per fact), writing rules, slop checklist, word-count budgets |
| [scripts/](scripts/run-gates.ts) | Eight gates behind `pnpm run doc-sync` / `pnpm run test:docs`: markdown links, one-line paragraphs, doc budgets, doc references in code, blocked ambiguous labels, and three Agent Note gates |
| [lefthook.yml](lefthook.yml) | Pre-commit whitespace and archive checks; pre-push hook slot |

## Make it yours (after init)

1. Edit [AGENTS.md](AGENTS.md): keep the governance, add your project's domain rules, drop what does not apply.
2. Edit [scripts/governance-config.ts](scripts/governance-config.ts): Markdown/TypeScript scan globs, excluded prefixes, blocked ambiguous labels, required tracked areas.
3. Edit [scripts/doc-budgets.manifest.json](scripts/doc-budgets.manifest.json): budget your standing docs.
4. Fill in [docs/architecture.md](docs/architecture.md) with your system map.
5. Add a `CLAUDE.md` linking or copying `AGENTS.md` if your agent reads `CLAUDE.md` (on Windows, copy; symlinks need developer mode).

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

`pnpm run test:docs` is the fast subset for every push; `pnpm run doc-sync` runs everything.

## Publishing this template to GitHub

```sh
gh repo create vc-project-template --public --source=. --push
gh repo edit --template   # enables "Use this template" + --template cloning
```

## What was intentionally left out

The upstream dsh repository carries more machinery this template does not include, to keep a fresh project light: bilingual translation pairing, markdown TypeScript-fence compilation (`doc-typecheck`), export-JSDoc completeness, Mermaid validation, generated catalogs, and the documentation website projection. [UPSTREAM.md](UPSTREAM.md) maps every file to its source, so you can extract a piece deliberately when your project earns it.

MIT; see [LICENSE](LICENSE).
