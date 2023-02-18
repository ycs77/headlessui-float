/* eslint-disable import/export */
import type { ReactElement } from 'react'
import { render, cleanup, waitFor } from '@testing-library/react'
import type { Queries } from '@testing-library/dom'
import { afterEach } from 'vitest'

afterEach(() => {
  cleanup()
})

const customRender = (ui: ReactElement, options = {}) =>
  render<Queries>(ui, {
    // wrap provider(s) here if needed
    wrapper: ({ children }) => children,
    ...options,
  })

const promisedWaitFor = () => new Promise<void>(resolve => waitFor(resolve))

export * from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'
export {
  customRender as render,
  promisedWaitFor as waitFor,
}