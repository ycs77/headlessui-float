import { defineComponent } from 'vue'
import { Menu, MenuItem, MenuItems } from '@headlessui/vue'
import { FloatContextMenu, FloatCursor, FloatVirtual, type FloatVirtualInitialProps } from '../../src/float'
import { fireEvent, render, screen, userEvent, wait } from './utils/testing-library'
import { html } from './utils/html'

describe('Render virtual elements', () => {
  it('should to render <FloatVirtual>', async () => {
    render(defineComponent({
      components: { FloatVirtual },
      methods: {
        onInitial({ reference }: FloatVirtualInitialProps) {
          reference.value = {
            getBoundingClientRect() {
              return {
                width: 0,
                height: 0,
                x: 300,
                y: 120,
                top: 120,
                left: 300,
                right: 300,
                bottom: 120,
              }
            },
          }
        },
      },
      template: html`
        <FloatVirtual show @initial="onInitial">
          <div data-testid="content">content</div>
        </FloatVirtual>
      `,
    }))

    await wait(50)

    expect(screen.getByTestId('content').innerHTML).toBe('content')
  })

  it('should to render <FloatContextMenu>', async () => {
    render(defineComponent({
      components: { Menu, MenuItem, MenuItems, FloatContextMenu },
      template: html`
        <FloatContextMenu v-slot="{ close }">
          <Menu>
            <MenuItems static>
              <MenuItem><button type="button" @click="close">Account settings</button></MenuItem>
              <MenuItem><button type="button" @click="close">Documentation</button></MenuItem>
            </MenuItems>
          </Menu>
        </FloatContextMenu>
      `,
    }))

    await fireEvent.contextMenu(document, { clientX: 200, clientY: 170 })
    await wait(50)

    const menu = screen.getByRole('menu')
    const button = screen.getByText('Documentation')
    expect(menu).toBeInTheDocument()
    expect(menu.innerHTML).toContain('Account settings')
    expect(menu.innerHTML).toContain('Documentation')
    expect(menu.style.position).toBe('absolute')
    expect(menu.style.top).toBe('170px')
    expect(menu.style.left).toBe('200px')

    await userEvent.click(button)
    await wait(50)

    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('should to render <FloatCursor>', async () => {
    render(defineComponent({
      components: { FloatCursor },
      template: html`
        <FloatCursor>
          <div data-testid="content">cursor content</div>
        </FloatCursor>
      `,
    }))

    await fireEvent.mouseEnter(document, { clientX: 200, clientY: 170 })
    await wait(50)
    await fireEvent.mouseMove(document, { clientX: 200, clientY: 170 })
    await wait(50)

    const element = screen.getByTestId('content')
    expect(element.innerHTML).toBe('cursor content')
    expect(element.style.position).toBe('absolute')
    expect(element.style.top).toBe('170px')
    expect(element.style.left).toBe('200px')
  })
})
