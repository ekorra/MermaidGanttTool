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

// --- Click to open detail panel ---

test('clicking a task bar in canvas opens the detail panel', async ({ page }) => {
  await page.locator('[data-testid="task-bar-Design"]').click()
  await expect(page.getByTestId('task-detail')).toBeVisible()
})

test('clicking a milestone in canvas opens the detail panel', async ({ page }) => {
  await page.locator('[data-testid="milestone-diamond-Launch"]').click()
  await expect(page.getByTestId('task-detail')).toBeVisible()
})

test('clicking canvas background closes the detail panel', async ({ page }) => {
  // Open the panel first
  await page.locator('[data-testid="task-bar-Design"]').click()
  await expect(page.getByTestId('task-detail')).toBeVisible()

  // Click canvas background
  await page.getByTestId('canvas-svg').click({ position: { x: 10, y: 10 } })
  await expect(page.getByTestId('task-detail')).not.toBeVisible()
})

test('clicking same task again does not close the detail panel', async ({ page }) => {
  await page.locator('[data-testid="task-bar-Design"]').click()
  await expect(page.getByTestId('task-detail')).toBeVisible()

  // Click the same task bar again — panel should stay open
  await page.locator('[data-testid="task-bar-Design"]').click()
  await expect(page.getByTestId('task-detail')).toBeVisible()
})

test('clicking a different task switches the detail panel to that task', async ({ page }) => {
  await page.locator('[data-testid="task-bar-Design"]').click()
  await expect(page.getByTestId('task-label-input')).toHaveValue('Design')

  await page.locator('[data-testid="task-bar-Development"]').click()
  await expect(page.getByTestId('task-label-input')).toHaveValue('Development')
})

// --- Drag task bar body ---

test('dragging task bar body moves the task in time', async ({ page }) => {
  await openPreview(page)
  const initialSyntax = await page.getByTestId('syntax-pane').inputValue()

  const bar = page.locator('[data-testid="task-bar-Design"]')
  const box = await bar.boundingBox()
  expect(box).not.toBeNull()

  const cx = box!.x + box!.width / 2
  const cy = box!.y + box!.height / 2

  await page.mouse.move(cx, cy)
  await page.mouse.down()
  await page.mouse.move(cx + 40, cy, { steps: 10 })
  await page.mouse.up()

  const updatedSyntax = await page.getByTestId('syntax-pane').inputValue()
  expect(updatedSyntax).not.toEqual(initialSyntax)
})

// --- Right edge resize ---

test('right edge resize handle changes task duration', async ({ page }) => {
  await openPreview(page)
  const initialSyntax = await page.getByTestId('syntax-pane').inputValue()

  const bar = page.locator('[data-testid="task-bar-Design"]')
  const box = await bar.boundingBox()
  expect(box).not.toBeNull()

  // Right edge: x + width, centered vertically
  const rx = box!.x + box!.width
  const ry = box!.y + box!.height / 2

  await page.mouse.move(rx, ry)
  await page.mouse.down()
  await page.mouse.move(rx + 40, ry, { steps: 10 })
  await page.mouse.up()

  const updatedSyntax = await page.getByTestId('syntax-pane').inputValue()
  expect(updatedSyntax).not.toEqual(initialSyntax)
})

// --- Left edge resize ---

test('left edge resize handle changes task start date', async ({ page }) => {
  await openPreview(page)
  const initialSyntax = await page.getByTestId('syntax-pane').inputValue()

  const bar = page.locator('[data-testid="task-bar-Design"]')
  const box = await bar.boundingBox()
  expect(box).not.toBeNull()

  // Left edge: x, centered vertically — drag right to shrink from left
  const lx = box!.x
  const ly = box!.y + box!.height / 2

  await page.mouse.move(lx, ly)
  await page.mouse.down()
  await page.mouse.move(lx + 40, ly, { steps: 10 })
  await page.mouse.up()

  const updatedSyntax = await page.getByTestId('syntax-pane').inputValue()
  expect(updatedSyntax).not.toEqual(initialSyntax)
})
