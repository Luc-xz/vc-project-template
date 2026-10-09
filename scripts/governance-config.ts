/**
 * Central configuration for the governance gates. Adapt these values to your
 * repository when you initialize from this template; the gate scripts read
 * them so no scanning scope lives inside a gate implementation.
 */

import { resolve } from 'node:path'

/** Repository-root path shared by every gate. */
export const repoRoot: string = resolve(import.meta.dirname, '..')

/** Markdown sources checked by `verify-md-links` and `verify-md-wrap` (repo-relative globs). */
export const markdownPatterns: readonly string[] = [
  'README.md',
  'AGENTS.md',
  'docs/**/*.md',
  '.agents/notes/**/*.md',
  '.agents/skills/**/*.md',
]

/** TypeScript sources scanned by `verify-doc-refs` for root-relative doc citations. */
export const docRefPatterns: readonly string[] = [
  'scripts/**/*.ts',
  'src/**/*.ts',
  'packages/**/*.ts',
]

/** Path prefixes excluded from scans: vendored trees and frozen history. */
export const excludedPrefixes: readonly string[] = [
  'vendor/',
  '.agents/notes/archived/',
  'node_modules/',
]

/**
 * Ambiguous origin labels rejected by `verify-concrete-terms`. Each entry is a
 * lowercase substring matched after Unicode NFKC normalization, so agents name
 * the exact source, field, identity, or evidence instead of a vague label. The
 * shipped default is string-split so this file does not self-match; write your
 * own entries as plain strings.
 */
export const blockedTerms: readonly string[] = [
  'prove' + 'nance',
]

/**
 * Tracked-file areas that must exist, guarding `git ls-files` discovery: if
 * one is missing the gate crashes loudly instead of silently scanning less.
 */
export const requiredTrackedAreas: readonly string[] = [
  'AGENTS.md',
  'docs/',
  '.agents/notes/',
]

/**
 * Whether archived Agent Notes must form complete bilingual triplets
 * (`foo.md` + `foo.zh.md` + `foo.i18n.yaml`). The upstream repository pairs
 * every document; this template ships without the bilingual machinery, so the
 * archive validates single `foo.md` files unless you enable translation
 * pairing and set this to `true`.
 */
export const requireBilingualArchive = false
