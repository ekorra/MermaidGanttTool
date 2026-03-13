import { describe, it, expect } from 'vitest'
import { parseDate, formatDate, addDays, diffDays, minDate, maxDate } from '../../src/utils/dateUtils'

describe('parseDate', () => {
  it('parses a valid ISO date string', () => {
    const d = parseDate('2024-03-15')
    expect(d.getUTCFullYear()).toBe(2024)
    expect(d.getUTCMonth()).toBe(2) // 0-indexed
    expect(d.getUTCDate()).toBe(15)
  })

  it('throws on invalid input', () => {
    expect(() => parseDate('not-a-date')).toThrow()
  })
})

describe('formatDate', () => {
  it('formats a date to ISO string', () => {
    const d = new Date(Date.UTC(2024, 0, 5))
    expect(formatDate(d)).toBe('2024-01-05')
  })

  it('pads single-digit month and day', () => {
    const d = new Date(Date.UTC(2024, 8, 3)) // September 3
    expect(formatDate(d)).toBe('2024-09-03')
  })
})

describe('addDays', () => {
  it('adds positive days', () => {
    const d = parseDate('2024-01-01')
    expect(formatDate(addDays(d, 7))).toBe('2024-01-08')
  })

  it('adds negative days (subtract)', () => {
    const d = parseDate('2024-01-10')
    expect(formatDate(addDays(d, -3))).toBe('2024-01-07')
  })

  it('crosses month boundary', () => {
    const d = parseDate('2024-01-30')
    expect(formatDate(addDays(d, 3))).toBe('2024-02-02')
  })

  it('does not mutate the input date', () => {
    const d = parseDate('2024-01-01')
    addDays(d, 5)
    expect(formatDate(d)).toBe('2024-01-01')
  })
})

describe('diffDays', () => {
  it('returns positive when end is after start', () => {
    expect(diffDays(parseDate('2024-01-01'), parseDate('2024-01-08'))).toBe(7)
  })

  it('returns negative when end is before start', () => {
    expect(diffDays(parseDate('2024-01-08'), parseDate('2024-01-01'))).toBe(-7)
  })

  it('returns 0 for same date', () => {
    const d = parseDate('2024-06-15')
    expect(diffDays(d, d)).toBe(0)
  })
})

describe('minDate / maxDate', () => {
  it('minDate returns the earlier date', () => {
    const a = parseDate('2024-01-01')
    const b = parseDate('2024-06-01')
    expect(minDate(a, b)).toBe(a)
    expect(minDate(b, a)).toBe(a)
  })

  it('maxDate returns the later date', () => {
    const a = parseDate('2024-01-01')
    const b = parseDate('2024-06-01')
    expect(maxDate(a, b)).toBe(b)
    expect(maxDate(b, a)).toBe(b)
  })
})
