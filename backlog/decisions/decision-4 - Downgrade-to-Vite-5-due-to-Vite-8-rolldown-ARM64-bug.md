---
id: decision-4
title: Downgrade to Vite 5 due to Vite 8 rolldown ARM64 bug
date: '2026-03-13'
status: accepted
---
## Context

Project was initially scaffolded with Vite 8.0.0 (latest at time of setup). Vite 8 uses rolldown as its bundler, which requires a native binary (`@rolldown/binding-darwin-arm64`). This binary was not installed correctly due to a known npm optional dependency bug (https://github.com/npm/cli/issues/4828). The bug persisted even after removing node_modules and package-lock.json and reinstalling.

## Decision

Downgrade to Vite 5 (stable, LTS) with the matching `@vitejs/plugin-react@4`.

## Rationale

Vite 5 is the current stable LTS release, widely used in production, and does not depend on native binaries. The rolldown issue in Vite 8 is an npm bug that may affect other developers on macOS ARM64.

## Consequences

- All Vite 5 features are sufficient for this project's needs
- Can be upgraded to Vite 6/7/8 in the future once the rolldown ARM64 issue is resolved upstream
- Developers on x86 machines would likely not hit this issue — worth documenting for reproducibility
