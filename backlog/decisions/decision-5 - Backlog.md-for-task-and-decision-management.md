---
id: decision-5
title: Backlog.md for task and decision management
date: '2026-03-13'
status: accepted
---
## Context

The project needed a lightweight task tracking and documentation system that lives inside the Git repository. Options considered:

- Simple `backlog.md` markdown file — easy but no tooling
- GitHub Issues — requires internet, not local-first
- Linear / Jira — too heavy for a solo/small open source project
- Backlog.md CLI (https://github.com/MrLesk/Backlog.md) — local-first, Git-native, Markdown-based, MCP integration with Claude

## Decision

Use Backlog.md CLI for task management, decisions (ADRs), and drafts.

## Rationale

Backlog.md stores everything as Markdown files in `backlog/`, committed alongside code. This means task history is in Git, no external service needed, and contributors can work offline. The MCP integration allows Claude to read and update tasks directly. ADR support (decisions/) provides a structured way to document architectural choices that live with the code.

## Consequences

- Requires `npm install -g backlog.md` for contributors who want the CLI (optional — files are plain Markdown)
- Tasks are visible and editable directly in any text editor or IDE
- GitHub Issues can still be used for external bug reports and feature requests
