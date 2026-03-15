---
id: TASK-49
title: 'Toolbar UX cleanup — icons, grouping, and settings reorganisation'
status: To Do
assignee: []
created_date: '2026-03-15 19:17'
labels: [ux, toolbar]
dependencies: []
---

## Description

The toolbar has grown organically and needs a cleanup. Buttons lack icons, grouping is
unclear, and settings are mixed with toolbar actions. Goal: a clean, scannable toolbar
where every button is self-explanatory at a glance.

## Changes

### Toolbar layout (left → right)

```
[GanttMaker] [title input] | [⚙ Settings] | [📋 Paste] [📤 Copy] | [↓ PNG] [🔗 Share] [Preview ▲] | [⚙ Settings] [? About]
```

1. **Mermaid group** — Paste Mermaid + Copy Mermaid side by side (clipboard actions)
2. **Export/share group** — Download PNG + Share + Preview toggle
3. **App group** — Settings + About pushed to the far right
   - About icon moves to the far right
   - Settings sits immediately left of About

### Icons

Every button gets a unicode/emoji icon + tooltip (`title` attribute already exists):
- Settings: ⚙ (already has it)
- About: ℹ (replace ?)
- Paste Mermaid: 📋
- Copy Mermaid: 📤
- Download PNG: ⬇
- Share: 🔗
- Light/Dark toggle: ☀ / 🌙 (already has it)
- Preview toggle: keep text + arrow

All buttons show a tooltip on hover explaining the action (via `title` attribute — already in place for most).

### Settings panel reorganisation

Move **light/dark mode toggle** out of the toolbar and into SettingsPanel as its own section,
visually separated from the Mermaid-specific settings (date format, axis format, etc.):

```
[ Appearance ]
  Theme: ○ Light  ● Dark  ○ System

[ Diagram settings ]
  Date format / Axis format / ...
```

Remove the standalone theme toggle button from the toolbar entirely.

## Acceptance Criteria

- [ ] Toolbar buttons are grouped: Mermaid actions | Export/share | App (settings + about)
- [ ] About (ℹ) is the rightmost button
- [ ] Settings (⚙) is immediately left of About
- [ ] Paste and Copy Mermaid are adjacent
- [ ] Every button has an icon and a descriptive tooltip
- [ ] Light/dark toggle is removed from toolbar and moved to SettingsPanel
- [ ] SettingsPanel has a clear visual separator between Appearance and Diagram settings

## Definition of Done

- [ ] Code implemented and TypeScript-clean
- [ ] Tests passing (`npm run typecheck && npm run test:run`)
- [ ] Committed and pushed
