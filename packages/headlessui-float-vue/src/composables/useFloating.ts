import { reactive, ref, unref, toRefs, Ref, ToRefs } from 'vue'
import { computePosition, arrow as arrowCore, Placement, Strategy, Middleware } from '@floating-ui/dom'
import { ComputePositionReturn, SideObject } from '@floating-ui/core'
import { dom } from '../utils/dom'

export type Data = Omit<ComputePositionReturn, 'x' | 'y'> & {
  x: number | null
  y: number | null
}

export type UseFloatingOptions = {
  placement?: Placement
  strategy?: Strategy
  middleware?: Ref<Middleware[] | undefined> | Middleware[] | undefined
}

export type UseFloatingReturn = ToRefs<Data> & FloatingElements & {
  update: () => Promise<Data>
}

export type FloatingElements = {
  reference: Ref<HTMLElement | null>
  floating: Ref<HTMLElement | null>
}

export function useFloating({
  middleware,
  placement = 'bottom',
  strategy = 'absolute',
}: UseFloatingOptions = {}): UseFloatingReturn {
  const reference = ref<HTMLElement | null>(null)
  const floating = ref<HTMLElement | null>(null)
  const data = reactive({
    x: null,
    y: null,
    placement,
    strategy,
    middlewareData: {},
  }) as Data

  const update = () => new Promise<Data>((resolve, reject) => {
    const referenceDom = dom(reference)
    const floatingDom = dom(floating)

    if (!referenceDom || !floatingDom) {
      console.warn(`[headlessui-float]: Not found reference DOM & floating DOM.`)
      reject()
      return
    }

    computePosition(referenceDom, floatingDom, {
      middleware: unref(middleware),
      placement,
      strategy,
    }).then(({ x, y, placement, strategy, middlewareData }) => {
      data.x = x
      data.y = y
      data.placement = placement
      data.strategy = strategy
      data.middlewareData = middlewareData
      resolve(data)
    })
  })

  return { ...toRefs(data), update, reference, floating }
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
