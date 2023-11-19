import { expect, test } from '@playwright/test'

const placements = [
  'top',
  'top-start',
  'top-end',
  'right',
  'right-start',
  'right-end',
  'bottom',
  'bottom-start',
  'bottom-end',
  'left',
  'left-start',
  'left-end',
]
for (const placement of placements) {
  test(`placement - ${placement}`, async ({ page }) => {
    await page.goto('http://localhost:3031/floatingui-options')
    const locator = page.getByTestId('placement-select')
    await locator.selectOption(placement)
    expect(await page.getByTestId('block-placement').screenshot()).toMatchSnapshot(`placement-${placement}.png`)
  })
}

for (const offset of ['0', '4', '100']) {
  test(`offset - ${offset}`, async ({ page }) => {
    await page.goto('http://localhost:3031/floatingui-options')
    const locator = page.getByTestId('offset-input')
    await locator.fill('')
    await locator.type(offset)
    expect(await page.getByTestId('block-offset').screenshot()).toMatchSnapshot(`offset-${offset}.png`)
  })
}

for (const scrollTo of ['82', '240', '482']) {
  test(`shift - scrollto-${scrollTo}`, async ({ page }) => {
    await page.goto('http://localhost:3031/floatingui-options')
    await page.getByTestId('block-shift').evaluate((el, scrollTo) => {
      el.scrollTo(0, Number.parseInt(scrollTo))
    }, scrollTo)
    expect(await page.getByTestId('block-shift').screenshot()).toMatchSnapshot(`shift-scrollto-${scrollTo}.png`)
  })
}

for (const scrollTo of ['482', '250', '160']) {
  test(`flip - scrollto-${scrollTo}`, async ({ page }) => {
    await page.goto('http://localhost:3031/floatingui-options')
    await page.getByTestId('block-flip').evaluate((el, scrollTo) => {
      el.scrollTo(0, Number.parseInt(scrollTo))
    }, scrollTo)
    expect(await page.getByTestId('block-flip').screenshot()).toMatchSnapshot(`flip-scrollto-${scrollTo}.png`)
  })
}

for (const scrollTo of ['220', '400', '50', '0']) {
  test(`hide - scrollto-${scrollTo}`, async ({ page }) => {
    await page.goto('http://localhost:3031/floatingui-options')
    await page.getByTestId('block-hide-scrollable').evaluate((el, scrollTo) => {
      el.scrollTo(0, Number.parseInt(scrollTo))
    }, scrollTo)
    expect(await page.getByTestId('block-hide').screenshot()).toMatchSnapshot(`hide-scrollto-${scrollTo}.png`)
  })
}
