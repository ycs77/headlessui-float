import { Transition, defineComponent } from 'vue'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { Float } from '../../src/float'
import { render, screen, userEvent } from './utils'

describe('render components', () => {
  it('should to render <Float> with <Menu>', async () => {
    render(defineComponent({
      components: { Menu, MenuButton, MenuItem, MenuItems, Float, Transition },
      template: `
        <Menu>
          <Float placement="bottom-start" :offset="4">
            <MenuButton class="flex justify-center items-center px-5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-500 text-sm rounded-md">
              Options
            </MenuButton>

            <MenuItems class="w-48 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden focus:outline-none">
              <MenuItem v-slot="{ active }">
                <button type="button" class="block w-full px-4 py-1.5 text-left text-sm" :class="{ 'bg-indigo-500 text-white': active }">
                  Account settings
                </button>
              </MenuItem>
              <MenuItem v-slot="{ active }">
                <button type="button" class="block w-full px-4 py-1.5 text-left text-sm" :class="{ 'bg-indigo-500 text-white': active }">
                  Documentation
                </button>
              </MenuItem>
              <MenuItem disabled>
                <span class="block w-full px-4 py-1.5 text-left text-sm opacity-50 cursor-default">
                  Invite a friend (coming soon!)
                </span>
              </MenuItem>
            </MenuItems>
          </Float>
        </Menu>
      `,
    }))

    expect(screen.queryByRole('menu')).toBeNull()

    const button = screen.getByText('Options')
    expect(button).toBeInTheDocument()
    await userEvent.click(button)

    expect(screen.queryByRole('menu')).toBeInTheDocument()
    const menuItems = screen.queryAllByRole('menuitem')
    expect(menuItems).toHaveLength(3)
    expect(menuItems[0]).toBeInTheDocument()
    expect(menuItems[1]).toBeInTheDocument()
    expect(menuItems[2]).toBeInTheDocument()
  })
})
