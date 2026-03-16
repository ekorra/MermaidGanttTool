---
id: decision-8
title: Bruk Material Symbols (Google Fonts) for ikonbibliotek
date: '2026-03-16 06:19'
status: accepted
---
## Context

The toolbar uses ad-hoc Unicode emoji and symbols (📋, 📤, ⬇, ⚙, ?) as icons.
Emoji rendering varies across OS and browser, sizes are inconsistent, and the
visual style is informal and unpolished.

A proper icon library gives a consistent, professional look and is aligned with
modern web UI standards. Material Symbols (the variable-font successor to
Material Icons) is available for free via Google Fonts, covers all the icons
needed in this app, and requires no npm dependency — just a single `<link>` tag.

Reference: https://m3.material.io/styles/icons/overview
Icon browser: https://fonts.google.com/icons

## Decision

Use **Material Symbols Outlined** (Google Fonts) as the icon library for all
toolbar and UI icon buttons.

Load via CDN in `index.html`:
```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
```

Render icons with ligature syntax:
```html
<span class="material-symbols-outlined">settings</span>
```

Icon mapping for toolbar buttons:
| Button | Icon name |
|--------|-----------|
| Paste Mermaid | `content_paste` |
| Copy Mermaid | `content_copy` |
| Download PNG | `download` |
| Share | `share` |
| Preview toggle | `preview` / `preview_off` (or `expand_more`/`expand_less`) |
| Settings | `settings` |
| About/Info | `info` |

Buttons show **icon only**; the existing `title` attribute provides the tooltip
on hover — no visible label text.

## Consequences

- Consistent, professional icon style across all buttons
- Icons scale cleanly at any size (variable font)
- Requires internet access to load font on first visit (CDN); icons fall back to
  text ligature (e.g. "settings") if font fails to load
- No npm dependency added — zero bundle size impact
- All icon buttons already have `title` and `aria-label` attributes, so
  accessibility is maintained when labels are hidden
