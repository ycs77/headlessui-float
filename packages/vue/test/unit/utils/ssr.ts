// Reference: https://github.com/tailwindlabs/headlessui/blob/c7f6bc60ed2ab6c84fb080b0f419ed16824c880d/packages/%40headlessui-vue/src/test-utils/ssr.ts

import { createApp, createSSRApp, nextTick } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { env } from '../../../src/utils/env'

export async function renderSSR(component: any, props: Record<string, any> = {}) {
  const container = document.createElement('div')
  document.body.appendChild(container)

  env.set('server')
  const app = createSSRApp(component, props)
  const contents = await renderToString(app)
  container.innerHTML = contents

  return {
    contents,
    async hydrate() {
      env.set('client')
      const app = createApp(component, props)
      app.mount(container)

      await nextTick()

      return {
        contents: container.innerHTML,
      }
    },
  }
}

export async function renderHydrate(component: any, props: any = {}) {
  const { hydrate } = await renderSSR(component, props)
  return hydrate()
}
