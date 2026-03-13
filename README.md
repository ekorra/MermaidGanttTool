# MermaidGanttTool

A WYSIWYG web app for creating [Mermaid](https://mermaid.js.org/) Gantt diagrams. Edit visually, export valid Mermaid syntax — ready to paste into GitHub, Confluence, or any Markdown-based platform.

## Features

- **Visual editor** — add sections and tasks with a form-based panel
- **Interactive canvas** — drag task bars to move them, drag the right edge to resize
- **Task dependencies** — link tasks with `after <taskId>` and see dependency arrows on the canvas
- **Milestones** — render as diamonds on the timeline
- **Task statuses** — `active`, `done`, `crit`, `milestone`
- **Live preview** — switch between raw Mermaid syntax and the rendered diagram
- **Export** — copy valid Mermaid syntax to clipboard in one click
- **Persistence** — your diagram is saved automatically in `localStorage`

## Usage

Open the app in a browser. No login or setup required.

| Area | What you can do |
|------|----------------|
| **Toolbar** | Set the diagram title and date format |
| **Editor (left)** | Add/rename/delete sections and tasks; set dates, duration, status, dependencies |
| **Canvas (right)** | Drag tasks to reschedule; drag the right edge to resize duration |
| **Preview (bottom)** | Toggle between **Syntax** tab (copy-ready Mermaid) and **Preview** tab (rendered diagram) |

## Development

**Requirements:** Node 20+

```bash
git clone https://github.com/ekorra/MermaidGanttTool.git
cd MermaidGanttTool
npm install
npm run dev        # start dev server at http://localhost:5173
npm run build      # production build
npm run typecheck  # TypeScript typecheck
npm test           # unit + integration tests (Vitest)
```

### Project structure

```
src/
├── model/       # Pure TypeScript — types, defaults, exportToMermaid()
├── state/       # useGanttStore — single source of truth
├── hooks/       # useTimelineScale, useDrag, useResize
├── components/
│   ├── Editor/  # Form-based editor panel
│   ├── Canvas/  # SVG timeline canvas
│   ├── Preview/ # SyntaxPane + MermaidRenderer
│   └── shared/  # Toolbar, EditableLabel
└── utils/       # dateUtils, idUtils, durationUtils, taskPositions
tests/
├── unit/        # export, defaults, dateUtils
└── integration/ # useGanttStore, useTimelineScale
```

### Architecture invariants

- `model/` has zero React imports — pure TypeScript only
- `exportToMermaid()` is the sole path from model to Mermaid text
- The canvas never constructs Mermaid strings directly
- `useGanttStore` is the single source of truth
- `document`/`window` access only in hooks and components (enables future browser extension port)

## Contributing

1. Fork the repo and create a branch
2. Make your changes — keep code, comments, and docs in **English**
3. Run `npm run typecheck && npm test` — all checks must pass
4. Open a pull request

Bug reports and feature ideas are welcome as [GitHub Issues](https://github.com/ekorra/MermaidGanttTool/issues).

## Roadmap

See [backlog/drafts/](backlog/drafts/) for planned features, including:
- Browser extension (Chrome/Firefox)
- PNG export
- Import from existing Mermaid syntax
- Zoom control (pxPerDay slider)
- Dark mode

## License

MIT
