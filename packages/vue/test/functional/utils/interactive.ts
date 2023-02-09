import type { Page } from '@playwright/test'

export async function click(page: Page, selector: string) {
  return await page.evaluate(selector => {
    document.querySelector<HTMLButtonElement>(selector)!.click()
  }, selector)
}
