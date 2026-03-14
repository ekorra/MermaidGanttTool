import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
})

// --- Double-click rename: tasks ---

test('double-clicking a task label shows inline rename input', async ({ page }) => {
  await page.getByTestId('task-item-Design').dblclick()
  await expect(page.getByTestId('task-list').locator('input')).toBeVisible()
})

test('rename task commits on Enter and updates the label', async ({ page }) => {
  const taskList = page.getByTestId('task-list')

  await page.getByTestId('task-item-Design').dblclick()
  const input = taskList.locator('input').first()
  await input.fill('Renamed Task')
  await input.press('Enter')

  await expect(taskList.getByText('Renamed Task')).toBeVisible()
  await expect(taskList.getByText('Design')).not.toBeVisible()
})

test('rename task cancels on Escape without changing label', async ({ page }) => {
  const taskList = page.getByTestId('task-list')

  await page.getByTestId('task-item-Design').dblclick()
  const input = taskList.locator('input').first()
  await input.fill('Should Not Save')
  await input.press('Escape')

  await expect(taskList.getByText('Design')).toBeVisible()
  await expect(taskList.getByText('Should Not Save')).not.toBeVisible()
})

test('single-click on task still selects it without renaming', async ({ page }) => {
  await page.getByTestId('task-item-Design').click()

  // Detail panel opens
  await expect(page.getByTestId('task-detail')).toBeVisible()
  // No inline rename input appears
  await expect(page.getByTestId('task-list').locator('input')).not.toBeVisible()
})

// --- Double-click rename: sections ---

test('double-clicking a section header enters rename mode', async ({ page }) => {
  const taskList = page.getByTestId('task-list')

  await taskList.getByText('Phase 1').dblclick()
  await expect(taskList.locator('input')).toBeVisible()
})

test('single-click on section header does not trigger rename', async ({ page }) => {
  const taskList = page.getByTestId('task-list')

  await taskList.getByText('Phase 1').click()
  // No input should appear from single-click
  await expect(taskList.locator('input')).not.toBeVisible()
})
