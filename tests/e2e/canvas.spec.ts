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

test('canvas SVG renders', async ({ page }) => {
  await expect(page.getByTestId('canvas-svg')).toBeVisible()
})

test('default task bars are rendered', async ({ page }) => {
  // Design and Development task bars (not milestone) should render as rects with data-testid
  await expect(page.locator('[data-testid="task-bar-Design"]')).toBeVisible()
  await expect(page.locator('[data-testid="task-bar-Development"]')).toBeVisible()
})

test('milestone renders as a diamond (polygon)', async ({ page }) => {
  // Launch is a milestone — rendered as a polygon with testid
  await expect(page.locator('[data-testid="milestone-diamond-Launch"]')).toBeVisible()
  // No task bar rect for milestone
  await expect(page.locator('[data-testid="task-bar-Launch"]')).not.toBeVisible()
})

test('dependency arrows are rendered', async ({ page }) => {
  // DependencyArrow renders a <g data-testid="dependency-arrow"> for each arrow
  await expect(page.getByTestId('dependency-arrow').first()).toBeAttached()
})

test('dragging a task bar updates startDate in syntax', async ({ page }) => {
  await openPreview(page)
  const syntax = page.getByTestId('syntax-pane')

  // Get the initial syntax
  const initialSyntax = await syntax.inputValue()
  const dateMatch = initialSyntax.match(/Design\s*:\s*done,\s*\S+,\s*(\S+)/)
  const initialDate = dateMatch?.[1] ?? ''
  expect(initialDate).toBeTruthy()

  // Drag the Design task bar right by 40px (= 1 day at pxPerDay=40)
  const bar = page.locator('[data-testid="task-bar-Design"]')
  const box = await bar.boundingBox()
  expect(box).not.toBeNull()

  const startX = box!.x + box!.width / 2
  const startY = box!.y + box!.height / 2

  await page.mouse.move(startX, startY)
  await page.mouse.down()
  await page.mouse.move(startX + 40, startY, { steps: 10 })
  await page.mouse.up()

  // Syntax should reflect a different start date
  const updatedSyntax = await syntax.inputValue()
  expect(updatedSyntax).not.toEqual(initialSyntax)
})

test('resizing a task bar updates duration in syntax', async ({ page }) => {
  await openPreview(page)
  const syntax = page.getByTestId('syntax-pane')
  const initialSyntax = await syntax.inputValue()

  // Find the resize handle (dark rect on right edge of Design bar)
  const bar = page.locator('[data-testid="task-bar-Design"]')
  const box = await bar.boundingBox()
  expect(box).not.toBeNull()

  // Resize handle is 6px wide at the right edge of the bar + 6px padding
  const resizeX = box!.x + box!.width + 3
  const resizeY = box!.y + box!.height / 2

  await page.mouse.move(resizeX, resizeY)
  await page.mouse.down()
  await page.mouse.move(resizeX + 40, resizeY, { steps: 10 })
  await page.mouse.up()

  const updatedSyntax = await syntax.inputValue()
  expect(updatedSyntax).not.toEqual(initialSyntax)
})
