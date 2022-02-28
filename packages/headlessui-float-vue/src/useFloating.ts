import { ref, unref, Ref } from 'vue'
import { computePosition, arrow as arrowCore, Placement, Strategy, Middleware } from '@floating-ui/dom'
import { ComputePositionReturn, SideObject } from '@floating-ui/core'
import { dom } from './utils/dom'

export type Data = Omit<ComputePositionReturn, 'x' | 'y'> & {
  x: number | null
  y: number | null
}

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

export type UseFloatingReturn = Data & {
  reference: Ref<HTMLElement | null>
  floating: Ref<HTMLElement | null>
  update: () => Promise<Data>
}

export function useFloating(options: UseFloatingOptions = {}): UseFloatingReturn {
  const reference = ref<HTMLElement | null>(null)
  const floating = ref<HTMLElement | null>(null)

  const placement = options.placement || 'bottom'
  const strategy = options.strategy || 'absolute'

  const data = ref<Data>({
    x: null,
    y: null,
    placement,
    strategy,
    middlewareData: {},
  })

  const update = () => new Promise<Data>((resolve, reject) => {
    const referenceDom = dom(reference)
    const floatingDom = dom(floating)

    if (!referenceDom || !floatingDom) {
      reject()
      return
    }

    computePosition(referenceDom, floatingDom, {
      placement,
      strategy,
      middleware: unref(options.middleware),
    }).then(computedData => {
      data.value = computedData
      resolve(data.value)
    })
  })

  return { ...data.value, update, reference, floating }
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
