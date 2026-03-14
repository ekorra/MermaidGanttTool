import { test, expect, type Page } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  // Clear localStorage so each test starts with the default sample chart
  await page.evaluate(() => localStorage.clear())
  await page.reload()
})

// Helper: open the preview panel (collapsed by default)
async function openPreview(page: Page) {
  const toggle = page.getByTestId('preview-toggle')
  // Only click if not already open
  const isOpen = await page.getByTestId('syntax-pane').isVisible().catch(() => false)
  if (!isOpen) await toggle.click()
  await expect(page.getByTestId('syntax-pane')).toBeVisible()
}

test('loads with default sample chart', async ({ page }) => {
  // Default section "Phase 1" is visible in the task list
  const taskList = page.getByTestId('task-list')
  await expect(taskList.getByText('Phase 1')).toBeVisible()
  await expect(taskList.getByText('Design')).toBeVisible()

  // Syntax pane contains the chart
  await openPreview(page)
  const syntax = page.getByTestId('syntax-pane')
  await expect(syntax).toContainText('gantt')
  await expect(syntax).toContainText('Phase 1')
  await expect(syntax).toContainText('Design')
})

test('adds a new section', async ({ page }) => {
  await page.getByTestId('add-section').click()

  const taskList = page.getByTestId('task-list')
  await expect(taskList.getByText('New Section')).toBeVisible()

  // Add a task so the section appears in the exported syntax (empty sections are skipped)
  await page.getByTestId('add-task').last().click()
  await openPreview(page)
  await expect(page.getByTestId('syntax-pane')).toContainText('section New Section')
})

test('renames a section via EditableLabel', async ({ page }) => {
  const taskList = page.getByTestId('task-list')

  // Click the section title span to enter edit mode
  await taskList.getByText('Phase 1').click()
  // EditableLabel renders a controlled input — locate it within the task list
  const input = taskList.locator('input').first()
  await input.fill('Renamed Section')
  await input.press('Enter')

  await expect(taskList.getByText('Renamed Section')).toBeVisible()
  await openPreview(page)
  await expect(page.getByTestId('syntax-pane')).toContainText('section Renamed Section')
})

test('deletes a section', async ({ page }) => {
  await page.getByTitle('Delete section').click()

  const taskList = page.getByTestId('task-list')
  await expect(taskList.getByText('Phase 1')).not.toBeVisible()
  await openPreview(page)
  await expect(page.getByTestId('syntax-pane')).not.toContainText('Phase 1')
})

test('adds a task to a section', async ({ page }) => {
  await page.getByTestId('add-task').first().click()

  // New task appears in the task list (4 tasks total)
  const taskList = page.getByTestId('task-list')
  await expect(taskList.getByText('New Task')).toBeVisible()
  await openPreview(page)
  await expect(page.getByTestId('syntax-pane')).toContainText('New Task')
})

test('edits a task label', async ({ page }) => {
  // Click a task to open the detail panel
  await page.getByTestId('task-item-Design').click()
  await expect(page.getByTestId('task-detail')).toBeVisible()

  const labelInput = page.getByTestId('task-label-input')
  await labelInput.fill('Updated Task Name')
  await labelInput.press('Tab')

  await openPreview(page)
  await expect(page.getByTestId('syntax-pane')).toContainText('Updated Task Name')
})

test('deletes a task', async ({ page }) => {
  // Click the first task (Design) to open detail panel
  await page.getByTestId('task-item-Design').click()
  await expect(page.getByTestId('task-detail')).toBeVisible()

  await page.getByTestId('task-delete').click()

  // Task list should no longer contain Design
  const taskList = page.getByTestId('task-list')
  await expect(taskList.getByText('Design')).not.toBeVisible()
  await openPreview(page)
  await expect(page.getByTestId('syntax-pane')).not.toContainText('Design')
})

test('sets task status to crit', async ({ page }) => {
  // Click a task to open detail panel
  await page.getByTestId('task-item-Design').click()
  await expect(page.getByTestId('task-detail')).toBeVisible()

  await page.getByTestId('task-status-select').selectOption('crit')

  await openPreview(page)
  await expect(page.getByTestId('syntax-pane')).toContainText('crit')
})
