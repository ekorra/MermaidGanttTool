---
id: TASK-50
title: Pre-filled GitHub issue links in Info panel
status: To Do
assignee: []
created_date: '2026-03-15 19:24'
labels: [ux, feedback]
dependencies: []
---

## Description

The Info panel currently has a generic "Report a bug or suggestion" link to the GitHub
issues page. Replace it with two distinct links that open pre-filled issue templates,
lowering the friction for users to report bugs or suggest features.

## Changes

Replace the single link with two:

- **Report a bug** →
  `https://github.com/ekorra/MermaidGanttTool/issues/new?labels=bug&template=bug_report.md&title=[Bug]+`
- **Suggest a feature** →
  `https://github.com/ekorra/MermaidGanttTool/issues/new?labels=enhancement&template=feature_request.md&title=[Feature]+`

Also add two GitHub issue templates to the repo:
- `.github/ISSUE_TEMPLATE/bug_report.md`
- `.github/ISSUE_TEMPLATE/feature_request.md`

## Acceptance Criteria

- [ ] Info panel shows two separate links: "Report a bug" and "Suggest a feature"
- [ ] Each link opens a pre-filled GitHub issue with the correct label and title prefix
- [ ] `.github/ISSUE_TEMPLATE/bug_report.md` exists with basic reproduction steps template
- [ ] `.github/ISSUE_TEMPLATE/feature_request.md` exists with basic feature description template
- [ ] Links translated in all four locales (en/no/es/de)

## Definition of Done

- [ ] Code implemented and TypeScript-clean
- [ ] Tests passing (`npm run typecheck && npm run test:run`)
- [ ] Committed and pushed
