import { ref, shallowRef, unref } from 'vue'
import type { Ref, ShallowRef } from 'vue'
import type { MiddlewareData, SideObject } from '@floating-ui/core'
import { arrow as arrowCore, computePosition } from '@floating-ui/dom'
import type { Middleware, Placement, Strategy } from '@floating-ui/dom'
import { dom } from './utils/dom'

export interface UseFloatingOptions {
  placement?: Ref<Placement> | Placement
  strategy?: Ref<Strategy> | Strategy
  middleware?: Ref<Middleware[] | undefined> | Middleware[]
}

export function useFloating(options: UseFloatingOptions = {}) {
  const reference = ref(null) as Ref<HTMLElement | null>
  const floating = ref(null) as Ref<HTMLElement | null>

  const x = ref<number | undefined>(undefined)
  const y = ref<number | undefined>(undefined)
  const placement = ref(unref(options.placement || 'bottom'))
  const strategy = ref(unref(options.strategy || 'absolute'))
  const middlewareData = shallowRef({}) as ShallowRef<MiddlewareData>

  const update = () => {
    const referenceDom = dom(reference)
    const floatingDom = dom(floating)

    if (!referenceDom || !floatingDom) {
      return
    }

    computePosition(referenceDom, floatingDom, {
      placement: unref(options.placement),
      strategy: unref(options.strategy),
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
  element: Ref<HTMLElement | null> | HTMLElement
  padding?: number | SideObject
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
