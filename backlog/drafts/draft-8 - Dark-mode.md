---
id: DRAFT-8
title: Dark mode — systempreferanse + manuell toggle
status: Draft
created_date: '2026-03-13 08:29'
updated_date: '2026-03-14'
labels:
  - ux
  - theme
dependencies: []
---

## Beskrivelse

Legg til dark mode for hele appen. Tidslinjen (Canvas) er allerede mørk (`#1a1a2e`). Det som mangler er at resten av UI-et — toolbar, oppgaveliste, detaljpanel, innstillinger og preview — følger et mørkt tema.

## Tilnærming: CSS custom properties

All fargebruk i UI-et går allerede gjennom CSS-variabler i `:root` (`global.css`). Dark mode implementeres ved å legge til et sett med overstyringer under `[data-theme="dark"]` på `<html>`-elementet. Ingen komponentendringer er nødvendig — kun CSS og en toggle-mekanisme.

**Unntaket:** Canvas har hardkodede konstantfarvger (`CANVAS_BG`, `GRID_COLOR` etc.). Disse er allerede mørke og fungerer bra i begge modi. De trenger ikke endres, men `SECTION_TEXT_COLOR` og `GRID_COLOR` kan justeres for dark mode via CSS-variabler hvis de legges inn som variabler.

## Fargepalett

### Lys (nåværende)
| Variabel              | Verdi     | Brukt til                  |
|-----------------------|-----------|---------------------------|
| `--color-bg`          | `#f8f9fa` | Sidens bakgrunn            |
| `--color-surface`     | `#ffffff` | Kort, panel, toolbar       |
| `--color-border`      | `#dee2e6` | Kanter, skillelinjer       |
| `--color-text`        | `#212529` | Primærtekst                |
| `--color-text-muted`  | `#6c757d` | Sekundærtekst, labels      |
| `--color-primary`     | `#4361ee` | Knapper, valgt tilstand    |
| `--color-primary-hover`| `#3451d1`| Hover på primærknapper     |

### Mørk (forslag)
| Variabel              | Verdi     | Begrunnelse                |
|-----------------------|-----------|---------------------------|
| `--color-bg`          | `#13131f` | Dypere enn canvas (`#1a1a2e`) — tydelig hierarki |
| `--color-surface`     | `#1e1e2e` | Samme som SyntaxPane — konsistent |
| `--color-border`      | `#313244` | Subtil, ikke for sterk kontrast |
| `--color-text`        | `#cdd6f4` | Catppuccin Latte — ikke ren hvit, behagelig å lese |
| `--color-text-muted`  | `#6c7086` | Dempet versjon            |
| `--color-primary`     | `#89b4fa` | Lysere blå — god kontrast mot mørk bg |
| `--color-primary-hover`| `#74c7ec`| Litt lysere/kaldere ved hover |

Fargepaletten følger [Catppuccin Mocha](https://catppuccin.com/) som allerede er i bruk i `SyntaxPane` (`#1e1e2e` / `#cdd6f4`). Dette gir visuell konsistens.

## Hardkodede farger som må addresseres

Følgende er ikke CSS-variabler og må enten beholdes (allerede mørke) eller flyttes til variabler:

| Fil | Konstant/verdi | Handling |
|-----|---------------|---------|
| `Canvas.tsx` | `CANVAS_BG = '#1a1a2e'` | Beholdes — allerede mørk, fungerer i begge modi |
| `Canvas.tsx` | `SECTION_BG = 'rgba(255,255,255,0.04)'` | Beholdes — alfa-basert, skalerer naturlig |
| `Canvas.tsx` | `GRID_COLOR = 'rgba(255,255,255,0.07)'` | Beholdes |
| `Canvas.tsx` | `SECTION_TEXT_COLOR = 'rgba(255,255,255,0.4)'` | Beholdes |
| `Canvas.tsx` | `TODAY_COLOR = '#ff6b6b'` | Beholdes — samme i begge modi |
| `MilestoneMarker.tsx` | `STATUS_COLORS` | Beholdes — oppgavefarger er designvalg, ikke tema |
| `SyntaxPane.tsx` | `#1e1e2e` / `#cdd6f4` | Beholdes — dette er editor-tema, ikke UI-tema |
| `TaskDetailPanel.tsx` | `#dc3545` (slett-knapp) | Beholdes — semantisk rød |
| `SettingsPanel.tsx` | `rgba(0,0,0,0.45)` (backdrop) | Beholdes — alltid mørk overlay |

**Konklusjon:** Kun CSS-variablene i `global.css` trenger endres. Ingen komponentkode endres.

## Toggle-mekanisme

### Alternativ A: Følg systempreferanse (`prefers-color-scheme`)
- Ingen toggle nødvendig — appen tilpasser seg OS-innstillingen automatisk
- Enklest å implementere: ett CSS media query
- Ulempe: brukeren kan ikke overstyre i appen

### Alternativ B: Manuell toggle med localStorage
- Knapp i toolbar (sol/måne-ikon ☀/🌙)
- Standard: følg systempreferanse (`prefers-color-scheme`)
- Overstyring lagres i `localStorage`
- Sett `data-theme` på `<html>` via JavaScript

### Anbefaling: Alternativ B
Start med systempreferanse, la brukeren overstyre. Dette er standard UX-pattern for 2024+.

```
Standard: OS dark → data-theme="dark"
Standard: OS light → ingen data-theme
Manuell: bruker trykker toggle → setter data-theme motsatt og lagrer i localStorage
```

## Implementasjonsplan

### 1. `src/styles/global.css`
Legg til dark mode-variabler:
```css
@media (prefers-color-scheme: dark) {
  :root { /* dark values */ }
}
[data-theme="dark"] {
  /* same dark values — for manual override */
}
[data-theme="light"] {
  /* force light values even if OS is dark */
}
```

### 2. `src/utils/theme.ts` (ny fil)
```typescript
export function initTheme(): void   // leses fra localStorage, setter data-theme
export function toggleTheme(): void // bytter tema og lagrer
export function getTheme(): 'light' | 'dark' | 'system'
```

### 3. `src/components/shared/Toolbar.tsx`
Legg til en knapp for tema-toggle (☀/🌙 avhengig av aktivt tema).

### 4. `index.html`
Kall `initTheme()` i et inline `<script>` i `<head>` for å unngå FOUC (flash of unstyled content).

## Acceptance Criteria (forslag til task)

- [ ] Mørkt tema aktiveres automatisk når OS-innstillingen er mørk
- [ ] Toggle-knapp i toolbar lar brukeren overstyre (☀ = bytt til lys, 🌙 = bytt til mørk)
- [ ] Valg lagres i `localStorage` og huskes ved neste besøk
- [ ] Ingen FOUC — tema settes i `<head>` før render
- [ ] Alle CSS-variabler er korrekte i mørkt tema
- [ ] Canvas er visuelt konsistent i begge modi (allerede mørk)
- [ ] SyntaxPane (allerede mørk) er konsistent
- [ ] Ingen hardkodede farger som bryter temaet

## Åpne spørsmål

- Skal status-badges i oppgavelisten (`#d1f5e0` / `#1a7a3c` etc.) ha egne mørke-varianter, eller er de OK som de er?
- Bør `PRESET_COLORS`-swatchene i fargevelgeren justere border-farge i mørkt tema?
- Ønsker brukeren kun system+override, eller også en "følg alltid system"-setting?
