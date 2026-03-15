import type { GanttChart } from '../model/types'

export type ShareResult =
  | { ok: true; id: string }
  | { ok: false; error: string }

export type LoadResult =
  | { ok: true; diagram: GanttChart }
  | { ok: false; error: string; notFound?: boolean }

export type SaveResult =
  | { ok: true }
  | { ok: false; error: string }

export async function createShare(diagram: GanttChart): Promise<ShareResult> {
  try {
    const res = await fetch('/api/share', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(diagram),
    })
    if (!res.ok) {
      const body = await res.json().catch(() => ({})) as { error?: string }
      return { ok: false, error: body.error ?? `HTTP ${res.status}` }
    }
    const { id } = await res.json() as { id: string }
    return { ok: true, id }
  } catch {
    return { ok: false, error: 'Network error' }
  }
}

export async function loadShare(id: string): Promise<LoadResult> {
  try {
    const res = await fetch(`/api/share/${id}`)
    if (res.status === 404) {
      return { ok: false, error: 'Not found or expired', notFound: true }
    }
    if (!res.ok) {
      const body = await res.json().catch(() => ({})) as { error?: string }
      return { ok: false, error: body.error ?? `HTTP ${res.status}` }
    }
    const diagram = await res.json() as GanttChart
    return { ok: true, diagram }
  } catch {
    return { ok: false, error: 'Network error' }
  }
}

export async function saveShare(id: string, diagram: GanttChart): Promise<SaveResult> {
  try {
    const res = await fetch(`/api/share/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(diagram),
    })
    if (!res.ok) {
      const body = await res.json().catch(() => ({})) as { error?: string }
      return { ok: false, error: body.error ?? `HTTP ${res.status}` }
    }
    return { ok: true }
  } catch {
    return { ok: false, error: 'Network error' }
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
