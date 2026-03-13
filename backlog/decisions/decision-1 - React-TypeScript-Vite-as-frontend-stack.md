---
id: decision-1
title: React + TypeScript + Vite as frontend stack
date: '2026-03-13'
status: accepted
---
## Context

Needed a frontend stack for a WYSIWYG Gantt editor web app. The app is open source and may attract external contributors. A future port to a browser extension was also a consideration.

Candidates considered: React + TypeScript, Vue 3 + TypeScript, Vanilla TypeScript.

## Decision

Use React 19 + TypeScript + Vite 5 as the frontend stack.

## Rationale

- Largest contributor community among the options — important for an open source project
- Best ecosystem for complex interactive UIs (hooks, dnd-kit, React Testing Library)
- Vite produces a static bundle with `base: './'`, which is directly compatible with browser extension packaging
- TypeScript with `strict: true` and `noUncheckedIndexedAccess` catches bugs early given the array-heavy data model

## Consequences

- Contributors need React knowledge (positive: large pool)
- Vue developers cannot contribute without learning React (acceptable trade-off)
- Browser extension port requires no architectural changes — only a manifest.json and build script change
