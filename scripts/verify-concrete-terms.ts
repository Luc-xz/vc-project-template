/**
 * Reject ambiguous origin labels from maintained tracked files. Each blocked
 * term from `governance-config.ts` is matched case-insensitively after Unicode
 * NFKC normalization against tracked paths and their text lines; the fix is to
 * name the exact source, field, identity, or evidence instead.
 */

import { execFileSync } from 'node:child_process'
import { lstatSync, readFileSync, readlinkSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { blockedTerms, excludedPrefixes, repoRoot as root, requiredTrackedAreas } from './governance-config.ts'

/** One blocked term occurrence in a tracked path or text line. */
export interface ConcreteTermViolation {
  /** Repository-relative tracked path. */
  file: string
  /** One-based source line, or null when the path contains the term. */
  line: number | null
}

function isExcluded(file: string): boolean {
  return excludedPrefixes.some(prefix => file.startsWith(prefix))
}

function containsBlockedTerm(value: string): string | undefined {
  const normalized = value.normalize('NFKC').toLowerCase()
  return blockedTerms.find(term => normalized.includes(term))
}

/**
 * Find blocked terms in one maintained tracked file.
 * @param file - repository-relative tracked path.
 * @param source - text contents or symlink target.
 * @returns violations outside configured vendored trees and frozen Agent Notes.
 */
export function findConcreteTermViolations(file: string, source: string): ConcreteTermViolation[] {
  if (isExcluded(file)) return []
  const violations: ConcreteTermViolation[] = []
  const pathMatch = containsBlockedTerm(file)
  if (pathMatch !== undefined) violations.push({ file, line: null })
  const lines = source.split(/\r?\n/u)
  for (const [index, line] of lines.entries()) {
    if (containsBlockedTerm(line) !== undefined) violations.push({ file, line: index + 1 })
  }
  return violations
}

function trackedFiles(repoRoot: string): string[] {
  const files = execFileSync('git', ['ls-files', '-z'], { cwd: repoRoot, encoding: 'utf8' })
    .split('\0')
    .filter(file => file !== '')
  for (const area of requiredTrackedAreas) {
    const present = area.endsWith('/') ? files.some(file => file.startsWith(area)) : files.includes(area)
    if (!present) {
      throw new Error(`verify-concrete-terms: tracked-file discovery omitted a required repository area: ${area}`)
    }
  }
  return files
}

/**
 * Read one tracked file without following a symlink to its target.
 * @param repoRoot - Repository root containing the tracked path.
 * @param file - Repository-relative tracked path.
 * @returns File text, the symlink target, or undefined when the path is absent or not a file.
 */
export function readTrackedSource(repoRoot: string, file: string): string | undefined {
  const path = resolve(repoRoot, file)
  const stat = lstatSync(path, { throwIfNoEntry: false })
  if (stat === undefined) return undefined
  if (stat.isSymbolicLink()) return readlinkSync(path)
  return stat.isFile() ? readFileSync(path, 'utf8') : undefined
}

function scanRepository(repoRoot: string): { violations: ConcreteTermViolation[]; scanned: number } {
  const violations: ConcreteTermViolation[] = []
  const files = trackedFiles(repoRoot)
  for (const file of files) {
    const source = readTrackedSource(repoRoot, file)
    if (source === undefined) continue
    violations.push(...findConcreteTermViolations(file, source))
  }
  return { violations, scanned: files.length }
}

const invokedPath = process.argv[1]
const isMain = invokedPath !== undefined && import.meta.url === pathToFileURL(resolve(invokedPath)).href
if (isMain) {
  const { violations, scanned } = scanRepository(root)
  if (violations.length === 0) {
    console.log(`verify-concrete-terms: ${scanned} tracked file(s) contain no blocked term.`)
  } else {
    console.error('verify-concrete-terms: blocked ambiguous origin label(s) found; name the exact source, field, identity, or evidence:')
    for (const violation of violations) {
      console.error(violation.line === null
        ? `  ${violation.file} (path)`
        : `  ${violation.file}:${String(violation.line)}`)
    }
    process.exitCode = 1
  }
}
