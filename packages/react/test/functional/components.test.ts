import { expect, test } from '@playwright/test'
import { wait } from './utils/wait.js'

test('render floating menu', async ({ page }) => {
  await page.goto('http://localhost:3031/menu')
  await page.click('[data-testid=block-menu] button')
  await wait(10)
  expect(await page.getByTestId('block-menu').screenshot()).toMatchSnapshot('menu.png')
})

test('render floating listbox', async ({ page }) => {
  await page.goto('http://localhost:3031/listbox')
  await page.click('[data-testid=block-listbox] button')
  await wait(10)
  expect(await page.getByTestId('block-listbox').screenshot()).toMatchSnapshot('listbox.png')
})

test('render floating combobox', async ({ page }) => {
  await page.goto('http://localhost:3031/combobox')
  await page.click('[data-testid=block-combobox] button')
  await wait(10)
  expect(await page.getByTestId('block-combobox').screenshot()).toMatchSnapshot('combobox.png')
})

test('render floating dialog', async ({ page }) => {
  await page.goto('http://localhost:3031/dialog')
  await page.click('[data-testid=open-dialog-button]')
  await wait(310)
  expect(await page.getByTestId('block-dialog').screenshot()).toMatchSnapshot('dialog-open.png')
  await page.click('[data-testid=dialog-overlay]')
  await wait(210)
  expect(await page.getByTestId('block-dialog').screenshot()).toMatchSnapshot('dialog-close.png')
})

test('render floating popover', async ({ page }) => {
  await page.goto('http://localhost:3031/popover')
  await page.click('[data-testid=block-popover] button')
  await wait(210)
  expect(await page.getByTestId('block-popover').screenshot()).toMatchSnapshot('popover.png')
})
