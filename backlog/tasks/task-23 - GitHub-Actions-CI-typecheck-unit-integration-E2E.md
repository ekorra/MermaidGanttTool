---
id: TASK-23
title: 'GitHub Actions CI: typecheck + unit + integration + E2E'
status: Done
assignee: []
created_date: '2026-03-13 08:15'
updated_date: '2026-03-13 10:00'
labels:
  - phase-6
  - ci
dependencies: []
---

## Description

GitHub Actions workflow that runs on every push and pull request to `main`. Ensures the codebase always typechecks, all tests pass, and the production build succeeds.

## Acceptance Criteria

- [x] Triggers on `push` and `pull_request` to `main`
- [x] Steps: install deps → typecheck → unit+integration tests → build → E2E tests
- [x] Playwright report uploaded as artifact on failure
- [x] Uses Node.js 20 (LTS)
- [x] Caches `node_modules` for speed

## Definition of Done

- [x] `.github/workflows/ci.yml` present
- [x] CI passes on `main` branch (green checkmark)
