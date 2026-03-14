---
id: TASK-33
title: Skjul/vis preview — kollapset som standard, justerbar høyde
status: Done
assignee: []
created_date: '2026-03-14'
labels:
  - ux
  - layout
dependencies: []
---

## Description

Preview-panelet (bunnen) skal være skjult som standard og vises/skjules via en knapp. Når det vises kan brukeren dra i den øverste kanten for å justere høyden.

## Acceptance Criteria

- [ ] Preview er skjult (0px) som standard ved oppstart
- [ ] Knapp i toolbar (f.eks. "Preview ▲/▼") viser/skjuler preview
- [ ] Standard høyde når preview åpnes: 280px
- [ ] Dra-håndtak på toppen av preview-panelet — dra opp/ned endrer høyden
- [ ] Minimumshøyde: 120px, maksimumshøyde: 60% av vinduet
- [ ] Høyden huskes i `localStorage` mellom besøk
- [ ] Åpne/lukket tilstand huskes i `localStorage`

## Definition of Done

- [ ] `previewOpen` og `previewHeight` styres fra `App.tsx`
- [ ] Resize-logikk via pointer events på topp-kanten av preview
- [ ] `npm run typecheck && npm run test:run` passes
- [ ] Committed og pushet
