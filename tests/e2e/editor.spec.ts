import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  // Clear localStorage so each test starts with the default sample chart
  await page.evaluate(() => localStorage.clear())
  await page.reload()
})

test('loads with default sample chart', async ({ page }) => {
  // Default section "Phase 1" with three tasks
  await expect(page.getByText('Phase 1')).toBeVisible()
  await expect(page.getByPlaceholder('Task label').first()).toHaveValue('Design')

  // Syntax pane contains the chart
  const syntax = page.getByTestId('syntax-pane')
  await expect(syntax).toContainText('gantt')
  await expect(syntax).toContainText('Phase 1')
  await expect(syntax).toContainText('Design')
})

test('adds a new section', async ({ page }) => {
  await page.getByRole('button', { name: '+ Add section' }).click()

  await expect(page.getByText('New Section')).toBeVisible()
  await expect(page.getByTestId('syntax-pane')).toContainText('section New Section')
})

test('renames a section via EditableLabel', async ({ page }) => {
  // Click the section title span to enter edit mode
  await page.getByText('Phase 1').click()
  const input = page.locator('input[value="Phase 1"]')
  await input.fill('Renamed Section')
  await input.press('Enter')

  await expect(page.getByText('Renamed Section')).toBeVisible()
  await expect(page.getByTestId('syntax-pane')).toContainText('section Renamed Section')
})

test('deletes a section', async ({ page }) => {
  await page.getByTitle('Delete section').click()

  await expect(page.getByText('Phase 1')).not.toBeVisible()
  await expect(page.getByTestId('syntax-pane')).not.toContainText('Phase 1')
})

test('adds a task to a section', async ({ page }) => {
  await page.getByRole('button', { name: '+ Add task' }).click()

  // A new "New Task" task label input appears
  const inputs = page.getByPlaceholder('Task label')
  // There should now be 4 task rows (3 default + 1 new)
  await expect(inputs).toHaveCount(4)
  await expect(page.getByTestId('syntax-pane')).toContainText('New Task')
})

test('edits a task label', async ({ page }) => {
  const labelInput = page.getByPlaceholder('Task label').first()
  await labelInput.fill('Updated Task Name')
  await labelInput.press('Tab')

  await expect(page.getByTestId('syntax-pane')).toContainText('Updated Task Name')
})

test('deletes a task', async ({ page }) => {
  // First task row's delete button
  await page.getByTitle('Delete task').first().click()

  const inputs = page.getByPlaceholder('Task label')
  await expect(inputs).toHaveCount(2)
  await expect(page.getByTestId('syntax-pane')).not.toContainText('Design')
})

test('sets task status to crit', async ({ page }) => {
  const statusSelects = page.getByRole('combobox').filter({ hasText: /None|Active|Done|Critical|Milestone/ })
  await statusSelects.first().selectOption('crit')

  await expect(page.getByTestId('syntax-pane')).toContainText('crit')
})
