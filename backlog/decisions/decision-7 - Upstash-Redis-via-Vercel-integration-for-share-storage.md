---
id: decision-7
title: Upstash Redis via Vercel integration for share storage
date: '2026-03-15'
status: Accepted
---

## Context

TASK-46 introduced anonymous diagram sharing via short links. A key-value store with native
TTL support was needed to store diagrams temporarily without requiring user authentication.

## Decision

Use **Upstash Redis** connected via the Vercel Marketplace integration for all share storage.

- Install at: https://vercel.com/ekorra/~/integrations/upstash
- Vercel automatically injects `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`
- TTL: 30 days, reset on every save

## Alternatives considered

**Vercel KV** — rejected: deprecated as of early 2025. Vercel now recommends Upstash directly.

**Vercel Postgres (Neon)** — rejected: relational DB is overkill for a simple key-value use case.
No TTL support without a cleanup job.

**Vercel Blob** — rejected: file storage without native TTL; better suited for large binary assets.

## Consequences

- Free tier: 10 000 requests/day, 256 MB — sufficient for current usage
- Upgrade path to Supabase (DRAFT-16) is independent — share IDs and API contract are unchanged
- Local development falls back to localStorage automatically when env vars are absent
- Two env vars required in production: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
