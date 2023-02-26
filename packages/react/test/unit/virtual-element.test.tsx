import { useEffect } from 'react'
import { Menu } from '@headlessui/react'
import { Float, type FloatVirtualInitialProps } from '../../src/float'
import { fireEvent, render, screen, userEvent, wait, waitFor } from './utils/testing-library'

describe('Render virtual elements', () => {
  it('should to render <Float.Virtual>', async () => {
    function onInitial({ refs }: FloatVirtualInitialProps) {
      useEffect(() => {
        refs.setPositionReference({
          getBoundingClientRect() {
            return {
              width: 0,
              height: 0,
              x: 300,
              y: 120,
              top: 120,
              left: 300,
              right: 300,
              bottom: 120,
            }
          },
        })
      }, [])
    }

    render(
      <Float.Virtual show onInitial={onInitial}>
        <div data-testid="content">content</div>
      </Float.Virtual>
    )

    await waitFor()

    expect(screen.getByTestId('content').innerHTML).toBe('content')
  })

  it('should to render <Float.ContextMenu>', async () => {
    render(
      <Float.ContextMenu>
        {({ close }) => (
          <Menu>
            <Menu.Items static>
              <Menu.Item><button type="button" onClick={close}>Account settings</button></Menu.Item>
              <Menu.Item><button type="button" onClick={close}>Documentation</button></Menu.Item>
            </Menu.Items>
          </Menu>
        )}
      </Float.ContextMenu>
    )

    await waitFor()

    fireEvent.contextMenu(document, { clientX: 200, clientY: 170 })
    await wait(50)

    const menu = screen.getByRole('menu')
    const button = screen.getByText('Documentation')
    expect(menu).toBeInTheDocument()
    expect(menu.innerHTML).toContain('Account settings')
    expect(menu.innerHTML).toContain('Documentation')
    expect(menu.style.transform).toBe('translate(200px,170px)')

    await userEvent.click(button)
    await waitFor()

    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('should to render <Float.Cursor>', async () => {
    render(
      <Float.Cursor>
        <div data-testid="content">cursor content</div>
      </Float.Cursor>
    )

    await waitFor()

    fireEvent.mouseEnter(document, { clientX: 200, clientY: 170 })
    await wait(50)
    fireEvent.mouseMove(document, { clientX: 200, clientY: 170 })
    await wait(50)

    const element = screen.getByTestId('content')
    expect(element.innerHTML).toBe('cursor content')
    expect(element.style.transform).toBe('translate(200px,170px)')
  })
})
