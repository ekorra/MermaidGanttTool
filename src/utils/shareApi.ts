import type { GanttChart } from '../model/types'
import { nanoid } from 'nanoid'

export type ShareResult =
  | { ok: true; id: string }
  | { ok: false; error: string }

export type LoadResult =
  | { ok: true; diagram: GanttChart }
  | { ok: false; error: string; notFound?: boolean }

export type SaveResult =
  | { ok: true }
  | { ok: false; error: string }

const LS_PREFIX = 'gantt-share:'

function lsSet(id: string, diagram: GanttChart): void {
  localStorage.setItem(`${LS_PREFIX}${id}`, JSON.stringify(diagram))
}

function lsGet(id: string): GanttChart | null {
  try {
    const raw = localStorage.getItem(`${LS_PREFIX}${id}`)
    return raw ? (JSON.parse(raw) as GanttChart) : null
  } catch {
    return null
  }
}

export async function createShare(diagram: GanttChart): Promise<ShareResult> {
  try {
    const res = await fetch('/api/share', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(diagram),
    })
    if (res.ok) {
      const { id } = await res.json() as { id: string }
      return { ok: true, id }
    }
    // API responded with an error — do not fall back to localStorage
    const body = await res.json().catch(() => ({})) as { error?: string }
    return { ok: false, error: body.error ?? `HTTP ${res.status}` }
  } catch {
    // True network error (API not reachable) — fall back to localStorage for local dev
    const id = nanoid(10)
    lsSet(id, diagram)
    return { ok: true, id }
  }
}

export async function loadShare(id: string): Promise<LoadResult> {
  try {
    const res = await fetch(`/api/share/${id}`)
    if (res.status === 404) {
      // API says not found — also check localStorage before giving up
      const local = lsGet(id)
      if (local) return { ok: true, diagram: local }
      return { ok: false, error: 'Not found or expired', notFound: true }
    }
    if (res.ok) {
      const diagram = await res.json() as GanttChart
      return { ok: true, diagram }
    }
  } catch {
    // API unavailable — fall through to localStorage
  }

  // Fallback: try localStorage
  const local = lsGet(id)
  if (local) return { ok: true, diagram: local }
  return { ok: false, error: 'Not found or expired', notFound: true }
}

export async function saveShare(id: string, diagram: GanttChart): Promise<SaveResult> {
  try {
    const res = await fetch(`/api/share/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(diagram),
    })
    if (res.ok) return { ok: true }
    const body = await res.json().catch(() => ({})) as { error?: string }
    return { ok: false, error: body.error ?? `HTTP ${res.status}` }
  } catch {
    // True network error — fall back to localStorage for local dev
    lsSet(id, diagram)
    return { ok: true }
  }
}

/** Returns the share ID from the current URL's ?share= query param, or null. */
export function getShareIdFromUrl(): string | null {
  const params = new URLSearchParams(window.location.search)
  return params.get('share')
}

/** Builds a full share URL for a given ID. */
export function buildShareUrl(id: string): string {
  const base = window.location.origin + window.location.pathname
  return `${base}?share=${id}`
}
