import { Listbox, Menu } from '@headlessui/react'
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
  it('should to render <Float> with <Listbox>', async () => {
    const Options = ({ options }: { options: string[] }) => (
      <Listbox.Options>
        {options.map(option => (
          <Listbox.Option key={option} value={option}>
            {option}
          </Listbox.Option>
        ))}
      </Listbox.Options>
    )
    render(
      <Listbox>
        <Float placement="bottom-start" offset={4}>
          <Listbox.Button>Options</Listbox.Button>
          <Options options={['Account settings', 'Documentation', 'Invite a friend (coming soon!)']} />
        </Float>
      </Listbox>
    )
    await waitFor()

    const button = screen.getByText('Options')
    await waitFor()
    expect(button).toBeInTheDocument()
    expect(screen.queryByRole('listbox')).toBeNull()

    await userEvent.click(button)
    await waitFor()

    expect(screen.queryByRole('listbox')).toHaveAttribute('data-headlessui-state', 'open')
    const listboxOptions = screen.queryAllByRole('option')
    expect(listboxOptions).toHaveLength(3)

    await userEvent.click(button)
    await waitFor()

    expect(screen.queryByRole('listbox')).toBeNull()
  })
})
