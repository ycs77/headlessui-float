import { Menu } from '@headlessui/react'
import { Float } from '../../src/float'
import { render, screen, userEvent, waitFor } from './utils/testing-library'

describe('Portal elements', () => {
  it('should to render element to portal root', async () => {
    render(
      <Menu>
        <Float portal>
          <Menu.Button>Options</Menu.Button>
          <Menu.Items>
            <Menu.Item><button type="button">Account settings</button></Menu.Item>
            <Menu.Item><button type="button">Documentation</button></Menu.Item>
          </Menu.Items>
        </Float>
      </Menu>
    )

    await waitFor()

    const button = screen.getByText('Options')
    await waitFor()

    await userEvent.click(button)
    await waitFor()

    const menu = screen.queryByRole('menu')
    expect(menu).toBeInTheDocument()
    expect(menu?.closest('#headlessui-portal-root')).toBeTruthy()
    expect(menu?.innerHTML).toContain('Account settings')
    expect(menu?.innerHTML).toContain('Documentation')
  })
})
