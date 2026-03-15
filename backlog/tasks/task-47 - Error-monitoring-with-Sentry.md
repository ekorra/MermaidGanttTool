---
id: TASK-47
title: Error monitoring with Sentry
status: To Do
assignee: []
created_date: '2026-03-15 18:16'
labels: [observability, devops]
dependencies: []
---

## Description

Currently all frontend JS exceptions and serverless function errors are invisible.
Set up Sentry to capture and group errors from both frontend and API routes.

**What Vercel Function Logs already covers:** serverless function errors visible in Vercel
dashboard — no setup needed, but no alerting and no frontend coverage.

**What Sentry adds:**
- Frontend: uncaught JS exceptions, React render errors, network failures
- API routes: exceptions with stack traces, grouped by type
- Context: browser, OS, URL, user actions leading up to the error
- Alerting: email/Slack notification on new errors

## Setup outline

1. Create project at sentry.io (free tier)
2. `npm install @sentry/react @sentry/node`
3. Init in `src/main.tsx` with DSN from Sentry project
4. Wrap App in `<Sentry.ErrorBoundary>` for React render errors
5. Add `Sentry.captureException(err)` in API route catch blocks
6. Add source maps upload to CI (Vite plugin: `@sentry/vite-plugin`)
7. Set `SENTRY_DSN` as env var in Vercel

## Acceptance Criteria

- [ ] Frontend JS exceptions are captured in Sentry
- [ ] React render crashes show a user-friendly fallback and are reported
- [ ] API route exceptions are captured with stack trace
- [ ] Source maps uploaded so stack traces point to original TS source
- [ ] `SENTRY_DSN` documented as required env var

## Definition of Done

- [ ] Code implemented and TypeScript-clean
- [ ] Tests passing (`npm run typecheck && npm run test:run`)
- [ ] Committed and pushed
