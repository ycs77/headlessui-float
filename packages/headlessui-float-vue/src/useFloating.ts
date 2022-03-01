import { ref, unref, Ref, shallowRef, ShallowRef } from 'vue'
import { computePosition, arrow as arrowCore, Placement, Strategy, Middleware } from '@floating-ui/dom'
import { SideObject, MiddlewareData } from '@floating-ui/core'
import { dom } from './utils/dom'

export interface AuthUpdateOptions {
  ancestorScroll: boolean
  ancestorResize: boolean
  elementResize: boolean
  animationFrame: boolean
}

export type UseFloatingOptions = {
  placement?: Placement
  strategy?: Strategy
  middleware?: Ref<Middleware[] | undefined> | Middleware[] | undefined
}

export function useFloating(options: UseFloatingOptions = {}) {
  const reference = ref<HTMLElement | null>(null)
  const floating = ref<HTMLElement | null>(null)

  const x = ref<number | undefined>(undefined)
  const y = ref<number | undefined>(undefined)
  const placement = ref(options.placement || 'bottom')
  const strategy = ref(options.strategy || 'absolute')
  const middlewareData = shallowRef({}) as ShallowRef<MiddlewareData>

  const update = () => {
    const referenceDom = dom(reference)
    const floatingDom = dom(floating)

    if (!referenceDom || !floatingDom) {
      return
    }

    computePosition(referenceDom, floatingDom, {
      placement: options.placement,
      strategy: options.strategy,
      middleware: unref(options.middleware),
    }).then(data => {
      x.value = data.x
      y.value = data.y
      placement.value = data.placement
      strategy.value = data.strategy
      middlewareData.value = data.middlewareData
    })
  }

  return { x, y, placement, strategy, middlewareData, update, reference, floating }
}

export const arrow = (options: {
  element: Ref<HTMLElement | null> | HTMLElement,
  padding?: number | SideObject,
}): Middleware => {
  const { padding } = options

  return {
    name: 'arrow',
    options,
    fn(args) {
      const element = unref(options.element)
      if (element) {
        return arrowCore({ element, padding }).fn(args)
      }

      return {}
    },
  }
}
