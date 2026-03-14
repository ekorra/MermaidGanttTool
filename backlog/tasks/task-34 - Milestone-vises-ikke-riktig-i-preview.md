---
id: TASK-34
title: Milestone vises ikke riktig i preview — alltid emit 0d, nullstill duration i UI
status: Done
assignee: []
created_date: '2026-03-14'
labels:
  - bug
  - export
dependencies:
  - TASK-25
---

## Description

Milestones vises kun som tekst i Mermaid-preview, ikke som diamant.
Årsak: `exportToMermaid()` sjekker `duration !== null` FØR milestone-sjekken.
Har en oppgave `status: 'milestone'` og `duration: '3d'` (standard), emitteres `3d` istedenfor `0d`.
Mermaid krever `0d` for å rendre diamantformen.

## Acceptance Criteria

- [ ] Milestones emitter alltid `0d` i Mermaid-syntaksen, uavhengig av `duration`-feltet
- [ ] Endring av status til `milestone` i detaljpanelet nullstiller `duration` og `endDate`
- [ ] Mermaid-preview viser diamant for alle milestone-oppgaver

## Definition of Done

- [ ] `src/model/export.ts`: milestone-sjekk flyttes øverst i duration-seksjonen
- [ ] `src/components/Editor/TaskDetailPanel.tsx`: status-endring til milestone nullstiller duration/endDate
- [ ] Enhetstest verifiserer at milestone med `duration: '3d'` fortsatt emitterer `0d`
- [ ] `npm run typecheck && npm run test:run` passes
- [ ] Committed og pushet
