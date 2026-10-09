# Calibration examples

Distilled, current-state-safe examples for [prose-standard](../SKILL.md). Extend this file with your project's own learned rules: after each genuine borderline decision, record the principle and both versions without PR history or reviewer narration.

## Complete proposition

- **Keep:** "Returns null when the lock is held by the current process." The condition, actor, and result are all contract.
- **Trim to death:** "Returns null sometimes." — deleting the condition deleted the contract.
- **Keep locally, link for depth:** a README states "requests time out after 30s with no retries; the retry policy and its config live in docs/architecture.md".

## Comments

- **Delete (code restatement):** `// increment count` above `count += 1`.
- **Keep (non-obvious contract):** `// The stream must be consumed to completion; abandoning it leaks the worker slot until GC drains the buffer.`
- **Keep (invariant):** `// Callers hold no lock here: this reentrantly acquires the registry lock.`

## Documentation tiers

- **Wrong home:** architecture.md explaining a module's config keys — that is the module README's contract.
- **Right home:** architecture.md names the module, its public interface, and links the README.

## Emphasis

- **Inflation:** "This is **critical**: you MUST never call this after dispose — it is **always** wrong."
- **Calibrated:** "Calling after dispose is undefined behavior; dispose releases the buffer." One emphasis, on the clause that changes behavior.
