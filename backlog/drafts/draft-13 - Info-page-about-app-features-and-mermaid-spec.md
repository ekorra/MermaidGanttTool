---
id: DRAFT-13
title: Info page — app features, limitations, and Mermaid.js links
status: Draft
created_date: '2026-03-14'
labels:
  - ux
  - docs
  - exploration
---

## Idea

An information/help page accessible from the app (e.g. via a ? button in the toolbar) that explains:
- What the app does and its key features
- Current limitations (color is UI-only, no import yet, etc.)
- Benefits of using Mermaid.js for diagrams
- Links to the Mermaid.js spec and project

## Open questions

- Should this be a modal overlay, a slide-in panel, or a separate route?
- Since the app is static with no router, a modal or collapsible panel is simpler
- Should the page be rendered from a markdown file (easier to maintain) or JSX?
- How much content? Short (one scroll) vs. detailed reference?

## Suggested content structure

1. **Hva er MermaidGanttTool?** — kort beskrivelse
2. **Funksjoner** — visuell redigering, drag/resize, avhengigheter, farger, eksport
3. **Begrensninger** — farger er kun visuelt (ikke i Mermaid-output), ingen import ennå
4. **Fordeler med Mermaid.js** — tekst som diagram, versjonskontroll-vennlig, støttes av GitHub/GitLab/Confluence
5. **Lenker** — Mermaid.js spec, prosjekt på GitHub, issues
