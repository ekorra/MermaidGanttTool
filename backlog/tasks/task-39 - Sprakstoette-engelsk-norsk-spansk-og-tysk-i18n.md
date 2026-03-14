---
id: TASK-39
title: 'Language support — English, Norwegian, Spanish, German (i18n)'
status: To Do
assignee: []
created_date: '2026-03-14 17:43'
labels:
  - ux
  - i18n
dependencies: []
---

## Description

Add internationalization (i18n) so the entire UI is available in English, Norwegian, Spanish, and German. English is the default. The user selects language manually; the choice is persisted in `localStorage`.

All UI strings are currently hardcoded in Norwegian or English across components. These must be extracted into a translation dictionary. No external i18n library — a simple typed dictionary pattern keeps the bundle small and avoids dependencies.

**Approach:**
- `src/i18n/translations.ts` — typed `Translations` interface + dictionaries for all four languages
- `src/i18n/useLocale.ts` — small hook: reads/writes `localStorage('locale')`, returns `{ t, locale, setLocale }`
- Language picker added to the Settings panel (select dropdown)
- Default locale: `'en'`

## Acceptance Criteria

- [ ] All visible UI strings are translated in English (`en`), Norwegian (`no`), Spanish (`es`), and German (`de`)
- [ ] Language can be changed in the Settings panel
- [ ] Selected language is persisted in `localStorage` and restored on page reload
- [ ] Default language is English when no preference is stored
- [ ] Mermaid output (Gantt syntax) is unaffected — only UI strings are translated
- [ ] TypeScript: `Translations` interface ensures all four locales cover every key (no missing keys possible)

## Definition of Done

- [ ] Code implemented and TypeScript-clean
- [ ] Tests written and passing (`npm run typecheck && npm run test:run`)
- [ ] Committed and pushed
