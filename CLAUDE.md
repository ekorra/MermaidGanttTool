# MermaidGanttTool — Claude Code instructions

WYSIWYG web app for creating Mermaid Gantt diagrams. Static frontend only — no backend.
GitHub: https://github.com/ekorra/MermaidGanttTool

---

## Development commands

```bash
npm run dev          # Start dev server (localhost:5173)
npm run typecheck    # TypeScript check (run before every commit)
npm run test:run     # Unit + integration tests (Vitest)
npm run test:e2e     # Playwright E2E tests
npm run build        # Production build
```

---

## Backlog (backlog.md CLI)

Tasks, decisions, and drafts are tracked with the `backlog` CLI.

```bash
backlog board                  # Kanban board — best overview
backlog task list              # List all tasks by status
backlog overview               # Stats and completion summary
backlog task view <id>         # Details for a specific task (e.g. backlog task view 24)
backlog task create "<title>"  # Create new task
backlog task edit <id>         # Edit task (status, labels, etc.)
backlog draft list             # List feature drafts
backlog decision list          # List architecture decisions (ADRs)
```

Task files live in `backlog/tasks/`. Decisions in `backlog/decisions/`. Drafts in `backlog/drafts/`.

**Workflow:** Create a task before starting non-trivial work → mark In Progress → mark Done before committing.

### Task template (required before starting any non-trivial task)

```markdown
## Description
[What needs to be built and why]

## Acceptance Criteria
- [ ] [Specific, testable condition]
- [ ] [Another condition]

## Definition of Done
- [ ] Code implemented and TypeScript-clean
- [ ] Tests written and passing (`npm run typecheck && npm run test:run`)
- [ ] Committed and pushed
```

---

## Architecture invariants

- `src/model/` is pure TypeScript — **zero React imports**. No exceptions.
- `exportToMermaid()` in `src/model/export.ts` is the **only** path from model → Mermaid text.
- `useGanttStore` in `src/state/useGanttStore.ts` is the **single state source**. No other global state.
- `task.color` is UI-only — never exported to Mermaid syntax.
- `base: './'` in `vite.config.ts` must stay (browser extension compatibility).

## Key files

| File | Purpose |
|------|---------|
| `src/model/types.ts` | Core data model (GanttChart, GanttSection, GanttTask) |
| `src/model/export.ts` | Pure fn: GanttChart → Mermaid string |
| `src/model/defaults.ts` | createChart / createSection / createTask factories |
| `src/state/useGanttStore.ts` | Master React hook — all state + mutators |
| `src/App.tsx` | Three-panel layout: TaskList + Canvas + TaskDetailPanel |
| `src/utils/taskPositions.ts` | resolveTaskPositions() — follows afterTaskId chains |
| `src/utils/colors.ts` | PRESET_COLORS palette for task color picker |

## Layout

```
┌─────────────────────────────────────────────────────────┐
│  Toolbar (48px)                                         │
├────────────┬────────────────────────────┬───────────────┤
│  TaskList  │  Canvas (SVG)              │ TaskDetail    │
│  (280px)   │  (1fr, dark bg)            │ (240px)       │
├────────────┴────────────────────────────┴───────────────┤
│  Preview — Syntax / Mermaid tabs (220px)                │
└─────────────────────────────────────────────────────────┘
```

## Coding conventions

- All code, comments, and docs in **English**.
- TypeScript strict mode + `noUncheckedIndexedAccess` — no `any`, no `@ts-ignore`.
- Commit messages proposed for user approval before committing.
- Do not use dnd-kit for SVG elements — use custom pointer-event hooks (`useDrag`, `useResize`).
- Run `npm run typecheck && npm run test:run` before proposing a commit.
