import { expect, test } from '@playwright/test'
import { click } from './utils/interactive'

test('should render floating menu', async ({ page }) => {
  await page.goto('http://localhost:3032/menu')
  await click(page, '.block-menu button')
  expect(await page.locator('.block-menu').screenshot()).toMatchSnapshot('menu.png')
})
