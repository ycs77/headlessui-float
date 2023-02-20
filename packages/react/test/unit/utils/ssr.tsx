// Reference: https://github.com/tailwindlabs/headlessui/blob/c7f6bc60ed2ab6c84fb080b0f419ed16824c880d/packages/%40headlessui-react/src/test-utils/ssr.tsx

import type { RenderOptions, RenderResult } from '@testing-library/react'
import { cleanup, render } from '@testing-library/react'
import type { ReactElement } from 'react'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { env } from '../../../src/utils/env'

type ServerRenderOptions = Omit<RenderOptions, 'queries'> & {
  strict?: boolean
}

interface ServerRenderResult {
  type: 'ssr' | 'hydrate'
  contents: string
  result: RenderResult
  hydrate: (clientComponent?: ReactElement) => Promise<ServerRenderResult>
}

export async function renderSSR(component: ReactElement, options: ServerRenderOptions = {}): Promise<ServerRenderResult> {
  let container = document.createElement('div')
  document.body.appendChild(container)
  options = { ...options, container }

  if (options.strict) {
    options = {
      ...options,
      wrapper({ children }) {
        return <React.StrictMode>{children}</React.StrictMode>
      },
    }
  }

  env.set('server')
  const contents = renderToString(component)
  const result = render(<div dangerouslySetInnerHTML={{ __html: contents }} />, options)

  async function hydrate(clientComponent?: ReactElement): Promise<ServerRenderResult> {
    cleanup()

    container.remove()

    container = document.createElement('div')
    container.innerHTML = contents
    document.body.appendChild(container)

    env.set('client')

    const newResult = render(clientComponent ?? component, {
      ...options,
      container,
      hydrate: true,
    })

    return {
      type: 'hydrate',
      contents: container.innerHTML,
      result: newResult,
      hydrate,
    }
  }

  return {
    type: 'ssr',
    contents,
    result,
    hydrate,
  }
}

export async function renderHydrate(
  component: ReactElement,
  clientComponent?: ReactElement,
  options: ServerRenderOptions = {},
) {
  const { hydrate } = await renderSSR(component, options)
  return await hydrate(clientComponent)
}
