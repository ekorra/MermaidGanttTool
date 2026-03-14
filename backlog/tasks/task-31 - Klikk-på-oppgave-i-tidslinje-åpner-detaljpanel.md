---
id: TASK-31
title: Klikk på oppgave i tidslinje åpner detaljpanel
status: Done
assignee: []
created_date: '2026-03-14'
labels:
  - ux
  - canvas
dependencies:
  - TASK-24
  - TASK-27
---

## Description

Detaljpanelet åpnes nå kun ved klikk i oppgavelisten (venstre). Det skal også åpnes når brukeren klikker på en oppgave direkte i tidslinjen (midtre panel, SVG-canvas).

**Terminologi for panelene:**
- Venstre: Oppgaveliste (`TaskList`)
- Midtre: Tidslinje (`Canvas`)
- Høyre: Detaljpanel (`TaskDetailPanel`)

## Acceptance Criteria

- [ ] Klikk på en oppgavebar i tidslinjen → detaljpanelet åpnes med riktig oppgave
- [ ] Klikk på en milestone-markør i tidslinjen → detaljpanelet åpnes
- [ ] Valgt oppgave markeres i oppgavelisten (samme `selectedTaskId`)
- [ ] Klikk på samme oppgave igjen lukker detaljpanelet (toggle)
- [ ] Drag/resize skal ikke trigge klikk (klikk kun hvis ingen drag har skjedd)

## Definition of Done

- [ ] `Canvas` tar imot `selectedTaskId` og `onSelectTask` som props
- [ ] `TaskBar` og `MilestoneMarker` kaller `onSelectTask` ved klikk
- [ ] Drag-terskel (>4px) forhindrer at drag registreres som klikk
- [ ] `npm run typecheck && npm run test:run` passes
- [ ] Committed og pushet
