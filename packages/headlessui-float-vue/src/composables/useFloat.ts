import { reactive, ref, InjectionKey, provide, Ref } from 'vue'
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
    update: updateFloating,
    hide: hideFloating,
    computePositionConfig: computePositionConfig,
    rootProps: rootProps,
  }) as FloatApi

  provide(floatApiKey, floatApi)
  provide(referenceElKey, referenceEl)
  provide(floatingElKey, floatingEl)

  function updateFloating() {
    floatApi.computePositionConfig.middleware = updateMiddleware()

    Object.assign(dom(floatingEl)!.style, {
      position: floatApi.computePositionConfig.strategy,
      zIndex,
    })

    computePosition(dom(referenceEl)!, dom(floatingEl)!, floatApi.computePositionConfig)
      .then(({ x, y, placement, middlewareData }) => {
        Object.assign(dom(floatingEl)!.style, {
          left: `${x}px`,
          top: `${y}px`,
        })

        if (arrowEl?.value) {
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

  function hideFloating() {
    if (dom(floatingEl)?.style) {
      Object.assign(dom(floatingEl)!.style, {
        position: null,
        zIndex: null,
        left: null,
        top: null,
      })
    }
  }

  return { floatApi, referenceEl, floatingEl, updateFloating, hideFloating }
}
