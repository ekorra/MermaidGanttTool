---
id: TASK-51
title: Replace emoji icons with Material Symbols (Google Fonts)
status: Done
assignee: []
created_date: '2026-03-16 06:23'
updated_date: '2026-03-16 07:36'
labels:
  - ux
  - icons
dependencies: []
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Replace the ad-hoc emoji icons in the toolbar with Material Symbols Outlined
from Google Fonts (see decision-8). Buttons should show **icon only** — no
visible label text. The existing `title` attribute provides the tooltip on hover.

### Setup

Add to `index.html` `<head>`:
```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
```

Render icons with:
```html
<span class="material-symbols-outlined" style={{ fontSize: 20 }}>icon_name</span>
```

### Icon mapping

| Button | Current | Material Symbol |
|--------|---------|-----------------|
| Paste Mermaid | 📋 + text | `content_paste` |
| Copy Mermaid | 📤 + text | `content_copy` |
| Download PNG | ⬇ + text | `download` |
| Share | 🔗 + text | `share` |
| Preview (open) | text + ▼ | `preview` |
| Preview (closed) | text + ▲ | `preview` (with inactive style) |
| Settings | ⚙ | `settings` |
| About/Info | ℹ | `info` |

### Visual spec

- Icon size: 20px (`font-size: 20`)
- Button padding: keep current (`5px 10px`)
- No label text rendered in the button — icon only
- Tooltip: existing `title` attribute on each button
- Hover border highlight: keep existing behavior
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 `index.html` loads Material Symbols Outlined from Google Fonts CDN
- [ ] #2 All toolbar buttons show only an icon — no visible text label
- [ ] #3 Icon mapping matches the table above
- [ ] #4 Hovering a button shows the action name via `title` tooltip
- [ ] #5 `aria-label` attributes are preserved on all icon buttons
- [ ] #6 Buttons look correct in both light and dark mode
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Code implemented and TypeScript-clean
- [ ] #2 Tests passing (`npm run typecheck && npm run test:run`)
- [ ] #3 Committed and pushed
<!-- DOD:END -->
