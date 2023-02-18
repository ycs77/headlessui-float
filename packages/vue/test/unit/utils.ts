import { type RenderOptions, cleanup, render } from '@testing-library/vue'
import { afterEach } from 'vitest'

afterEach(() => {
  cleanup()
})

const customRender = (TestComponent: any, options?: RenderOptions) =>
  render(TestComponent, {
    global: {
      stubs: {
        transition: false,
      },
    },
    ...options,
  })

export * from '@testing-library/vue'
export { default as userEvent } from '@testing-library/user-event'
export { customRender as render }
