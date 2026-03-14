import { test, expect, type Page } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
})

async function openPreview(page: Page) {
  const isOpen = await page.getByTestId('syntax-pane').isVisible().catch(() => false)
  if (!isOpen) await page.getByTestId('preview-toggle').click()
  await expect(page.getByTestId('syntax-pane')).toBeVisible()
}

test('syntax pane shows valid Mermaid output', async ({ page }) => {
  await openPreview(page)
  const syntax = page.getByTestId('syntax-pane')
  await expect(syntax).toContainText('gantt')
  await expect(syntax).toContainText('title My Project')
  await expect(syntax).toContainText('dateFormat DD-MM-YYYY')
  await expect(syntax).toContainText('section Phase 1')
  await expect(syntax).toContainText('Design')
  await expect(syntax).toContainText('milestone')
})

test('copy button writes syntax to clipboard', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await openPreview(page)

  await page.getByRole('button', { name: 'Copy', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Copied!' })).toBeVisible()

  const clipboardText = await page.evaluate(() => navigator.clipboard.readText())
  expect(clipboardText).toContain('gantt')
  expect(clipboardText).toContain('title My Project')
})

test('toolbar Copy Mermaid button also copies syntax', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])

  await page.getByRole('button', { name: 'Copy Mermaid' }).click()

  const clipboardText = await page.evaluate(() => navigator.clipboard.readText())
  expect(clipboardText).toContain('gantt')
})

test('preview tab switches to Mermaid renderer', async ({ page }) => {
  await openPreview(page)

  // Click the "preview" tab (lowercase text in the tab bar)
  await page.getByRole('button', { name: 'preview', exact: true }).click()

  // Mermaid renders an SVG into the renderer container (300ms debounce)
  await expect(page.getByTestId('mermaid-renderer').locator('svg')).toBeVisible({ timeout: 3000 })
})

test('syntax updates live when task label is changed', async ({ page }) => {
  // Click the Design task to open detail panel
  await page.getByTestId('task-item-Design').click()
  await expect(page.getByTestId('task-detail')).toBeVisible()

  const labelInput = page.getByTestId('task-label-input')
  await labelInput.fill('My New Task')
  await labelInput.press('Tab')

  await openPreview(page)
  await expect(page.getByTestId('syntax-pane')).toContainText('My New Task')
  await expect(page.getByTestId('syntax-pane')).not.toContainText('Design')
})

test('exported syntax is valid Mermaid (contains all required header fields)', async ({ page }) => {
  await openPreview(page)
  const syntax = await page.getByTestId('syntax-pane').inputValue()

  expect(syntax).toMatch(/^gantt/)
  expect(syntax).toContain('title ')
  expect(syntax).toContain('dateFormat ')
  expect(syntax).toContain('axisFormat ')
  expect(syntax).toContain('section ')
})
