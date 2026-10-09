/**
 * Bounded-concurrency gate runner for the documentation-governance modes.
 * `doc-sync` runs every gate; `doc-quick` (wired as `pnpm run test:docs`) runs
 * the build-free subset flagged `quick: true`. Gates are leaves invoked through
 * their package.json scripts, so `pnpm run <script>` stays the single entry.
 */

import { spawn } from 'node:child_process'
import { availableParallelism } from 'node:os'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

type Mode = 'doc-sync' | 'doc-quick'

/** One runnable governance gate. */
interface Gate {
  id: string
  label: string
  /** package.json script name invoked by the runner. */
  script: string
  /** Include this gate in the build-free `doc-quick` aggregate. */
  quick: boolean
}

function gate(id: string, label: string, script: string, quick: boolean): Gate {
  return { id, label, script, quick }
}

const GATES: readonly Gate[] = [
  gate('markdown-links', 'markdown links', 'verify-md-links', true),
  gate('markdown-wrap', 'markdown wrap', 'verify-md-wrap', true),
  gate('doc-budgets', 'doc budgets', 'verify-doc-budgets', true),
  gate('doc-refs', 'doc refs', 'verify-doc-refs', true),
  gate('concrete-terms', 'concrete terms', 'verify-concrete-terms', true),
  gate('agent-note-classification', 'agent note classification', 'verify-agent-note-classification', true),
  gate('agent-note-format', 'agent note format', 'verify-agent-note-format', true),
  gate('archived-agent-notes', 'archived agent notes', 'verify-archived-agent-notes', true),
]

interface GateResult {
  gate: Gate
  status: 'passed' | 'failed'
  durationMs: number
  tail: string[]
}

function parseMode(raw: string | undefined): Mode {
  if (raw === 'doc-sync' || raw === 'doc-quick') return raw
  console.error(`run-gates: expected mode doc-sync | doc-quick, got ${JSON.stringify(raw ?? '<none>')}`)
  process.exit(1)
}

function runGate(g: Gate): Promise<GateResult> {
  const started = Date.now()
  return new Promise((resolveGate) => {
    // shell: true resolves pnpm.cmd on Windows; the argument list is repo-owned.
    const child = spawn('pnpm', ['run', g.script], { shell: true, stdio: ['ignore', 'pipe', 'pipe'] })
    const tail: string[] = []
    const collect = (chunk: Buffer): void => {
      for (const line of chunk.toString('utf8').split('\n')) {
        if (line.trim() !== '') tail.push(line)
        if (tail.length > 12) tail.shift()
      }
    }
    child.stdout?.on('data', collect)
    child.stderr?.on('data', collect)
    child.on('error', (error) => {
      resolveGate({ gate: g, status: 'failed', durationMs: Date.now() - started, tail: [String(error)] })
    })
    child.on('close', (code) => {
      resolveGate({
        gate: g,
        status: code === 0 ? 'passed' : 'failed',
        durationMs: Date.now() - started,
        tail,
      })
    })
  })
}

async function main(mode: Mode): Promise<number> {
  const selected = mode === 'doc-quick' ? GATES.filter(g => g.quick) : [...GATES]
  const workers = Math.min(4, availableParallelism())
  console.log(`run-gates: ${selected.length} gate(s) selected for ${mode}, ${workers} worker(s).`)

  const results: GateResult[] = []
  let cursor = 0
  async function worker(): Promise<void> {
    while (cursor < selected.length) {
      const g = selected[cursor]
      cursor += 1
      const result = await runGate(g)
      results.push(result)
      const mark = result.status === 'passed' ? 'PASS' : 'FAIL'
      console.log(`  ${mark}  ${result.gate.label}  (${result.durationMs}ms)`)
    }
  }
  await Promise.all(Array.from({ length: Math.min(workers, selected.length) }, () => worker()))

  const failed = results.filter(r => r.status === 'failed')
  for (const result of failed) {
    console.error(`\n${result.gate.label} failed:`)
    for (const line of result.tail) console.error(`  ${line}`)
  }
  console.log(`run-gates: ${results.length - failed.length}/${results.length} gate(s) passed.`)
  return failed.length === 0 ? 0 : 1
}

const invokedPath = process.argv[1]
const isMain = invokedPath !== undefined && import.meta.url === pathToFileURL(resolve(invokedPath)).href
if (isMain) {
  process.exit(await main(parseMode(process.argv[2])))
}
