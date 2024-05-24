import { Menu } from '@headlessui/react'
import { Float } from '../../src/float'
import { render, screen, userEvent, waitFor } from './utils/testing-library'

describe('Transition', () => {
  it('should to render <Transition> of Headless UI', async () => {
    render(
      <Menu>
        <Float>
          <Menu.Button>button</Menu.Button>
          <Menu.Items>content</Menu.Items>
        </Float>
      </Menu>
    )

    await waitFor()

    const button = screen.getByText('button')
    await waitFor()
    expect(button).toBeInTheDocument()
    expect(screen.queryByRole('menu')).toBeNull()

    await userEvent.click(button)
    await waitFor()

    expect(screen.queryByRole('menu')).toHaveAttribute('data-headlessui-state', 'open')

    await userEvent.click(button)
    await waitFor()

    expect(screen.queryByRole('menu')).toBeNull()
  })
})
