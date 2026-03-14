---
id: TASK-35
title: Deploy til Vercel med automatisk deploy på push
status: To Do
assignee: []
created_date: '2026-03-14'
labels:
  - devops
  - deployment
dependencies: []
---

## Description

Sett opp Vercel-deploy for appen slik at den er tilgjengelig på en offentlig URL. Vercel kobles til GitHub-repoet og deployer automatisk ved push til `main`. Hver PR får en egen preview-URL.

`base: './'` i `vite.config.ts` er allerede konfigurert for statisk hosting.

## Acceptance Criteria

- [ ] Appen er tilgjengelig på en offentlig Vercel-URL (f.eks. `mermaid-gantt-tool.vercel.app`)
- [ ] Push til `main` → automatisk produksjonsdeploy
- [ ] Pull requests får automatisk preview-URL i PR-kommentaren
- [ ] Build-kommando: `npm run build`, output-katalog: `dist`
- [ ] `vite.config.ts` har `base: './'` (allerede satt)
- [ ] README oppdateres med lenke til live demo

## Definition of Done

- [ ] Vercel-prosjekt opprettet og koblet til GitHub-repoet
- [ ] Produksjons-URL fungerer og laster appen
- [ ] Automatisk deploy verifisert ved en test-push
- [ ] README oppdatert med live demo-lenke
- [ ] Committed og pushet

## Steg (manuelt i Vercel-dashboardet)

1. Gå til vercel.com → «Add New Project»
2. Importer `ekorra/MermaidGanttTool` fra GitHub
3. Framework: **Vite**
4. Build command: `npm run build`
5. Output directory: `dist`
6. Trykk Deploy
