---
id: DRAFT-12
title: Feedback button — bug report or improvement, optionally create GitHub issue
status: Draft
created_date: '2026-03-14'
labels:
  - ux
  - exploration
---

## Idea

Add a feedback button in the app that lets the user report a bug or suggest an improvement. The user selects a type (Bug / Forbedring) and writes a message. The question to explore is whether this can automatically create a GitHub issue.

## Open questions

- **GitHub issue creation**: The GitHub API requires authentication. Options:
  1. Deep link: open `https://github.com/ekorra/MermaidGanttTool/issues/new?template=...&body=...` — no auth needed, user submits it themselves
  2. Formspree / similar form service — submits to a backend that creates the issue
  3. GitHub App / OAuth flow — complex for a static site
  - Option 1 is the simplest and fits the static-frontend constraint
- Should the form pre-fill the issue body with app version, browser, and current chart title?
- Should there be separate issue templates for Bug vs. Improvement?

## Exploration needed

- Define the GitHub issue templates (`.github/ISSUE_TEMPLATE/`) for bug and improvement
- Decide on deep-link vs. form service approach
- Check URL length limits for pre-filled issue body (GitHub truncates very long URLs)
