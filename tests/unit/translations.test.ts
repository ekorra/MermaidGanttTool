import { describe, it, expect } from 'vitest'
import { translations, type Locale, type Translations } from '../../src/i18n/translations'

const LOCALES: Locale[] = ['en', 'no', 'es', 'de']

describe('translations', () => {
  it('exports all four locales', () => {
    expect(Object.keys(translations)).toEqual(expect.arrayContaining(LOCALES))
  })

  it('every locale has all required keys', () => {
    const enKeys = Object.keys(translations['en']) as (keyof Translations)[]
    for (const locale of LOCALES) {
      for (const key of enKeys) {
        expect(translations[locale], `locale "${locale}" missing key "${key}"`).toHaveProperty(key)
      }
    }
  })

  it('string values are non-empty in all locales', () => {
    for (const locale of LOCALES) {
      const t = translations[locale]
      for (const [key, value] of Object.entries(t)) {
        if (typeof value === 'string') {
          expect(value, `locale "${locale}", key "${key}" is empty`).not.toBe('')
        }
      }
    }
  })

  it('array values are non-empty arrays in all locales', () => {
    for (const locale of LOCALES) {
      const t = translations[locale]
      for (const [key, value] of Object.entries(t)) {
        if (Array.isArray(value)) {
          expect(value.length, `locale "${locale}", key "${key}" has no items`).toBeGreaterThan(0)
          for (const item of value) {
            expect(typeof item).toBe('string')
            expect(item).not.toBe('')
          }
        }
      }
    }
  })

  it('function values produce non-empty strings', () => {
    for (const locale of LOCALES) {
      const t = translations[locale]
      expect(t.taskDurationDays(3)).toBeTruthy()
      expect(t.taskDurationDays(1)).toBeTruthy()
      expect(t.deleteSectionAriaLabel('Phase 1')).toContain('Phase 1')
      expect(t.deleteTaskAriaLabel('My task')).toContain('My task')
      expect(t.taskWouldBeZero('My task')).toContain('My task')
      expect(t.exportPngFailed('err')).toContain('err')
    }
  })

  it('en default language is English', () => {
    expect(translations['en'].copyMermaid).toBe('Copy Mermaid')
    expect(translations['en'].closeButton).toBe('Close')
    expect(translations['en'].addSection).toBe('+ New section')
  })

  it('no locale is Norwegian', () => {
    expect(translations['no'].closeButton).toBe('Lukk')
    expect(translations['no'].addSection).toBe('+ Ny seksjon')
  })

  it('es locale is Spanish', () => {
    expect(translations['es'].closeButton).toBe('Cerrar')
    expect(translations['es'].copyMermaid).toBe('Copiar Mermaid')
  })

  it('de locale is German', () => {
    expect(translations['de'].closeButton).toBe('Schließen')
    expect(translations['de'].copyMermaid).toBe('Mermaid kopieren')
  })
})
