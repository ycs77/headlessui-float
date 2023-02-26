import { defineComponent } from 'vue'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { Float } from '../../src/float'
import { render, screen, userEvent, wait } from './utils/testing-library'
import { html } from './utils/html'

describe('Render components', () => {
  it('should to render <Float> with <Menu>', async () => {
    render(defineComponent({
      components: { Menu, MenuButton, MenuItem, MenuItems, Float },
      template: html`
        <Menu>
          <Float placement="bottom-start" :offset="4">
            <MenuButton>Options</MenuButton>
            <MenuItems>
              <MenuItem><button type="button">Account settings</button></MenuItem>
              <MenuItem><button type="button">Documentation</button></MenuItem>
              <MenuItem disabled><span>Invite a friend (coming soon!)</span></MenuItem>
            </MenuItems>
          </Float>
        </Menu>
      `,
    }))

    const button = screen.getByText('Options')
    expect(button).toBeInTheDocument()
    expect(screen.queryByRole('menu')).toBeNull()

    await userEvent.click(button)
    await wait(50)

    expect(screen.queryByRole('menu')).toHaveAttribute('data-headlessui-state', 'open')
    const menuItems = screen.queryAllByRole('menuitem')
    expect(menuItems).toHaveLength(3)

    await userEvent.click(button)
    await wait(50)

    expect(screen.queryByRole('menu')).toBeNull()
  })
})
