import { defineComponent } from 'vue'
import { Float } from '../../src/float'
import { renderHydrate, renderSSR } from './utils/ssr'
import { html } from './utils/html'

const Example = defineComponent({
  components: { Float },
  template: html`
    <Float>
      <button type="button">button</button>
      <div>content</div>
    </Float>
  `,
})

describe('SSR', () => {
  it('should to render <Float> on SSR', async () => {
    const { contents } = await renderSSR(Example)

    expect(contents).toContain('button')
    expect(contents).not.toContain('content')
    expect(contents).toContain('<div class="" style="position:absolute;left:0;top:0;z-index:9999;">')
  })

  it('should to hydrate <Float> with show content', async () => {
    const { contents } = await renderHydrate(Example, { show: true })

    expect(contents).toContain('button')
    expect(contents).toContain('content')
    expect(contents).toContain('<div class="" style="position: absolute; left: 0px; top: 0px; z-index: 9999;">')
  })

  it('should to hydrate <Float> with not show content', async () => {
    const { contents } = await renderHydrate(Example, { show: false })

    expect(contents).toContain('button')
    expect(contents).not.toContain('content')
    expect(contents).toContain('<div class="" style="position: absolute; left: 0px; top: 0px; z-index: 9999;">')
  })
})
