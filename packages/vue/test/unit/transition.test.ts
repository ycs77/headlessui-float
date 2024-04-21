import { defineComponent } from 'vue'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { Float } from '../../src/float'
import { render, screen, userEvent, wait } from './utils/testing-library'
import { html } from './utils/html'

describe('Transition', () => {
  it('should to render <Transition> of Headless UI', async () => {
    render(defineComponent({
      components: { Menu, MenuButton, MenuItem, MenuItems, Float },
      template: html`
        <Menu>
          <Float :vue-transition="false">
            <MenuButton>button</MenuButton>
            <MenuItems>content</MenuItems>
          </Float>
        </Menu>
      `,
    }))

    const button = screen.getByText('button')
    expect(button).toBeInTheDocument()
    expect(screen.queryByRole('menu')).toBeNull()

    await userEvent.click(button)
    await wait(50)

    expect(screen.queryByRole('menu')).toHaveAttribute('data-headlessui-state', 'open')

    await userEvent.click(button)
    await wait(50)

    expect(screen.queryByRole('menu')).toBeNull()
  })

  it('should to render <Transition> of Vue', async () => {
    render(defineComponent({
      components: { Menu, MenuButton, MenuItem, MenuItems, Float },
      template: html`
        <Menu>
          <Float vue-transition>
            <MenuButton>button</MenuButton>
            <MenuItems>content</MenuItems>
          </Float>
        </Menu>
      `,
    }))

    const button = screen.getByText('button')
    expect(button).toBeInTheDocument()
    expect(screen.queryByRole('menu')).toBeNull()

    await userEvent.click(button)
    await wait(50)

    expect(screen.queryByRole('menu')).toHaveAttribute('data-headlessui-state', 'open')

    await userEvent.click(button)
    await wait(50)

    expect(screen.queryByRole('menu')).toBeNull()
  })
})
