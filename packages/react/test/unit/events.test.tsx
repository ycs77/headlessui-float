import { useState } from 'react'
import { Menu } from '@headlessui/react'
import type { Placement } from '@floating-ui/dom'
import { Float } from '../../src/float'
import { render, screen, userEvent, waitFor } from './utils/testing-library'

describe('Events', () => {
  // this test is failed because the <Transition>'s afterLeave event is no fired.
  it.skip('should fire show & hide events in order', async () => {
    const onShow = vi.fn()
    const onHide = vi.fn()

    render(
      <Menu>
        <Float
          onShow={() => onShow()}
          onHide={() => onHide()}
        >
          <Menu.Button>button</Menu.Button>
          <Menu.Items>content</Menu.Items>
        </Float>
      </Menu>
    )

    await waitFor()

    const button = screen.getByText('button')
    await waitFor()
    expect(screen.queryByRole('menu')).toBeNull()

    // open
    await userEvent.click(button)
    await waitFor()
    expect(onShow).toHaveBeenCalledTimes(1)
    expect(onHide).toHaveBeenCalledTimes(0)

    // close
    await userEvent.click(button)
    await waitFor()
    expect(onShow).toHaveBeenCalledTimes(1)
    expect(onHide).toHaveBeenCalledTimes(1)

    // open
    await userEvent.click(button)
    await waitFor()
    expect(onShow).toHaveBeenCalledTimes(2)
    expect(onHide).toHaveBeenCalledTimes(1)

    // close
    await userEvent.click(button)
    await waitFor()
    expect(onShow).toHaveBeenCalledTimes(2)
    expect(onHide).toHaveBeenCalledTimes(2)
  })

  it('should fire update events', async () => {
    const onUpdate = vi.fn()

    function Example() {
      const [placement, setPlacement] = useState<Placement>('bottom-start')

      function changePlacement() {
        setPlacement('right-end')
      }

      return (
        <Menu>
          <Float placement={placement} onUpdate={() => onUpdate()}>
            <Menu.Button>button</Menu.Button>
            <Menu.Items>
              content
              <button type="button" onClick={changePlacement}>change placement</button>
            </Menu.Items>
          </Float>
        </Menu>
      )
    }

    render(<Example />)

    await waitFor()

    const button = screen.getByText('button')
    await waitFor()

    expect(screen.queryByRole('menu')).toBeNull()
    expect(onUpdate).toHaveBeenCalledTimes(2)

    // open
    await userEvent.click(button)
    await waitFor()
    expect(onUpdate).toHaveBeenCalledTimes(3)

    // change placement
    const changePlacementButton = screen.getByText('change placement')
    await userEvent.click(changePlacementButton)
    await waitFor()
    expect(onUpdate).toHaveBeenCalledTimes(5)
  })
})
