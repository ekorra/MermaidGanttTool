---
id: DRAFT-15
title: Analytics — usage logging (unique users, feature events, session duration)
status: Draft
created_date: '2026-03-14'
labels:
  - analytics
  - exploration
---

## Idea

Log app usage to understand how many unique users the app has, whether they return, which features they use, and how long they spend in the app.

## Constraints

- Static frontend only — no backend to receive events
- Must comply with GDPR (app is open source and used by Norwegian/EU users)
- Prefer no cookie consent banner — use cookieless tracking
- No collection of personal data or PII

---

## Tool options

### Plausible Analytics (recommended first choice)
- Privacy-first, cookieless, GDPR compliant out of the box
- SaaS: ~$9/month for up to 10k pageviews (has free trial)
- Self-hostable on own server (free, but requires infra)
- Simple `<script>` tag integration, no SDK needed
- Supports custom events via `plausible('event-name', { props: { ... } })`
- Tracks: unique visitors, return rate, referrers, country, session duration

### Umami (open source, self-hosted)
- Free if self-hosted (Railway, Vercel, Supabase free tier)
- Cookieless, GDPR compliant
- Custom events with properties
- Slightly more setup than Plausible SaaS

### PostHog
- Full product analytics (funnels, retention, session replay)
- Generous free tier (1M events/month)
- Has EU cloud (posthog.com/eu) — GDPR compliant
- Heavier script (~40kb), but most powerful for feature adoption analysis

### Google Analytics 4
- Free, widely used
- Requires cookie consent banner under GDPR
- Collects significant personal data — not ideal for a privacy-conscious open source tool

---

## Events to track

### Page-level (automatic with any tool)
| Event | What it tells us |
|-------|-----------------|
| `pageview` | Total visits, unique visitors, return rate, session duration |

### Feature events (custom, fired manually in app)
| Event | Props | What it tells us |
|-------|-------|-----------------|
| `copy_mermaid` | — | Export feature usage |
| `add_section` | — | Editor engagement |
| `add_task` | — | Editor engagement |
| `drag_task` | — | Canvas interaction |
| `resize_task` | — | Canvas interaction |
| `settings_open` | — | Settings discovery |
| `preview_tab_switch` | `{ tab: 'syntax' \| 'preview' }` | Preview preference |
| `feedback_open` | `{ type: 'bug' \| 'improvement' }` | Feedback funnel |
| `click_link_used` | — | How many tasks have click URLs |
| `combined_status_used` | `{ status: 'crit+active' \| 'crit+done' }` | Advanced feature adoption |
| `multiple_deps_used` | — | Dependency feature adoption |

### Session quality signals
| Signal | Method |
|--------|--------|
| Session duration | Plausible/PostHog track this automatically |
| Return rate | `localStorage` timestamp on first visit + Plausible's built-in return metric |
| Tasks created per session | Custom counter, sent as event prop on `copy_mermaid` |

---

## Open questions

- **SaaS vs. self-hosted**: Plausible SaaS is simplest to start; self-hosted Umami is free but needs infra
- **GDPR notice**: Even cookieless tools must be disclosed. Should there be a one-line notice in the app footer or README?
- **GitHub Pages domain**: When/if deployed to GitHub Pages, the domain is needed for Plausible site config
- **Event granularity**: Start with just pageview + `copy_mermaid` to keep it simple, add more events over time
- **No data sharing**: Verify chosen tool does not sell/share data

## Exploration needed

- Decide: Plausible SaaS / self-hosted Umami / PostHog EU
- Register domain in chosen tool
- Add script tag to `index.html`
- Add `analytics.ts` utility in `src/utils/` wrapping `window.plausible()` (or equivalent) with a no-op fallback for dev/test
- Fire events from store mutators or component callbacks (not inside `src/model/` — analytics is a side effect)
- Add privacy notice to README and/or app footer
