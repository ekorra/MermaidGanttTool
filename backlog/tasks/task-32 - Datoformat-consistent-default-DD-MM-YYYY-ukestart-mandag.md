---
id: TASK-32
title: Datoformat — konsistent format, default DD-MM-YYYY, ukestart mandag
status: Done
assignee: []
created_date: '2026-03-14'
labels:
  - model
  - export
  - settings
dependencies:
  - TASK-30
---

## Description

Datoformat for diagrammet og oppgaver må være konsistente og styres av `dateFormat` i innstillinger.

Nøkkelregel: **interne task-datoer lagres alltid som `YYYY-MM-DD` (ISO)**. 
`exportToMermaid()` konverterer til valgt `dateFormat` ved eksport.
Dette sikrer at `<input type="date">` (som alltid gir ISO) og canvas-logikk alltid fungerer uavhengig av brukerens valg.

Standardverdier endres til:
- `dateFormat: 'DD-MM-YYYY'` (var `YYYY-MM-DD`)
- `weekday: 'monday'` (var `null`)

## Acceptance Criteria

- [ ] Interne datoer lagres alltid som `YYYY-MM-DD`
- [ ] `exportToMermaid()` konverterer `startDate`/`endDate` til `chart.dateFormat` i output
- [ ] `dateFormat: 'DD-MM-YYYY'` er ny default i `createChart()`
- [ ] `weekday: 'monday'` er ny default i `createChart()`
- [ ] Bytte `dateFormat` i innstillinger → Mermaid-syntaksen oppdateres umiddelbart
- [ ] Canvas og `resolveTaskPositions()` er upåvirket (bruker alltid ISO internt)
- [ ] Eksisterende localStorage-data (ISO-datoer) fortsetter å fungere uten migrering

## Definition of Done

- [ ] `src/model/defaults.ts` oppdatert med nye standardverdier
- [ ] `src/model/export.ts` konverterer datoer på eksport
- [ ] Enhetstest for `exportToMermaid()` verifiserer alle tre datoformater
- [ ] `npm run typecheck && npm run test:run` passes
- [ ] Committed og pushet
