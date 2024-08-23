import {
  Transition,
  cloneVNode,
  computed,
  createCommentVNode,
  defineComponent,
  h,
  inject,
  mergeProps,
  nextTick,
  onMounted,
  provide,
  ref,
  shallowRef,
  toRef,
  watch,
  watchEffect,
} from 'vue'
import type { ComputedRef, FunctionalComponent, InjectionKey, PropType, Ref, SetupContext, ShallowRef, VNode } from 'vue'
import { Portal, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { useFloating } from '@floating-ui/vue'
import type { AutoPlacementOptions, FlipOptions, HideOptions, OffsetOptions, ShiftOptions } from '@floating-ui/core'
import { autoUpdate } from '@floating-ui/dom'
import type { AutoUpdateOptions, DetectOverflowOptions, Middleware, Placement, Strategy, VirtualElement } from '@floating-ui/dom'
import { dom } from './utils/dom'
import { roundByDPR } from './utils/dpr'
import { flattenFragment, isValidElement, isVisibleDOMElement } from './utils/render'
import { getOwnerDocument } from './utils/owner'
import { showVueTransitionWarn } from './utils/warn'
import type { ClassResolver } from './class-resolvers'
import { useFloatingMiddlewareFromProps } from './hooks/use-floating-middleware-from-props'
import { useReferenceElResizeObserver } from './hooks/use-reference-el-resize-observer'
import { useTransitionAndOriginClass } from './hooks/use-transition-and-origin-class'
import { useOutsideClick } from './hooks/use-outside-click'
import { useDocumentEvent } from './hooks/use-document-event'
import type { FloatingElement, ReferenceElement, __VLS_WithTemplateSlots } from './types'

interface ReferenceState {
  referenceRef: Ref<ReferenceElement | null>
  placement: Readonly<Ref<Placement>>
}

interface FloatingState {
  floatingRef: Ref<FloatingElement | null>
  props: FloatProps
  mounted: Ref<boolean>
  show: Ref<boolean>
  referenceHidden: Ref<boolean | undefined>
  escaped: Ref<boolean | undefined>
  placement: Readonly<Ref<Placement>>
  floatingStyles: Ref<{
    position: Strategy
    top: string
    left: string
    transform?: string
    willChange?: string
  }>
  referenceElWidth: Ref<number | null>
  updateFloating: () => void
}

interface ArrowState {
  ref: Ref<HTMLElement | null>
  placement: Ref<Placement>
  x: Ref<number | undefined>
  y: Ref<number | undefined>
}

const ReferenceContext = Symbol('ReferenceContext') as InjectionKey<ReferenceState>
const FloatingContext = Symbol('FloatingContext') as InjectionKey<FloatingState>
const ArrowContext = Symbol('ArrowContext') as InjectionKey<ArrowState>

function useReferenceContext(component: string) {
  const context = inject(ReferenceContext, null)
  if (context === null) {
    const err = new Error(`<${component} /> must be in the <Float /> component.`)
    if (Error.captureStackTrace) Error.captureStackTrace(err, useReferenceContext)
    throw err
  }
  return context
}

function useFloatingContext(component: string) {
  const context = inject(FloatingContext, null)
  if (context === null) {
    const err = new Error(`<${component} /> must be in the <Float /> component.`)
    if (Error.captureStackTrace) Error.captureStackTrace(err, useFloatingContext)
    throw err
  }
  return context
}

function useArrowContext(component: string) {
  const context = inject(ArrowContext, null)
  if (context === null) {
    const err = new Error(`<${component} /> must be in the <Float /> component.`)
    if (Error.captureStackTrace) Error.captureStackTrace(err, useArrowContext)
    throw err
  }
  return context
}

export interface FloatProps {
  as?: string | FunctionalComponent
  floatingAs?: string | FunctionalComponent
  show?: boolean
  placement?: Placement
  strategy?: Strategy
  offset?: OffsetOptions
  shift?: boolean | number | Partial<ShiftOptions & DetectOverflowOptions>
  flip?: boolean | number | Partial<FlipOptions & DetectOverflowOptions>
  arrow?: boolean | number
  autoPlacement?: boolean | Partial<AutoPlacementOptions & DetectOverflowOptions>
  hide?: boolean | Partial<HideOptions & DetectOverflowOptions> | Partial<HideOptions & DetectOverflowOptions>[]
  referenceHiddenClass?: string
  escapedClass?: string
  autoUpdate?: boolean | Partial<AutoUpdateOptions>
  zIndex?: number | string
  vueTransition?: boolean
  transitionName?: string
  transitionType?: 'transition' | 'animation'
  enter?: string
  enterFrom?: string
  enterTo?: string
  leave?: string
  leaveFrom?: string
  leaveTo?: string
  originClass?: string | ClassResolver
  tailwindcssOriginClass?: boolean
  portal?: boolean
  transform?: boolean
  adaptiveWidth?: boolean | {
    attribute?: string
  }
  composable?: boolean
  dialog?: boolean
  middleware?: Middleware[] | ((refs: {
    referenceEl: ComputedRef<ReferenceElement | null>
    floatingEl: ComputedRef<FloatingElement | null>
  }) => Middleware[])
  onShow?: () => any
  onHide?: () => any
  onUpdate?: () => any
}

export const FloatPropsValidators = {
  as: {
    type: [String, Function] as PropType<string | FunctionalComponent>,
    default: 'template',
  },
  floatingAs: {
    type: [String, Function] as PropType<string | FunctionalComponent>,
    default: 'div',
  },
  show: {
    type: Boolean,
    default: null,
  },
  placement: {
    type: String as PropType<Placement>,
    default: 'bottom-start' as Placement,
  },
  strategy: {
    type: String as PropType<Strategy>,
    default: 'absolute' as Strategy,
  },
  offset: [Number, Function, Object] as PropType<OffsetOptions>,
  shift: {
    type: [Boolean, Number, Object] as PropType<boolean | number | Partial<ShiftOptions & DetectOverflowOptions>>,
    default: false,
  },
  flip: {
    type: [Boolean, Number, Object] as PropType<boolean | number | Partial<FlipOptions & DetectOverflowOptions>>,
    default: false,
  },
  arrow: {
    type: [Boolean, Number],
    default: false,
  },
  autoPlacement: {
    type: [Boolean, Object] as PropType<boolean | Partial<AutoPlacementOptions & DetectOverflowOptions>>,
    default: false,
  },
  hide: {
    type: [Boolean, Object, Array] as PropType<boolean | Partial<HideOptions & DetectOverflowOptions> | Partial<HideOptions & DetectOverflowOptions>[]>,
    default: false,
  },
  referenceHiddenClass: String,
  escapedClass: String,
  autoUpdate: {
    type: [Boolean, Object] as PropType<boolean | Partial<AutoUpdateOptions>>,
    default: true,
  },
  zIndex: {
    type: [Number, String],
    default: 9999,
  },
  vueTransition: {
    type: Boolean,
    default: false,
  },
  transitionName: String,
  transitionType: String as PropType<'transition' | 'animation'>,
  enter: String,
  enterFrom: String,
  enterTo: String,
  leave: String,
  leaveFrom: String,
  leaveTo: String,
  originClass: [String, Function] as PropType<string | ClassResolver>,
  tailwindcssOriginClass: {
    type: Boolean,
    default: false,
  },
  portal: {
    type: Boolean,
    default: false,
  },
  transform: {
    type: Boolean,
    default: false,
  },
  adaptiveWidth: {
    type: [Boolean, Object] as PropType<boolean | { attribute?: string }>,
    default: false,
  },
  composable: {
    type: Boolean,
    default: false,
  },
  dialog: {
    type: Boolean,
    default: false,
  },
  middleware: {
    type: [Array, Function] as PropType<Middleware[] | ((refs: {
      referenceEl: ComputedRef<ReferenceElement | null>
      floatingEl: ComputedRef<FloatingElement | null>
    }) => Middleware[])>,
    default: () => [],
  },
}

export interface FloatSlotProps {
  placement: Placement
}

export type RenderReferenceElementProps = FloatReferenceProps & Required<Pick<FloatReferenceProps, 'as'>>

export function renderReferenceElement(
  referenceNode: VNode,
  componentProps: RenderReferenceElementProps,
  attrs: SetupContext['attrs'],
  context: ReferenceState
) {
  const { referenceRef } = context

  const props = componentProps

  const nodeProps = mergeProps(attrs, {
    ref: referenceRef,
  })

  const node = cloneVNode(
    referenceNode,
    props.as === 'template' ? nodeProps : {}
  )

  if (props.as === 'template') {
    return node
  } else if (typeof props.as === 'string') {
    return h(props.as, nodeProps, [node])
  }
  return h(props.as!, nodeProps, () => [node])
}

export type RenderFloatingElementProps =
  FloatContentProps &
  Required<Pick<FloatContentProps, 'as'>> &
  { show?: boolean | null }

export function renderFloatingElement(
  floatingNode: VNode,
  componentProps: RenderFloatingElementProps,
  attrs: SetupContext['attrs'],
  context: FloatingState
) {
  const { floatingRef, props: rootProps, mounted, show, referenceHidden, escaped, placement, floatingStyles, referenceElWidth, updateFloating } = context

  const props = mergeProps(
    { ...rootProps, as: rootProps.floatingAs } as Record<string, any>,
    componentProps as Record<string, any>
  ) as FloatProps & FloatContentProps

  const { enterActiveClassRef, leaveActiveClassRef } = useTransitionAndOriginClass(props, placement)

  const transitionProps = {
    show: mounted.value ? props.show : false,
    enter: enterActiveClassRef.value,
    enterFrom: props.enterFrom,
    enterTo: props.enterTo,
    leave: leaveActiveClassRef.value,
    leaveFrom: props.leaveFrom,
    leaveTo: props.leaveTo,
    onBeforeEnter() {
      show.value = true
    },
    onAfterLeave() {
      show.value = false
    },
  }

  const vueTransitionProps = {
    name: props.transitionName,
    type: props.transitionType,
    appear: true,
    ...(!props.transitionName ? {
      enterActiveClass: enterActiveClassRef.value,
      enterFromClass: props.enterFrom,
      enterToClass: props.enterTo,
      leaveActiveClass: leaveActiveClassRef.value,
      leaveFromClass: props.leaveFrom,
      leaveToClass: props.leaveTo,
    } : {}),
    onBeforeEnter() {
      show.value = true
    },
    onAfterLeave() {
      show.value = false
    },
  }

  const floatingProps = {
    class: [
      referenceHidden.value ? props.referenceHiddenClass : undefined,
      escaped.value ? props.escapedClass : undefined,
    ].filter(c => !!c).join(' '),

    style: {
      ...floatingStyles.value,
      zIndex: props.zIndex,
    } as Record<string, any>,
  }

  if (props.adaptiveWidth && typeof referenceElWidth.value === 'number') {
    const adaptiveWidthOptions = {
      attribute: 'width',
      ...typeof props.adaptiveWidth === 'object'
        ? props.adaptiveWidth
        : {},
    }

    floatingProps.style[adaptiveWidthOptions.attribute] = `${referenceElWidth.value}px`
  }

  function renderPortal(node: VNode) {
    if (props.portal) {
      if (mounted.value) {
        return h(Portal, () => node)
      }
      return createCommentVNode()
    }
    return node
  }

  function renderFloating(node: VNode) {
    const nodeProps = mergeProps(
      floatingProps,
      attrs,
      !props.dialog ? { ref: floatingRef } : {}
    )

    if (props.as === 'template') {
      return node
    } else if (typeof props.as === 'string') {
      return h(props.as, nodeProps, node)
    }
    return h(props.as!, nodeProps, () => node)
  }

  function renderFloatingNode() {
    function createFloatingNode() {
      const contentProps = props.as === 'template'
        ? mergeProps(
          floatingProps,
          attrs,
          !props.dialog ? { ref: floatingRef } : {}
        )
        : null
      const el = cloneVNode(floatingNode, contentProps)

      if (floatingNode.props?.unmount === false) {
        updateFloating()
        return el
      }

      if (props.vueTransition) {
        if (props.show === false) {
          return createCommentVNode()
        }

        return el
      }

      return el
    }

    if (!mounted.value) {
      return createCommentVNode()
    }

    if (props.vueTransition) {
      return h(Transition, {
        ...(props.dialog ? { ref: floatingRef } : {}),
        ...vueTransitionProps,
      }, createFloatingNode)
    }

    return h(props.transitionChild ? TransitionChild : TransitionRoot, {
      key: `placement-${placement.value}`,
      ...(props.dialog ? { ref: floatingRef } : {}),
      as: 'template',
      ...transitionProps,
    }, createFloatingNode)
  }

  return renderPortal(
    renderFloating(
      renderFloatingNode()
    )
  )
}

export function useFloat<T extends ReferenceElement>(
  show: Ref<boolean>,
  reference: Ref<T | null>,
  floating: Ref<FloatingElement | null>,
  props: FloatProps,
  emit: (event: 'show' | 'hide' | 'update', ...args: any[]) => void
) {
  const mounted = ref(false)

  const propPlacement = toRef(props, 'placement')
  const propStrategy = toRef(props, 'strategy')

  const middleware = shallowRef({}) as ShallowRef<Middleware[]>

  const referenceHidden = ref<boolean | undefined>(undefined)
  const escaped = ref<boolean | undefined>(undefined)

  const arrowRef = ref(null) as Ref<HTMLElement | null>
  const arrowX = ref<number | undefined>(undefined)
  const arrowY = ref<number | undefined>(undefined)

  const referenceEl = computed(() => dom(reference)) as ComputedRef<T | null>
  const floatingEl = computed(() => dom(floating)) as ComputedRef<FloatingElement | null>

  const isVisible = computed(() =>
    isVisibleDOMElement(referenceEl) &&
    isVisibleDOMElement(floatingEl)
  )

  const { placement, middlewareData, isPositioned, floatingStyles, update } = useFloating<T>(referenceEl, floatingEl, {
    placement: propPlacement,
    strategy: propStrategy,
    middleware,
    // If enable dialog mode, then set `transform` to false.
    transform: props.dialog
      ? false
      : props.transform,
    // Fix transition not smooth bug when dialog mode enabled.
    whileElementsMounted: props.dialog
      ? () => () => {}
      : undefined,
  })

  const referenceElWidth = ref<number | null>(null)

  onMounted(() => {
    mounted.value = true
  })

  watch(show, (show, oldShow) => {
    if (show && !oldShow) {
      emit('show')
    } else if (!show && oldShow) {
      emit('hide')
    }
  }, { immediate: true })

  function updateFloating() {
    if (isVisible.value) {
      update()
      emit('update')
    }
  }

  watch([propPlacement, propStrategy, middleware], updateFloating, { flush: 'sync' })

  useFloatingMiddlewareFromProps(
    middleware,
    referenceEl,
    floatingEl,
    arrowRef,
    props
  )

  watch([middlewareData, () => props.hide, isPositioned], () => {
    if (props.hide === true || typeof props.hide === 'object' || Array.isArray(props.hide)) {
      referenceHidden.value = middlewareData.value.hide?.referenceHidden || !isPositioned.value
      escaped.value = middlewareData.value.hide?.escaped
    }
  })

  watch(middlewareData, () => {
    const arrowData = middlewareData.value.arrow as { x?: number, y?: number } | undefined
    arrowX.value = arrowData?.x
    arrowY.value = arrowData?.y
  })

  useReferenceElResizeObserver(!!props.adaptiveWidth, referenceEl, referenceElWidth)

  watch([show, isVisible], async (value, oldValue, onInvalidate) => {
    await nextTick()

    if (show.value && isVisible.value && props.autoUpdate) {
      const cleanup = autoUpdate(
        referenceEl.value!,
        floatingEl.value!,
        updateFloating,
        typeof props.autoUpdate === 'object'
          ? props.autoUpdate
          : undefined
      )

      onInvalidate(cleanup)
    }
  }, { flush: 'post', immediate: true })

  const needForRAF = ref(true)

  watch(referenceEl, () => {
    // only watch on the reference element is virtual element.
    if (!(referenceEl.value instanceof Element) && isVisible.value && needForRAF.value) {
      needForRAF.value = false
      window.requestAnimationFrame(() => {
        needForRAF.value = true
        updateFloating()
      })
    }
  }, { flush: 'sync' })

  const referenceApi: ReferenceState = {
    referenceRef: reference,
    placement,
  }

  const floatingApi: FloatingState = {
    floatingRef: floating,
    props,
    mounted,
    show,
    referenceHidden,
    escaped,
    placement,
    floatingStyles,
    referenceElWidth,
    updateFloating,
  }

  const arrowApi: ArrowState = {
    ref: arrowRef,
    placement,
    x: arrowX,
    y: arrowY,
  }

  provide(ArrowContext, arrowApi)

  return { referenceApi, floatingApi, arrowApi, placement, referenceEl, floatingEl, middlewareData, update: updateFloating }
}

const FloatComp = defineComponent({
  name: 'Float',
  inheritAttrs: false,
  props: FloatPropsValidators,
  emits: ['show', 'hide', 'update'],
  setup(props: FloatProps, { emit, slots, attrs }: SetupContext<['show', 'hide', 'update']>) {
    showVueTransitionWarn('Float', props)

    const show = ref(props.show ?? false)
    const reference = ref(null) as Ref<HTMLElement | null>
    const floating = ref(null) as Ref<HTMLElement | null>

    const {
      referenceApi,
      floatingApi,
      placement,
    } = useFloat(show, reference, floating, props, emit)

    function renderWrapper(children: VNode[]) {
      if (props.as === 'template') {
        return children
      } else if (typeof props.as === 'string') {
        return h(props.as, attrs, children)
      }
      return h(props.as!, attrs, () => children)
    }

    const slot: FloatSlotProps = {
      placement: placement.value,
    }

    // If enable dialog mode, then set `composable` to true..
    if (props.composable || props.dialog) {
      provide(ReferenceContext, referenceApi)
      provide(FloatingContext, floatingApi)

      return () => {
        if (!slots.default) return

        return renderWrapper(slots.default(slot))
      }
    }

    return () => {
      if (!slots.default) return

      const [referenceNode, floatingNode] = flattenFragment(slots.default(slot)).filter(isValidElement)

      if (!isValidElement(referenceNode)) {
        return
      }

      const referenceElement = renderReferenceElement(
        referenceNode,
        { as: 'template' },
        {},
        referenceApi
      )

      const floatingElement = renderFloatingElement(
        floatingNode,
        { as: props.floatingAs! },
        {},
        floatingApi
      )

      return renderWrapper([
        referenceElement,
        floatingElement,
      ])
    }
  },
})
export const Float = FloatComp as __VLS_WithTemplateSlots<typeof FloatComp, Readonly<{
  default: (props: FloatSlotProps) => any
}> & {
  default: (props: FloatSlotProps) => any
}>

export interface FloatReferenceProps extends Pick<FloatProps, 'as'> {}

export const FloatReferencePropsValidators = {
  as: FloatPropsValidators.as,
}

export interface FloatReferenceSlotProps {
  placement: Placement
}

const FloatReferenceComp = defineComponent({
  name: 'FloatReference',
  inheritAttrs: false,
  props: FloatReferencePropsValidators,
  setup(props: FloatReferenceProps, { slots, attrs }: SetupContext) {
    const context = useReferenceContext('FloatReference')
    const { placement } = context

    return () => {
      if (!slots.default) return

      const slot: FloatReferenceSlotProps = {
        placement: placement.value,
      }

      return renderReferenceElement(
        slots.default(slot)[0],
        props as Required<FloatReferenceProps>,
        attrs,
        context
      )
    }
  },
})
export const FloatReference = FloatReferenceComp as __VLS_WithTemplateSlots<typeof FloatReferenceComp, Readonly<{
  default: (props: FloatReferenceSlotProps) => any
}> & {
  default: (props: FloatReferenceSlotProps) => any
}>

export interface FloatContentProps extends Pick<FloatProps, 'as' | 'vueTransition' | 'transitionName' | 'transitionType' | 'enter' | 'enterFrom' | 'enterTo' | 'leave' | 'leaveFrom' | 'leaveTo' | 'originClass' | 'tailwindcssOriginClass'> {
  transitionChild?: boolean
}

export const FloatContentPropsValidators = {
  as: FloatPropsValidators.floatingAs,
  vueTransition: FloatPropsValidators.vueTransition,
  transitionName: FloatPropsValidators.transitionName,
  transitionType: FloatPropsValidators.transitionType,
  enter: FloatPropsValidators.enter,
  enterFrom: FloatPropsValidators.enterFrom,
  enterTo: FloatPropsValidators.enterTo,
  leave: FloatPropsValidators.leave,
  leaveFrom: FloatPropsValidators.leaveFrom,
  leaveTo: FloatPropsValidators.leaveTo,
  originClass: FloatPropsValidators.originClass,
  tailwindcssOriginClass: FloatPropsValidators.tailwindcssOriginClass,
  transitionChild: {
    type: Boolean,
    default: false,
  },
}

export interface FloatContentSlotProps {
  placement: Placement
}

const FloatContentComp = defineComponent({
  name: 'FloatContent',
  inheritAttrs: false,
  props: FloatContentPropsValidators,
  setup(props: FloatContentProps, { slots, attrs }: SetupContext) {
    showVueTransitionWarn('FloatContent', props)

    const context = useFloatingContext('FloatContent')
    const { placement } = context

    return () => {
      if (!slots.default) return

      const slot: FloatContentSlotProps = {
        placement: placement.value,
      }

      const filteredProps = Object.entries(props).reduce((props, [key, value]) => {
        const propsDefined = FloatContentPropsValidators as Record<string, any>
        const isDefault = (
          typeof propsDefined[key] === 'object' &&
          value === propsDefined[key].default
        ) || value === undefined
        if (isDefault)
          delete props[key]
        return props
      }, { ...props } as Record<string, any>) as Required<Pick<FloatContentProps, 'as'>> & FloatContentProps

      return renderFloatingElement(
        slots.default(slot)[0],
        filteredProps as Required<Pick<FloatContentProps, 'as'>> & FloatContentProps,
        attrs,
        context
      )
    }
  },
})
export const FloatContent = FloatContentComp as __VLS_WithTemplateSlots<typeof FloatContentComp, Readonly<{
  default: (props: FloatContentSlotProps) => any
}> & {
  default: (props: FloatContentSlotProps) => any
}>

export interface FloatArrowProps extends Pick<FloatProps, 'as'> {
  offset?: number
}

export const FloatArrowPropsValidators = {
  as: {
    ...FloatPropsValidators.as,
    default: 'div',
  },
  offset: {
    type: Number,
    default: 4,
  },
}

export interface FloatArrowSlotProps {
  placement: Placement
}

const FloatArrowComp = defineComponent({
  name: 'FloatArrow',
  props: FloatArrowPropsValidators,
  setup(props: FloatArrowProps, { slots, attrs }: SetupContext) {
    const { ref, placement, x, y } = useArrowContext('FloatArrow')

    return () => {
      const staticSide = {
        top: 'bottom',
        right: 'left',
        bottom: 'top',
        left: 'right',
      }[placement.value.split('-')[0]]!

      const style = {
        left: ref.value && typeof x.value === 'number'
          ? `${roundByDPR(ref.value, x.value)}px`
          : undefined,
        top: ref.value && typeof y.value === 'number'
          ? `${roundByDPR(ref.value, y.value)}px`
          : undefined,
        right: undefined,
        bottom: undefined,
        [staticSide]: `${props.offset! * -1}px`,
      }

      if (props.as === 'template') {
        const slot: FloatArrowSlotProps = {
          placement: placement.value,
        }

        const node = slots.default?.(slot)[0]

        if (!node || !isValidElement(node)) return

        return cloneVNode(node, { ref, style })
      }

      return h(props.as!, mergeProps(attrs, { ref, style }))
    }
  },
})
export const FloatArrow = FloatArrowComp as __VLS_WithTemplateSlots<typeof FloatArrowComp, Readonly<{
  default: (props: FloatArrowSlotProps) => any
}> & {
  default: (props: FloatArrowSlotProps) => any
}>

export interface FloatVirtualProps<FloatingElement = HTMLElement> extends Pick<FloatProps, 'as' | 'show' | 'placement' | 'strategy' | 'offset' | 'shift' | 'flip' | 'arrow' | 'autoPlacement' | 'autoUpdate' | 'zIndex' | 'vueTransition' | 'transitionName' | 'transitionType' | 'enter' | 'enterFrom' | 'enterTo' | 'leave' | 'leaveFrom' | 'leaveTo' | 'originClass' | 'tailwindcssOriginClass' | 'portal' | 'transform' | 'middleware' | 'onShow' | 'onHide' | 'onUpdate'> {
  onInitial?: (props: FloatVirtualInitialProps<FloatingElement>) => any
}

export const FloatVirtualPropsValidators = {
  as: FloatPropsValidators.as,
  show: FloatPropsValidators.show,
  placement: FloatPropsValidators.placement,
  strategy: FloatPropsValidators.strategy,
  offset: FloatPropsValidators.offset,
  shift: FloatPropsValidators.shift,
  flip: FloatPropsValidators.flip,
  arrow: FloatPropsValidators.arrow,
  autoPlacement: FloatPropsValidators.autoPlacement,
  autoUpdate: FloatPropsValidators.autoUpdate,
  zIndex: FloatPropsValidators.zIndex,
  vueTransition: FloatPropsValidators.vueTransition,
  transitionName: FloatPropsValidators.transitionName,
  transitionType: FloatPropsValidators.transitionType,
  enter: FloatPropsValidators.enter,
  enterFrom: FloatPropsValidators.enterFrom,
  enterTo: FloatPropsValidators.enterTo,
  leave: FloatPropsValidators.leave,
  leaveFrom: FloatPropsValidators.leaveFrom,
  leaveTo: FloatPropsValidators.leaveTo,
  originClass: FloatPropsValidators.originClass,
  tailwindcssOriginClass: FloatPropsValidators.tailwindcssOriginClass,
  portal: FloatPropsValidators.portal,
  transform: FloatPropsValidators.transform,
  middleware: FloatPropsValidators.middleware,
}

export interface FloatVirtualSlotProps {
  placement: Placement
  close: () => void
}

export interface FloatVirtualInitialProps<FloatingElement = HTMLElement> {
  show: Ref<boolean>
  placement: Readonly<Ref<Placement>>
  reference: Ref<VirtualElement>
  floating: Ref<FloatingElement | null>
}

const FloatVirtualComp = defineComponent({
  name: 'FloatVirtual',
  inheritAttrs: false,
  props: FloatVirtualPropsValidators,
  emits: ['initial', 'show', 'hide', 'update'],
  setup(props: FloatVirtualProps, { emit, slots, attrs }: SetupContext<['initial', 'show', 'hide', 'update']>) {
    showVueTransitionWarn('FloatVirtual', props)

    const show = ref(props.show ?? false)
    const reference = ref({
      getBoundingClientRect() {
        return {
          x: 0,
          y: 0,
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          width: 0,
          height: 0,
        }
      },
    }) as Ref<VirtualElement>
    const floating = ref(null) as Ref<HTMLElement | null>

    const {
      floatingApi,
      placement,
    } = useFloat(show, reference, floating, props, emit)

    watch(() => props.show, () => {
      show.value = props.show ?? false
    })

    function close() {
      show.value = false
    }

    emit('initial', {
      show,
      placement,
      reference,
      floating,
    } as FloatVirtualInitialProps)

    return () => {
      if (!slots.default) return

      const slot: FloatVirtualSlotProps = {
        placement: placement.value,
        close,
      }

      const [floatingNode] = flattenFragment(slots.default(slot)).filter(isValidElement)

      return renderFloatingElement(
        floatingNode,
        {
          as: props.as!,
          show: show.value,
        },
        attrs,
        floatingApi
      )
    }
  },
})
export const FloatVirtual = FloatVirtualComp as __VLS_WithTemplateSlots<typeof FloatVirtualComp, Readonly<{
  default: (props: FloatVirtualSlotProps) => any
}> & {
  default: (props: FloatVirtualSlotProps) => any
}>

export interface FloatContextMenuProps extends Omit<FloatVirtualProps, 'show' | 'portal'> {}

export const FloatContextMenuPropsValidators = {
  as: FloatPropsValidators.as,
  placement: FloatPropsValidators.placement,
  strategy: FloatPropsValidators.strategy,
  offset: FloatPropsValidators.offset,
  shift: FloatPropsValidators.shift,
  flip: {
    ...FloatPropsValidators.flip,
    default: true,
  },
  arrow: FloatPropsValidators.arrow,
  autoPlacement: FloatPropsValidators.autoPlacement,
  autoUpdate: FloatPropsValidators.autoUpdate,
  zIndex: FloatPropsValidators.zIndex,
  vueTransition: FloatPropsValidators.vueTransition,
  transitionName: FloatPropsValidators.transitionName,
  transitionType: FloatPropsValidators.transitionType,
  enter: FloatPropsValidators.enter,
  enterFrom: FloatPropsValidators.enterFrom,
  enterTo: FloatPropsValidators.enterTo,
  leave: FloatPropsValidators.leave,
  leaveFrom: FloatPropsValidators.leaveFrom,
  leaveTo: FloatPropsValidators.leaveTo,
  originClass: FloatPropsValidators.originClass,
  tailwindcssOriginClass: FloatPropsValidators.tailwindcssOriginClass,
  transform: FloatPropsValidators.transform,
  middleware: FloatPropsValidators.middleware,
}

const FloatContextMenuComp = defineComponent({
  name: 'FloatContextMenu',
  inheritAttrs: false,
  props: FloatContextMenuPropsValidators,
  emits: ['show', 'hide', 'update'],
  setup(props: FloatContextMenuProps, { emit, slots, attrs }: SetupContext<['show', 'hide', 'update']>) {
    const mounted = ref(false)

    function onInitial({ show, reference, floating }: FloatVirtualInitialProps) {
      useDocumentEvent('contextmenu', e => {
        e.preventDefault()

        reference.value = {
          getBoundingClientRect() {
            return {
              width: 0,
              height: 0,
              x: e.clientX,
              y: e.clientY,
              top: e.clientY,
              left: e.clientX,
              right: e.clientX,
              bottom: e.clientY,
            }
          },
        }

        show.value = true
      })

      useOutsideClick(floating, () => {
        show.value = false
      }, computed(() => show.value))
    }

    onMounted(() => {
      mounted.value = true
    })

    return () => {
      if (!slots.default) return
      if (!mounted.value) return

      return h(FloatVirtual, {
        ...props,
        ...attrs,
        portal: true,
        onInitial,
        onShow: () => emit('show'),
        onHide: () => emit('hide'),
        onUpdate: () => emit('update'),
      }, slots.default)
    }
  },
})
export const FloatContextMenu = FloatContextMenuComp as __VLS_WithTemplateSlots<typeof FloatContextMenuComp, Readonly<{
  default: (props: FloatVirtualSlotProps) => any
}> & {
  default: (props: FloatVirtualSlotProps) => any
}>

export interface FloatCursorProps extends Omit<FloatVirtualProps, 'show' | 'portal'> {
  globalHideCursor?: boolean
}

export const FloatCursorPropsValidators = {
  as: FloatPropsValidators.as,
  placement: FloatPropsValidators.placement,
  strategy: FloatPropsValidators.strategy,
  offset: FloatPropsValidators.offset,
  shift: FloatPropsValidators.shift,
  flip: FloatPropsValidators.flip,
  arrow: FloatPropsValidators.arrow,
  autoPlacement: FloatPropsValidators.autoPlacement,
  autoUpdate: FloatPropsValidators.autoUpdate,
  zIndex: FloatPropsValidators.zIndex,
  vueTransition: FloatPropsValidators.vueTransition,
  transitionName: FloatPropsValidators.transitionName,
  transitionType: FloatPropsValidators.transitionType,
  enter: FloatPropsValidators.enter,
  enterFrom: FloatPropsValidators.enterFrom,
  enterTo: FloatPropsValidators.enterTo,
  leave: FloatPropsValidators.leave,
  leaveFrom: FloatPropsValidators.leaveFrom,
  leaveTo: FloatPropsValidators.leaveTo,
  originClass: FloatPropsValidators.originClass,
  tailwindcssOriginClass: FloatPropsValidators.tailwindcssOriginClass,
  transform: FloatPropsValidators.transform,
  middleware: FloatPropsValidators.middleware,
  globalHideCursor: {
    type: Boolean,
    default: true,
  },
}

const FloatCursorComp = defineComponent({
  name: 'FloatCursor',
  inheritAttrs: false,
  props: FloatCursorPropsValidators,
  emits: ['show', 'hide', 'update'],
  setup({ globalHideCursor, ...props }: FloatCursorProps, { emit, slots, attrs }: SetupContext<['show', 'hide', 'update']>) {
    const mounted = ref(false)

    function onInitial({ show, reference, floating }: FloatVirtualInitialProps) {
      function open() {
        show.value = true
      }
      function close() {
        show.value = false
      }

      function setPosition(position: { clientX: number, clientY: number }) {
        reference.value = {
          getBoundingClientRect() {
            return {
              width: 0,
              height: 0,
              x: position.clientX,
              y: position.clientY,
              top: position.clientY,
              left: position.clientX,
              right: position.clientX,
              bottom: position.clientY,
            }
          },
        }
      }

      function onMouseMove(e: MouseEvent) {
        open()
        setPosition(e)
      }

      function onTouchMove(e: TouchEvent) {
        open()
        setPosition(e.touches[0])
      }

      const ownerDocument = getOwnerDocument(floating)
      if (!ownerDocument) return

      watchEffect(onInvalidate => {
        if (globalHideCursor &&
            !ownerDocument.getElementById('headlesui-float-cursor-style')
        ) {
          const style = ownerDocument.createElement('style')
          const head = ownerDocument.head || ownerDocument.getElementsByTagName('head')[0]
          head.appendChild(style)
          style.id = 'headlesui-float-cursor-style'
          style.appendChild(ownerDocument.createTextNode([
            '*, *::before, *::after {',
            '  cursor: none !important;',
            '}',
            '.headlesui-float-cursor-root {',
            '  pointer-events: none !important;',
            '}',
          ].join('\n')))

          onInvalidate(() => ownerDocument.getElementById('headlesui-float-cursor-style')?.remove())
        }
      }, { flush: 'post' })

      if (('ontouchstart' in window) || (navigator.maxTouchPoints > 0)) {
        useDocumentEvent('touchstart', onTouchMove)
        useDocumentEvent('touchend', close)
        useDocumentEvent('touchmove', onTouchMove)
      } else {
        useDocumentEvent('mouseenter', onMouseMove)
        useDocumentEvent('mouseleave', close)
        useDocumentEvent('mousemove', onMouseMove)
      }
    }

    onMounted(() => {
      mounted.value = true
    })

    return () => {
      if (!slots.default) return
      if (!mounted.value) return

      return h(FloatVirtual, {
        ...props,
        ...attrs,
        portal: true,
        class: 'headlesui-float-cursor-root',
        onInitial,
        onShow: () => emit('show'),
        onHide: () => emit('hide'),
        onUpdate: () => emit('update'),
      }, slots.default)
    }
  },
})
export const FloatCursor = FloatCursorComp as __VLS_WithTemplateSlots<typeof FloatCursorComp, Readonly<{
  default: (props: FloatVirtualSlotProps) => any
}> & {
  default: (props: FloatVirtualSlotProps) => any
}>
