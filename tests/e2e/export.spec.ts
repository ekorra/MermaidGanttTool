import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
})

test('syntax pane shows valid Mermaid output', async ({ page }) => {
  const syntax = page.getByTestId('syntax-pane')
  await expect(syntax).toContainText('gantt')
  await expect(syntax).toContainText('title My Project')
  await expect(syntax).toContainText('dateFormat YYYY-MM-DD')
  await expect(syntax).toContainText('section Phase 1')
  await expect(syntax).toContainText('Design')
  await expect(syntax).toContainText('milestone')
})

test('copy button writes syntax to clipboard', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])

  // SyntaxPane Copy button is visible in the Syntax tab (default)
  await page.getByRole('button', { name: 'Copy' }).click()
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
  // Click the "preview" tab in the bottom panel
  await page.getByRole('button', { name: 'preview' }).click()

  // Mermaid renders an SVG inside the renderer container
  // Wait for mermaid debounce (300ms) + render time
  await expect(page.locator('.mermaid-renderer, [id^="mermaid-"] svg, div svg')).toBeVisible({ timeout: 3000 })
})

test('syntax updates live when task label is changed', async ({ page }) => {
  const labelInput = page.getByPlaceholder('Task label').first()
  await labelInput.fill('My New Task')
  await labelInput.press('Tab')

  await expect(page.getByTestId('syntax-pane')).toContainText('My New Task')
  await expect(page.getByTestId('syntax-pane')).not.toContainText('Design')
})

test('exported syntax is valid Mermaid (contains all required header fields)', async ({ page }) => {
  const syntax = await page.getByTestId('syntax-pane').inputValue()

  expect(syntax).toMatch(/^gantt/)
  expect(syntax).toContain('title ')
  expect(syntax).toContain('dateFormat ')
  expect(syntax).toContain('axisFormat ')
  expect(syntax).toContain('section ')
})
