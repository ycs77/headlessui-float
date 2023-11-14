import { Fragment, forwardRef } from 'react'
import { Float } from '../../src/float'
import { render, waitFor } from './utils/testing-library'

const Wrapper = forwardRef<HTMLDivElement>((props, ref) => (
  <div
    ref={ref}
    {...props}
    className="wrapper-class"
    data-label="wrapper label"
  />
))
Wrapper.displayName = 'Wrapper'

const FloatingWrapper = forwardRef<HTMLDivElement>((props, ref) => (
  <div
    ref={ref}
    {...props}
    className="floating-wrapper-class"
    data-label="floating wrapper label"
  />
))
FloatingWrapper.displayName = 'FloatingWrapper'

describe('Render as component for wrapper', () => {
  it('should to render wrapper as HTML tag', async () => {
    const { container } = render(
      <Float show as="article">
        <button type="button">button</button>
        <div>content</div>
      </Float>
    )

    await waitFor()

    const wrapper = container.children[0]
    expect(wrapper.tagName).toBe('ARTICLE')
  })

  it('should to render floating wrapper as HTML tag', async () => {
    const { container } = render(
      <Float show floatingAs="article">
        <button type="button">button</button>
        <div>content</div>
      </Float>
    )

    await waitFor()

    const wrapper = container.children[1]
    expect(wrapper.tagName).toBe('ARTICLE')
  })

  it('should to render wrapper as Fragment', async () => {
    const { container } = render(
      <Float show as={Fragment}>
        <button type="button">button</button>
        <div>content</div>
      </Float>
    )

    await waitFor()

    const [button, content] = container.children
    expect(button.tagName).toBe('BUTTON')
    expect(content.tagName).toBe('DIV')
  })

  it('should to render floating wrapper as Fragment', async () => {
    const { container } = render(
      <Float show floatingAs={Fragment}>
        <button type="button">button</button>
        <div>content</div>
      </Float>
    )

    await waitFor()

    expect(container.innerHTML).not.toContain('<div style="position: absolute; z-index: 9999; top: 0px; left: 0px;"><div>content</div></div>')
  })

  it('should to render wrapper as component', async () => {
    const { container } = render(
      <Float show as={Wrapper}>
        <button type="button">button</button>
        <div>content</div>
      </Float>
    )

    await waitFor()

    const wrapper = container.children[0]
    expect(wrapper).toHaveClass('wrapper-class')
    expect(wrapper).toHaveAttribute('data-label', 'wrapper label')
  })

  it('should to render floating wrapper as component', async () => {
    const { container } = render(
      <Float show floatingAs={FloatingWrapper}>
        <button type="button">button</button>
        <div>content</div>
      </Float>
    )

    await waitFor()

    const wrapper = container.children[1]
    expect(wrapper).toHaveClass('floating-wrapper-class')
    expect(wrapper).toHaveAttribute('data-label', 'floating wrapper label')
    expect(wrapper).toHaveStyle('position: absolute; z-index: 9999; top: 0px; left: 0px;')
  })
})

describe('Render composable component for wrapper', () => {
  it('should to render other element on composable mode', async () => {
    const { container } = render(
      <Float show composable>
        <div>look me!</div>
        <Float.Reference>
          <button type="button">button</button>
        </Float.Reference>
        <main>
          <Float.Content>
            <div>content</div>
          </Float.Content>
        </main>
      </Float>
    )

    await waitFor()

    const wrapper = container.children[0]
    expect(wrapper.innerHTML).toBe('look me!')
  })

  it('should to render wrapper as HTML tag', async () => {
    const { container } = render(
      <Float show composable>
        <div>look me!</div>
        <Float.Reference as="article">
          <button type="button">button</button>
        </Float.Reference>
        <main>
          <Float.Content>
            <div>content</div>
          </Float.Content>
        </main>
      </Float>
    )

    await waitFor()

    const wrapper = container.children[1]
    expect(wrapper.tagName).toBe('ARTICLE')
  })

  it('should to render floating wrapper as HTML tag', async () => {
    const { container } = render(
      <Float show composable>
        <div>look me!</div>
        <Float.Reference>
          <button type="button">button</button>
        </Float.Reference>
        <main>
          <Float.Content as="article">
            <div>content</div>
          </Float.Content>
        </main>
      </Float>
    )

    await waitFor()

    const wrapper = container.children[2].children[0]
    expect(wrapper.tagName).toBe('ARTICLE')
  })

  it('should to render wrapper as Fragment', async () => {
    const { container } = render(
      <Float show composable>
        <div>look me!</div>
        <Float.Reference as={Fragment}>
          <button type="button">button</button>
        </Float.Reference>
        <main>
          <Float.Content>
            <div>content</div>
          </Float.Content>
        </main>
      </Float>
    )

    await waitFor()

    const wrapper = container.children[1]
    expect(wrapper.innerHTML).toBe('button')
  })

  it('should to render floating wrapper as Fragment', async () => {
    const { container } = render(
      <Float show composable>
        <div>look me!</div>
        <Float.Reference>
          <button type="button">button</button>
        </Float.Reference>
        <main>
          <Float.Content as={Fragment}>
            <div>content</div>
          </Float.Content>
        </main>
      </Float>
    )

    await waitFor()

    expect(container.innerHTML).not.toContain('<div style="position: absolute; z-index: 9999; top: 0px; left: 0px;"><div>content</div></div>')
  })

  it('should to render wrapper as component', async () => {
    const { container } = render(
      <Float show composable>
        <div>look me!</div>
        <Float.Reference as={Wrapper}>
          <button type="button">button</button>
        </Float.Reference>
        <main>
          <Float.Content>
            <div>content</div>
          </Float.Content>
        </main>
      </Float>
    )

    await waitFor()

    const wrapper = container.children[1]
    expect(wrapper).toHaveClass('wrapper-class')
    expect(wrapper).toHaveAttribute('data-label', 'wrapper label')
  })

  it('should to render floating wrapper as component', async () => {
    const { container } = render(
      <Float show composable>
        <div>look me!</div>
        <Float.Reference>
          <button type="button">button</button>
        </Float.Reference>
        <main>
          <Float.Content as={FloatingWrapper}>
            <div>content</div>
          </Float.Content>
        </main>
      </Float>
    )

    await waitFor()

    const wrapper = container.children[2].children[0]
    expect(wrapper).toHaveClass('floating-wrapper-class')
    expect(wrapper).toHaveAttribute('data-label', 'floating wrapper label')
    expect(wrapper).toHaveStyle('position: absolute; z-index: 9999; top: 0px; left: 0px;')
  })
})
