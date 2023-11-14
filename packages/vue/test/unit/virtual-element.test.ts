import { defineComponent } from 'vue'
import { FloatVirtual, type FloatVirtualInitialProps } from '../../src/float'
import { render, screen, wait } from './utils/testing-library'
import { html } from './utils/html'

describe('Render virtual elements', () => {
  it('should to render <FloatVirtual>', async () => {
    render(defineComponent({
      components: { FloatVirtual },
      methods: {
        onInitial({ reference }: FloatVirtualInitialProps) {
          reference.value = {
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
          }
        },
      },
      template: html`
        <FloatVirtual show @initial="onInitial">
          <div data-testid="content">content</div>
        </FloatVirtual>
      `,
    }))

    await wait(50)

    expect(screen.getByTestId('content').innerHTML).toBe('content')
  })
})
