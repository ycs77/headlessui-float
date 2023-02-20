import { type RenderEnv, env } from '../../src/utils/env'
import { waitFor } from './utils/testing-library'
import { renderSSR } from './utils/ssr'

async function createExample(renderEnv: RenderEnv) {
  env.set(renderEnv)

  if (env.isServer) {
    vi.stubGlobal('window', undefined)
    vi.stubGlobal('document', undefined)
  }

  const ResizeObserverMock = vi.fn(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }))
  vi.stubGlobal('ResizeObserver', ResizeObserverMock)

  const { Float } = await import('../../src/float')

  function Example(props: { show?: boolean }) {
    const { show = false } = props
    return (
      <Float show={show}>
        <button type="button">button</button>
        <div>content</div>
      </Float>
    )
  }

  if (env.isServer) {
    vi.unstubAllGlobals()
  }

  return Example
}

describe('SSR', () => {
  it('should to render <Float> on SSR', async () => {
    const Example = await createExample('server')
    const { contents } = await renderSSR(<Example />)

    expect(contents).toContain('button')
    expect(contents).not.toContain('content')
    expect(contents).toContain('<div style="position:absolute;z-index:9999;top:0px;left:0px;right:auto;bottom:auto;transform:translate(0px,0px)">')
  })

  it('should to hydrate <Float> with show content', async () => {
    let Example = await createExample('server')
    const { hydrate } = await renderSSR(<Example show={true} />)

    Example = await createExample('client')
    const { contents } = await hydrate(<Example show={true} />)

    await waitFor()

    expect(contents).toContain('button')
    expect(contents).toContain('content')
    expect(contents).toContain('<div style="position:absolute;z-index:9999;top:0px;left:0px;right:auto;bottom:auto;transform:translate(0px,0px)">')
  })

  it('should to hydrate <Float> with not show content', async () => {
    let Example = await createExample('server')
    const { hydrate } = await renderSSR(<Example show={false} />)

    Example = await createExample('client')
    const { contents } = await hydrate(<Example show={false} />)

    await waitFor()

    expect(contents).toContain('button')
    expect(contents).not.toContain('content')
    expect(contents).toContain('<div style="position:absolute;z-index:9999;top:0px;left:0px;right:auto;bottom:auto;transform:translate(0px,0px)">')
  })
})
