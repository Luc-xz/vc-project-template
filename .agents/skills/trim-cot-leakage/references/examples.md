# Calibration examples

Distilled, current-state-safe examples for [prose-standard](../../prose-standard/SKILL.md) and [trim-cot-leakage](../SKILL.md). Extend this file with your project's own learned rules: after each genuine borderline decision, record the principle and both versions without PR history or reviewer narration.

## Prose standard

- **Complete proposition kept:** "Returns null when the lock is held by the current process" survives a trim; "Returns null sometimes" does not — the condition is the contract.
- **Rationale linked, not inlined:** a module comment states "cancellation propagates through the innermost stream; see docs/architecture.md" instead of re-deriving the cancellation design.
- **Diagnostics:** "verify-doc-budgets failed: docs/AGENTS.md: 1412 words exceeds the 1320-word ceiling" names subject, rule, and correction; "budget check had an issue" names nothing.

## Chain-of-thought leakage

- **Leaked:** "Used to retry twice; after the review discussion we changed it." → **Restated:** "Retries once; a second retry is unnecessary because the request id deduplicates on the server."
- **Leaked:** "(decision 7)" → **Restated:** cite the owning Agent Note by relative link, or delete the citation and state the fact.
- **Leaked:** "This PR adds a cache in front of the parser." → **Restated:** "A cache sits in front of the parser; invalidate it when grammar files change."
- **Kept (not leakage):** "TODO(alice): remove once #1470 lands" resolves at HEAD and carries a real obligation.

## Overcorrection traps

- Trimming "may not be called after dispose()" to "called after dispose()" flips an obligation into an endorsement.
- Trimming a hedge that marks a real bound ("typically under 50ms; measured 41ms") deletes evidence, not decoration.
