import { reactive, ref, InjectionKey, provide, Ref, watch } from 'vue'
import { computePosition, Middleware } from '@floating-ui/dom'
import { ComputePositionConfig } from '@floating-ui/core'
import { ArrowEl } from './useArrow'
import { dom } from '../utils/dom'

export interface UseFloatOptions {
  computePositionConfig?: Partial<ComputePositionConfig>
  updateMiddleware?: () => Middleware[]
  rootProps: Record<string, any>
  zIndex?: number
  arrowEl?: ArrowEl
}

export interface FloatApi {
  update(): void
  hide(): void
  computePositionConfig: Partial<ComputePositionConfig>
  rootProps: Record<string, any>
}

export const floatApiKey = Symbol() as InjectionKey<FloatApi>
export const referenceElKey = Symbol() as InjectionKey<Ref<HTMLElement | null>>
export const floatingElKey = Symbol() as InjectionKey<Ref<HTMLElement | null>>

export function useFloat(options: UseFloatOptions) {
  const {
    computePositionConfig = { strategy: 'absolute', placement: 'bottom' },
    updateMiddleware = () => [],
    rootProps,
    zIndex,
    arrowEl,
  } = options

  const referenceEl = ref<HTMLElement | null>(null)
  const floatingEl = ref<HTMLElement | null>(null)

  const floatApi = reactive({
    update,
    hide,
    computePositionConfig,
    rootProps,
  }) as FloatApi

  function update() {
    floatApi.computePositionConfig.middleware = updateMiddleware()

    const referenceDom = dom(referenceEl)
    const floatingDom = dom(floatingEl)

    if (referenceDom && floatingDom?.style) {
      Object.assign(floatingDom.style, {
        position: floatApi.computePositionConfig.strategy,
        zIndex,
      })

      computePosition(referenceDom, floatingDom, floatApi.computePositionConfig)
        .then(({ x, y, placement, middlewareData }) => {
          Object.assign(floatingDom.style, {
            left: `${x}px`,
            top: `${y}px`,
          })

          if (arrowEl?.value && middlewareData.arrow) {
            const { x: arrowX, y: arrowY } = middlewareData.arrow as { x?: number, y?: number }

            const staticSide = {
              top: 'bottom',
              right: 'left',
              bottom: 'top',
              left: 'right',
            }[placement.split('-')[0]]!

            Object.assign(arrowEl.value.style, {
              left: typeof arrowX === 'number' ? `${arrowX}px` : '',
              top: typeof arrowY === 'number' ? `${arrowY}px` : '',
              right: '',
              bottom: '',
              [staticSide]: '-4px',
            })
          }
        })
    }
  }

  function hide() {
    if (dom(floatingEl)?.style) {
      Object.assign(dom(floatingEl)!.style, {
        position: null,
        zIndex: null,
        left: null,
        top: null,
      })
    }
  }

  provide(floatApiKey, floatApi)
  provide(referenceElKey, referenceEl)
  provide(floatingElKey, floatingEl)

  return { floatApi, referenceEl, floatingEl }
}
