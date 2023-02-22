import { Menu } from '@headlessui/react'
import { Float } from '../../src/float'
import { render, screen, userEvent, waitFor } from './utils/testing-library'

describe('Render components', () => {
  it('should to render <Float> with <Menu>', async () => {
    render(
      <Menu>
        <Float placement="bottom-start" offset={4}>
          <Menu.Button>Options</Menu.Button>
          <Menu.Items>
            <Menu.Item><button type="button">Account settings</button></Menu.Item>
            <Menu.Item><button type="button">Documentation</button></Menu.Item>
            <Menu.Item disabled><span>Invite a friend (coming soon!)</span></Menu.Item>
          </Menu.Items>
        </Float>
      </Menu>
    )

    await waitFor()

    const button = screen.getByText('Options')
    await waitFor()
    expect(button).toBeInTheDocument()
    expect(screen.queryByRole('menu')).toBeNull()

    await userEvent.click(button)
    await waitFor()

    expect(screen.queryByRole('menu')).toHaveAttribute('data-headlessui-state', 'open')
    const menuItems = screen.queryAllByRole('menuitem')
    expect(menuItems).toHaveLength(3)

    await userEvent.click(button)
    await waitFor()

    expect(screen.queryByRole('menu')).toBeNull()
  })
})
