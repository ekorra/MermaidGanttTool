---
id: DRAFT-14
title: Buy Me a Coffee — support link for the developer
status: Draft
created_date: '2026-03-14'
labels:
  - monetization
  - exploration
---

## Idea

Add a "Buy Me a Coffee" button/link that lets users support the developer. Link: https://buymeacoffee.com/

## Open questions

- Where should the link appear? Options:
  1. Small button in the toolbar (e.g. ☕ icon, far right)
  2. In the info page (DRAFT-13)
  3. In the README only (no in-app button)
  4. Footer below the preview pane
- Should it use the official Buy Me a Coffee widget/button or just a plain link?
- The official widget loads external JS — acceptable tradeoff for a static app?

## Exploration needed

- Check Buy Me a Coffee's embedding options (badge image vs. JS widget)
- Decide on placement — toolbar is most visible but adds clutter
- A simple image badge (`<a href="..."><img src="bmc-badge.png"/></a>`) avoids external JS
