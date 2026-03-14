# MermaidGanttTool

A WYSIWYG web app for creating [Mermaid](https://mermaid.js.org/) Gantt diagrams. Edit visually, export valid Mermaid syntax — ready to paste into GitHub, Confluence, or any Markdown-based platform.

## Features

- **Task list** — add, rename, and delete sections and tasks from the left panel
- **Detail editor** — edit name, status, dates, duration, dependencies, color, and click URL per task
- **Interactive canvas** — drag task bars to move them; drag left or right edge to resize
- **Task dependencies** — link tasks with `after <taskId>` and see dependency arrows on the canvas
- **Milestones** — render as diamonds on the timeline
- **Task statuses** — `active`, `done`, `crit`, and combined (`crit+active`, `crit+done`)
- **Dark mode** — follows system preference with manual toggle in the toolbar
- **Live preview** — switch between raw Mermaid syntax and the rendered diagram
- **Export** — copy valid Mermaid syntax to clipboard in one click
- **Persistence** — your diagram is saved automatically in `localStorage`

## Usage

Open the app in a browser. No login or setup required.

| Area | What you can do |
|------|----------------|
| **Toolbar** | Set the diagram title and date format |
| **Task list (left)** | Add/rename/delete sections and tasks; click a task to open the detail editor |
| **Detail editor (right)** | Edit task name, status, dates, duration, dependencies, color, and URL |
| **Canvas (center)** | Drag tasks to reschedule; drag left/right edge to resize; click to select |
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

## Backlog

Tasks, decisions, and feature drafts are tracked with the [Backlog.md CLI](https://github.com/MrLesk/Backlog.md).

```bash
backlog board                   # Kanban overview — best starting point
backlog task list               # List all tasks grouped by status
backlog overview                # Stats and completion summary
backlog task view <id>          # Details for a task  (e.g. backlog task view 24)
backlog task create "<title>"   # Create a new task
backlog task edit <id>          # Edit status, labels, assignee, etc.
backlog draft list              # List feature drafts
backlog decision list           # List architecture decisions (ADRs)
```

Files: `backlog/tasks/` · `backlog/decisions/` · `backlog/drafts/`

### Starting a new task

Create the task first and fill in **Description**, **Acceptance Criteria**, and **Definition of Done** before writing any code:

```bash
backlog task create "My feature"
# edit the file in backlog/tasks/ to add description + AC + DoD
backlog task edit <id> --status "In Progress"
# ... implement ...
backlog task edit <id> --status "Done"
```

## Contributing

1. Fork the repo and create a branch
2. Create a backlog task for non-trivial work (see above)
3. Keep code, comments, and docs in **English**
4. Run `npm run typecheck && npm test` — all checks must pass
5. Open a pull request

Bug reports and feature ideas are welcome as [GitHub Issues](https://github.com/ekorra/MermaidGanttTool/issues).

## Roadmap

See [backlog/drafts/](backlog/drafts/) for planned features, including:
- Browser extension (Chrome/Firefox)
- PNG export
- Import from existing Mermaid syntax
- Zoom control (pxPerDay slider)
- Multilingual UI (English, Norwegian, Spanish, German)

## License

MIT
