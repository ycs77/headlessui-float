import { useEffect } from 'react'
import { Float, type FloatVirtualInitialProps } from '../../src/float'
import { render, screen, waitFor } from './utils/testing-library'

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
})
