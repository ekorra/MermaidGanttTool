---
id: TASK-46
title: Anonymous diagram sharing via short link
status: Done
assignee: []
created_date: '2026-03-15 15:32'
updated_date: '2026-03-15 17:51'
labels:
  - sharing
  - backend
  - vercel-kv
dependencies: []
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Allow users to share a diagram via a short URL where anyone with the link can both view
**and edit** the diagram. No login required. The diagram is stored anonymously in Vercel KV
(Redis) with a rolling 30-day TTL, and accessed via a short nanoid-based link
(e.g. `ganttmaker.app/share/V1StGXR8_k`).

Collaboration model: **last write wins** — no real-time sync, no conflict resolution.
Anyone with the link can load the current state, make changes, and save back to the same ID.
If two people edit simultaneously, the last one to save wins.

Real-time collaboration (live cursors, instant sync) is a future upgrade — see DRAFT-16.

This is the "free, anonymous" tier. DRAFT-16 describes a future upgrade path with Supabase +
auth for persistent, user-owned diagrams with real-time sync.

## Architecture

- **Storage:** Vercel KV (Redis via Upstash) — free tier: 10 000 req/day, native TTL
- **ID format:** nanoid, ~10 chars (e.g. `V1StGXR8_k`) — short, URL-safe, collision-resistant
- **TTL:** 30 days, reset on every save (active diagrams never expire)
- **Serverless API:**
  - `POST /api/share` — creates new shared diagram, returns `{ id }`
  - `GET /api/share/[id]` — returns current `GanttChart` or 404
  - `PUT /api/share/[id]` — overwrites with new diagram state, resets TTL
- **Frontend routing:** `/share/:id` — on load, fetches diagram from API and imports it
- **Share button:** in Toolbar, opens modal with share URL + copy button
- **Save button:** visible when viewing a shared diagram — saves current state back via PUT

## User-facing limitations (must be clearly communicated in UI)

- **Anyone with the link can edit** — shown in share modal and when opening a shared link
- Link expires **30 days after last save** — shown in share modal
- **Last write wins** — if two people edit simultaneously, the last save overwrites the other
- **No version history** — once overwritten, previous state is gone
- Diagrams are **not listed anywhere** — the link is the only access
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 `POST /api/share` stores diagram JSON in Vercel KV, returns nanoid
- [ ] #2 `GET /api/share/[id]` returns the stored diagram or 404
- [ ] #3 `PUT /api/share/[id]` overwrites the diagram and resets the 30-day TTL
- [ ] #4 Visiting `/share/:id` loads the diagram into the app and shows a "shared mode" banner
- [ ] #5 Shared mode banner informs: anyone with the link can edit, expires 30 days after last save
- [ ] #6 "Save changes" button in toolbar (or banner) triggers PUT and confirms success
- [ ] #7 If `/share/:id` is 404 or expired, show a clear error (not a broken state)
- [ ] #8 Share modal shows URL, copy button, and limitation summary
<!-- AC:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [ ] #1 Code implemented and TypeScript-clean
- [ ] #2 Vercel KV integration documented (env vars: `KV_URL`, `KV_REST_API_URL`, `KV_REST_API_TOKEN`)
- [ ] #3 Tests written and passing (`npm run typecheck && npm run test:run`)
- [ ] #4 Committed and pushed
<!-- DOD:END -->
