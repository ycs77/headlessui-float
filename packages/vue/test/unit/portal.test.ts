import { defineComponent } from 'vue'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { Float } from '../../src/float'
import { render, screen, userEvent, wait } from './utils/testing-library'
import { html } from './utils/html'

describe('Portal elements', () => {
  it('should to render element to portal root', async () => {
    render(defineComponent({
      components: { Menu, MenuButton, MenuItem, MenuItems, Float },
      template: html`
        <Menu>
          <Float portal>
            <MenuButton>Options</MenuButton>
            <MenuItems>
              <MenuItem><button type="button">Account settings</button></MenuItem>
              <MenuItem><button type="button">Documentation</button></MenuItem>
            </MenuItems>
          </Float>
        </Menu>
      `,
    }))

    const button = screen.getByText('Options')
    await userEvent.click(button)
    await wait(50)

    const menu = screen.queryByRole('menu')
    expect(menu).toBeInTheDocument()
    expect(menu?.closest('#headlessui-portal-root')).toBeTruthy()
    expect(menu?.innerHTML).toContain('Account settings')
    expect(menu?.innerHTML).toContain('Documentation')
  })
})
