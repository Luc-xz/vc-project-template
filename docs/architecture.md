# Architecture

Replace this placeholder with the ordered map of your system: composition, core modules, and extension points. Agents and maintainers read this before changing source, so it must state the current layout, not the plan.

Suggested sections:

## Composition

How the running system is assembled at startup: which modules load, in what order, and how configuration selects between variants.

## Core modules

One line per module: what it owns and where its public interface lives. Link each module's README for the detailed contract; keep type definitions and per-module detail out of this page.

## Extension points

A table mapping a goal ("add a provider for X", "intercept a request", "add a command") to the mechanism that carries it. New behavior attaches to a documented extension point; changing the core loop requires updating this page in the same change.

## Where decisions live

Link the [Agent Notes](../.agents/notes/README.md) tree for rationale and alternatives; this page states only what is.
