import { type FunctionalComponent, defineComponent, h, mergeProps } from 'vue'
import { Float } from '../../src/float'
import { render } from './utils/testing-library'
import { html } from './utils/html'

const Wrapper: FunctionalComponent = (props, { slots }) => {
  return h('div', mergeProps(props, {
    'class': 'wrapper-class',
    'data-label': 'wrapper label',
  }), slots)
}

const FloatingWrapper: FunctionalComponent = (props, { slots }) => {
  return h('div', mergeProps(props, {
    'class': 'floating-wrapper-class',
    'data-label': 'floating wrapper label',
  }), slots)
}

describe('Render as component for wrapper', () => {
  it('should to render wrapper as HTML tag', async () => {
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

  it('should to render floating wrapper as HTML tag', async () => {
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

  it('should to render wrapper as template', async () => {
    const { container } = render(defineComponent({
      components: { Float },
      template: html`
        <Float show as="template">
          <button type="button">button</button>
          <div>content</div>
        </Float>
      `,
    }))

    const [button, content] = container.children
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

    const wrapper = container.children[1]
    expect(wrapper.innerHTML).toBe('content')
  })

  it('should to render wrapper as component', async () => {
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

  it('should to render floating wrapper as component', async () => {
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
    expect(wrapper).toHaveStyle('position: absolute; z-index: 9999; top: 0px; left: 0px; transform: translate(0px,0px);')
  })
})
