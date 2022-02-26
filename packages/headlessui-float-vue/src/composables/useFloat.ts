import { ref, reactive, InjectionKey, provide, Ref } from 'vue'
import { Middleware, getScrollParents } from '@floating-ui/dom'
import { Placement, Strategy } from '@floating-ui/dom'
import throttle from 'lodash.throttle'
import { useFloating, Data, FloatingElements } from './useFloating'
import { ArrowEl } from './useArrow'
import { dom } from '../utils/dom'
import { PlacementClassResolver } from '../types'

export interface FloatProps {
  placement: Placement
  strategy: Strategy
  offset?: number
  shift: boolean | number
  flip: boolean
  arrow: boolean | number
  autoPlacement: boolean
  hide: boolean
  zIndex: number
  transition: boolean
  enterActiveClass?: string
  enterFromClass?: string
  enterToClass?: string
  leaveActiveClass?: string
  leaveFromClass?: string
  leaveToClass?: string
  originClass?: string
  teleport: boolean | string
  placementClassResolver: PlacementClassResolver
  middleware: Middleware[]
}

export type UseFloatOptions = {
  placement?: Placement
  strategy?: Strategy
  middleware?: Middleware[] | (() => Middleware[])
  rootProps: FloatProps
  arrowEl?: ArrowEl
  onUpdate?: (data: Data & FloatingElements) => Promise<void> | void
  onShow?: () => Promise<void> | void
  onHide?: () => Promise<void> | void
}

export interface FloatApi {
  placement?: Placement
  strategy?: Strategy
  middleware?: Middleware[]
  update(): Promise<void>
  show(): Promise<void>
  hide(): Promise<void>
  rootProps: FloatProps
}

export const floatApiKey = Symbol() as InjectionKey<FloatApi>
export const referenceKey = Symbol() as InjectionKey<Ref<HTMLElement | null>>
export const floatingKey = Symbol() as InjectionKey<Ref<HTMLElement | null>>

export function useFloat(options: UseFloatOptions) {
  const {
    strategy = 'absolute',
    placement = 'bottom',
    rootProps,
    arrowEl,
    onUpdate,
    onShow,
    onHide,
  } = options

  const middlewareRef = ref(undefined) as Ref<Middleware[] | undefined>

  const {
    reference,
    floating,
    update: updateFloating,
  } = useFloating({
    strategy,
    placement,
    middleware: middlewareRef,
  })

  const floatApi = reactive({
    strategy,
    placement,
    middleware: undefined,
    update,
    show,
    hide,
    rootProps,
  }) as FloatApi

  async function update() {
    if (middlewareRef.value === undefined) {
      floatApi.middleware = typeof options.middleware === 'function'
        ? options.middleware()
        : options.middleware

      middlewareRef.value = floatApi.middleware
    }

    let floatingDom = dom(floating)
    if (floatingDom?.style) {
      Object.assign(floatingDom.style, {
        position: floatApi.strategy,
        zIndex: rootProps.zIndex,
      })
    }

    const { x, y, placement, strategy, middlewareData } = await updateFloating()

    if (floatingDom?.style) {
      Object.assign(floatingDom.style, {
        left: `${x}px`,
        top: `${y}px`,
      })

      if (arrowEl?.value?.style && middlewareData.arrow) {
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

      attachListeners()

      if (onUpdate) {
        await onUpdate({ x, y, placement, strategy, middlewareData, reference, floating })
      }
    }
  }

  async function show() {
    if (onShow) await onShow()
  }

  async function hide() {
    detachListeners()

    if (dom(floating)?.style) {
      Object.assign(dom(floating)!.style, {
        position: null,
        zIndex: null,
        left: null,
        top: null,
      })
    }

    if (onHide) await onHide()
  }

  const updateCallback = throttle(floatApi.update, 20)

  const getScrollParentsSafe = (el: Ref<HTMLElement | null> | HTMLElement | null) =>
    dom(el) ? getScrollParents(dom(el)!) : []

  const attachListeners = () => {
    [
      ...getScrollParentsSafe(reference),
      ...getScrollParentsSafe(floating),
    ].forEach((el) => {
      el.addEventListener('scroll', updateCallback)
      el.addEventListener('resize', updateCallback)
    })
  }

  const detachListeners = () => {
    [
      ...getScrollParentsSafe(reference),
      ...getScrollParentsSafe(floating),
    ].forEach((el) => {
      el.removeEventListener('scroll', updateCallback)
      el.removeEventListener('resize', updateCallback)
    })
  }

  provide(floatApiKey, floatApi)
  provide(referenceKey, reference)
  provide(floatingKey, floating)

  return { floatApi, reference, floating }
}
