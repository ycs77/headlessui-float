import { type FunctionalComponent, defineComponent, h, mergeProps } from 'vue'
import { Float, FloatContent, FloatReference } from '../../src/float'
import { render, wait } from './utils/testing-library'
import { html } from './utils/html'

const Wrapper: FunctionalComponent = (props, { slots }) => {
  return h('div', mergeProps(props, {
    class: 'wrapper-class',
    'data-label': 'wrapper label',
  }), slots)
}

const FloatingWrapper: FunctionalComponent = (props, { slots }) => {
  return h('div', mergeProps(props, {
    class: 'floating-wrapper-class',
    'data-label': 'floating wrapper label',
  }), slots)
}

describe('Render as component for wrapper', () => {
  it('should to render wrapper as HTML tag', () => {
    const { container } = render(defineComponent({
      components: { Float },
      template: html`
        <Float show as="article">
          <button type="button">button</button>
          <div>content</div>
        </Float>
      `,
    }))

    const wrapper = container.children[0]
    expect(wrapper.tagName).toBe('ARTICLE')
  })

  it('should to render floating wrapper as HTML tag', () => {
    const { container } = render(defineComponent({
      components: { Float },
      template: html`
        <Float show floating-as="article">
          <button type="button">button</button>
          <div>content</div>
        </Float>
      `,
    }))

    const wrapper = container.children[1]
    expect(wrapper.tagName).toBe('ARTICLE')
  })

  it('should to render wrapper as template', () => {
    const { container } = render(defineComponent({
      components: { Float },
      template: html`
        <Float show as="template">
          <button type="button">button</button>
          <div>content</div>
        </Float>
      `,
    }))

    const button = container.children[0]
    const content = container.children[1]
    expect(button.tagName).toBe('BUTTON')
    expect(content.tagName).toBe('DIV')
  })

  it('should to render floating wrapper as template', async () => {
    const { container } = render(defineComponent({
      components: { Float },
      template: html`
        <Float show floating-as="template">
          <button type="button">button</button>
          <div>content</div>
        </Float>
      `,
    }))

    await wait(50)

    expect(container.innerHTML).not.toContain('<div style="position: absolute; z-index: 9999; top: 0px; left: 0px;"><div class="">content</div></div>')
  })

  it('should to render wrapper as component', () => {
    const { container } = render(defineComponent({
      components: { Float },
      data: () => ({ Wrapper }),
      template: html`
        <Float show :as="Wrapper">
          <button type="button">button</button>
          <div>content</div>
        </Float>
      `,
    }))

    const wrapper = container.children[0]
    expect(wrapper).toHaveClass('wrapper-class')
    expect(wrapper).toHaveAttribute('data-label', 'wrapper label')
  })

  it('should to render floating wrapper as component', () => {
    const { container } = render(defineComponent({
      components: { Float },
      data: () => ({ FloatingWrapper }),
      template: html`
        <Float show :floating-as="FloatingWrapper">
          <button type="button">button</button>
          <div>content</div>
        </Float>
      `,
    }))

    const wrapper = container.children[1]
    expect(wrapper).toHaveClass('floating-wrapper-class')
    expect(wrapper).toHaveAttribute('data-label', 'floating wrapper label')
    expect(wrapper).toHaveStyle('position: absolute; z-index: 9999; top: 0px; left: 0px;')
  })
})

describe('Render composable component for wrapper', () => {
  it('should to render other element on composable mode', () => {
    const { container } = render(defineComponent({
      components: { Float, FloatReference, FloatContent },
      template: html`
        <Float show composable>
          <div>look me!</div>
          <FloatReference>
            <button type="button">button</button>
          </FloatReference>
          <main>
            <FloatContent>
              <div>content</div>
            </FloatContent>
          </main>
        </Float>
      `,
    }))

    const wrapper = container.children[0]
    expect(wrapper.innerHTML).toBe('look me!')
  })

  it('should to render <FloatReference> wrapper as HTML tag', () => {
    const { container } = render(defineComponent({
      components: { Float, FloatReference, FloatContent },
      template: html`
        <Float show composable>
          <div>look me!</div>
          <FloatReference as="article">
            <button type="button">button</button>
          </FloatReference>
          <main>
            <FloatContent>
              <div>content</div>
            </FloatContent>
          </main>
        </Float>
      `,
    }))

    const wrapper = container.children[1]
    expect(wrapper.tagName).toBe('ARTICLE')
  })

  it('should to render <FloatContent> wrapper as HTML tag', () => {
    const { container } = render(defineComponent({
      components: { Float, FloatReference, FloatContent },
      template: html`
        <Float show composable>
          <div>look me!</div>
          <FloatReference>
            <button type="button">button</button>
          </FloatReference>
          <main>
            <FloatContent as="article">
              <div>content</div>
            </FloatContent>
          </main>
        </Float>
      `,
    }))

    const wrapper = container.children[2].children[0]
    expect(wrapper.tagName).toBe('ARTICLE')
  })

  it('should to render <FloatReference> wrapper as template', () => {
    const { container } = render(defineComponent({
      components: { Float, FloatReference, FloatContent },
      template: html`
        <Float show composable>
          <div>look me!</div>
          <FloatReference as="template">
            <button type="button">button</button>
          </FloatReference>
          <main>
            <FloatContent>
              <div>content</div>
            </FloatContent>
          </main>
        </Float>
      `,
    }))

    const wrapper = container.children[1]
    expect(wrapper.innerHTML).toBe('button')
  })

  it('should to render <FloatContent> wrapper as template', async () => {
    const { container } = render(defineComponent({
      components: { Float, FloatReference, FloatContent },
      template: html`
        <Float show composable>
          <div>look me!</div>
          <FloatReference>
            <button type="button">button</button>
          </FloatReference>
          <main>
            <FloatContent as="template">
              <div>content</div>
            </FloatContent>
          </main>
        </Float>
      `,
    }))

    await wait(50)

    expect(container.innerHTML).not.toContain('<div style="position: absolute; z-index: 9999; top: 0px; left: 0px;"><div class="">content</div></div>')
  })

  it('should to render <FloatReference> wrapper as component', () => {
    const { container } = render(defineComponent({
      components: { Float, FloatReference, FloatContent },
      data: () => ({ Wrapper }),
      template: html`
        <Float show composable>
          <div>look me!</div>
          <FloatReference :as="Wrapper">
            <button type="button">button</button>
          </FloatReference>
          <main>
            <FloatContent>
              <div>content</div>
            </FloatContent>
          </main>
        </Float>
      `,
    }))

    const wrapper = container.children[1]
    expect(wrapper).toHaveClass('wrapper-class')
    expect(wrapper).toHaveAttribute('data-label', 'wrapper label')
  })

  it('should to render <FloatContent> wrapper as component', () => {
    const { container } = render(defineComponent({
      components: { Float, FloatReference, FloatContent },
      data: () => ({ FloatingWrapper }),
      template: html`
        <Float show composable>
          <div>look me!</div>
          <FloatReference>
            <button type="button">button</button>
          </FloatReference>
          <main>
            <FloatContent :as="FloatingWrapper">
              <div>content</div>
            </FloatContent>
          </main>
        </Float>
      `,
    }))

    const wrapper = container.children[2].children[0]
    expect(wrapper).toHaveClass('floating-wrapper-class')
    expect(wrapper).toHaveAttribute('data-label', 'floating wrapper label')
    expect(wrapper).toHaveStyle('position: absolute; z-index: 9999; top: 0px; left: 0px;')
  })
})
