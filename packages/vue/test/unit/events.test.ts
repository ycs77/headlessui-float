import { defineComponent } from 'vue'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { Float } from '../../src/float'
import { render, screen, userEvent, wait } from './utils/testing-library'
import { html } from './utils/html'

describe('Events', () => {
  it('should fire show & hide events in order', async () => {
    const onShow = vi.fn()
    const onHide = vi.fn()

    render(defineComponent({
      components: { Menu, MenuButton, MenuItem, MenuItems, Float },
      methods: { onShow, onHide },
      template: html`
        <Menu>
          <Float
            @show="onShow"
            @hide="onHide"
          >
            <MenuButton>button</MenuButton>
            <MenuItems>content</MenuItems>
          </Float>
        </Menu>
      `,
    }))

    const button = screen.getByText('button')
    expect(screen.queryByRole('menu')).toBeNull()
    expect(onShow).toHaveBeenCalledTimes(0)
    expect(onHide).toHaveBeenCalledTimes(0)

    // open
    await userEvent.click(button)
    await wait(50)
    expect(onShow).toHaveBeenCalledTimes(1)
    expect(onHide).toHaveBeenCalledTimes(0)

    // close
    await userEvent.click(button)
    await wait(50)
    expect(onShow).toHaveBeenCalledTimes(1)
    expect(onHide).toHaveBeenCalledTimes(1)

    // open
    await userEvent.click(button)
    await wait(50)
    expect(onShow).toHaveBeenCalledTimes(2)
    expect(onHide).toHaveBeenCalledTimes(1)

    // close
    await userEvent.click(button)
    await wait(50)
    expect(onShow).toHaveBeenCalledTimes(2)
    expect(onHide).toHaveBeenCalledTimes(2)
  })

  it('should fire update events', async () => {
    const onUpdate = vi.fn()

    render(defineComponent({
      components: { Menu, MenuButton, MenuItem, MenuItems, Float },
      data: () => ({ placement: 'bottom-start' }),
      methods: {
        onUpdate,
        changePlacement() {
          this.placement = 'right-end'
        },
      },
      template: html`
        <Menu>
          <Float :placement="placement" @update="onUpdate">
            <MenuButton>button</MenuButton>
            <MenuItems>
              content
              <button type="button" @click="changePlacement">change placement</button>
            </MenuItems>
          </Float>
        </Menu>
      `,
    }))

    const button = screen.getByText('button')

    expect(screen.queryByRole('menu')).toBeNull()
    expect(onUpdate).toHaveBeenCalledTimes(0)

    // open
    await userEvent.click(button)
    await wait(50)
    expect(onUpdate).toHaveBeenCalledTimes(1)

    // change placement
    const changePlacementButton = screen.getByText('change placement')
    await userEvent.click(changePlacementButton)
    await wait(50)
    expect(onUpdate).toHaveBeenCalledTimes(2)
  })
})
