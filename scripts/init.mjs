#!/usr/bin/env node
/**
 * One-shot project initializer. Run from a fresh copy of this template,
 * before `pnpm install` (uses only node: builtins):
 *
 *   node scripts/init.mjs <project-name>
 *
 * It stamps the project name into package.json and README, installs
 * dependencies (which also installs the lefthook git hooks), and runs the
 * governance gates once so the initialized tree is proven green.
 */

import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const repoRoot = resolve(import.meta.dirname, '..')
const name = process.argv[2]
if (name === undefined || !/^[a-z0-9][a-z0-9._-]*$/.test(name)) {
  console.error('usage: node scripts/init.mjs <project-name>  (lowercase npm-style name)')
  process.exit(1)
}

function replaceIn(file, from, to) {
  const path = resolve(repoRoot, file)
  const before = readFileSync(path, 'utf8')
  const after = before.split(from).join(to)
  if (after !== before) writeFileSync(path, after)
}

replaceIn('package.json', '"name": "vc-project-template"', `"name": "${name}"`)
replaceIn('README.md', '# vc-project-template', `# ${name}`)

function run(title, command, args) {
  console.log(`\n== ${title}`)
  const result = spawnSync(command, args, { cwd: repoRoot, shell: true, stdio: 'inherit' })
  if (result.status !== 0) {
    console.error(`init: ${title} failed (exit ${result.status}); fix and re-run the remaining steps manually.`)
    process.exit(result.status ?? 1)
  }
}

if (!existsSync(resolve(repoRoot, '.git'))) {
  // A GitHub-template clone already carries git; a degit copy does not.
  // verify-concrete-terms reads tracked files, so the first commit must exist.
  run('git init + first commit', 'git', ['init -b master && git add -A && git commit -m "chore: initialize from vc-project-template"'])
}

run('pnpm install (also installs lefthook hooks)', 'pnpm', ['install'])
run('governance gates (test:docs)', 'pnpm', ['run', 'test:docs'])

console.log(`
Initialized ${name}. The gates are green. Make the governance yours next:

  1. AGENTS.md                  — keep the rules, add your domain conventions
  2. scripts/governance-config.ts — scanning globs, exclusions, blocked terms
  3. scripts/doc-budgets.manifest.json — word ceilings for your standing docs
  4. docs/architecture.md       — replace the placeholder with your system map

Rules originate from deepseek-harness (dsh); UPSTREAM.md maps every file.
`)
