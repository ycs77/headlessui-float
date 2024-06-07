import { type RenderOptions, cleanup, render, waitFor } from '@testing-library/vue'
import { afterEach } from 'vitest'

afterEach(() => {
  cleanup()
})

const customRender = <C>(TestComponent: any, options?: RenderOptions<C>) =>
  render(TestComponent, {
    global: {
      stubs: {
        transition: false,
      },
    },
    ...options,
  })

const promisedWaitFor = () => new Promise<void>(resolve => waitFor(resolve))
const wait = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms))

export * from '@testing-library/vue'
export { default as userEvent } from '@testing-library/user-event'
export {
  customRender as render,
  promisedWaitFor as waitFor,
  wait,
}
