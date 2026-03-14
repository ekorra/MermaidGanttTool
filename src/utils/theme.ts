export type ThemeSetting = 'light' | 'dark' | 'system'

export function initTheme(): void {
  const saved = localStorage.getItem('theme') as ThemeSetting | null
  applyTheme(saved ?? 'system')
}

export function toggleTheme(): boolean {
  const currentlyDark = isDarkActive()
  const next: ThemeSetting = currentlyDark ? 'light' : 'dark'
  localStorage.setItem('theme', next)
  applyTheme(next)
  return !currentlyDark
}

export function isDarkActive(): boolean {
  const attr = document.documentElement.getAttribute('data-theme')
  if (attr === 'dark') return true
  if (attr === 'light') return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function applyTheme(setting: ThemeSetting): void {
  const root = document.documentElement
  if (setting === 'dark') root.setAttribute('data-theme', 'dark')
  else if (setting === 'light') root.setAttribute('data-theme', 'light')
  else root.removeAttribute('data-theme')
}
