---
id: decision-6
title: 'i18n — English as default language; Norwegian, Spanish, German also supported'
date: '2026-03-14'
status: accepted
---

## Context

The app UI has been built with a mix of Norwegian and English strings. As the app becomes publicly available (Vercel deploy), it needs to be accessible to a broader audience. The primary target users are Norwegian-speaking teams, but international reach is a goal.

Choices to make:
- Which languages to support initially
- What the default language should be
- Whether to use an external i18n library (react-i18next, lingui, etc.) or a custom solution

## Decision

Support **English (en), Norwegian (no), Spanish (es), and German (de)**.

**Default language: English.** English is the lingua franca for technical tools and maximizes reach for first-time visitors with no stored preference.

**No external i18n library.** A typed dictionary pattern in plain TypeScript is sufficient for the scale of this app. It avoids runtime dependencies and keeps the bundle small. The `Translations` interface enforces completeness at compile time — all four locales must implement every key.

Language selection is manual (Settings panel), not auto-detected from browser locale. The choice is persisted in `localStorage`.

## Consequences

- UI strings must be extracted from all components into `src/i18n/translations.ts`
- Adding a new language in the future requires only adding a new dictionary implementing `Translations`
- Browser auto-detection is not implemented; users must change language manually
- Mermaid Gantt output is unaffected — only UI labels, buttons, and placeholder text are translated
