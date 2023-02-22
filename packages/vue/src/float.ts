import {
  Transition,
  cloneVNode,
  computed,
  createCommentVNode,
  defineComponent,
  h,
  inject,
  nextTick,
  onBeforeUnmount,
  onMounted,
  provide,
  ref,
  shallowRef,
  toRef,
  watch,
} from 'vue'
import type { ComputedRef, FunctionalComponent, InjectionKey, PropType, Ref, ShallowRef, VNode } from 'vue'
import { Portal } from '@headlessui/vue'
import { arrow, useFloating } from '@floating-ui/vue'
import { autoPlacement, autoUpdate, flip, hide, offset, shift } from '@floating-ui/dom'
import type { DetectOverflowOptions, FloatingElement, Middleware, Placement, ReferenceElement, Strategy } from '@floating-ui/dom'
import type { Options as OffsetOptions } from '@floating-ui/core/src/middleware/offset'
import type { Options as ShiftOptions } from '@floating-ui/core/src/middleware/shift'
import type { Options as FlipOptions } from '@floating-ui/core/src/middleware/flip'
import type { Options as AutoPlacementOptions } from '@floating-ui/core/src/middleware/autoPlacement'
import type { Options as HideOptions } from '@floating-ui/core/src/middleware/hide'
import type { Options as AutoUpdateOptions } from '@floating-ui/dom/src/autoUpdate'
import { dom } from './utils/dom'
import { env } from './utils/env'
import { flattenFragment, isValidElement, isVisibleDOMElement } from './utils/render'
import { type OriginClassResolver, tailwindcssOriginClassResolver } from './origin-class-resolvers'

interface ArrowState {
  ref: Ref<HTMLElement | null>
  placement: Ref<Placement>
  x: Ref<number | null>
  y: Ref<number | null>
}

const ArrowContext = Symbol('ArrowState') as InjectionKey<ArrowState>

function useArrowContext(component: string) {
  const context = inject(ArrowContext, null)

  if (context === null) {
    const err = new Error(`<${component} /> must be in the <Float /> component.`)
    if (Error.captureStackTrace) Error.captureStackTrace(err, useArrowContext)
    throw err
  }

  return context
}

export interface FloatPropsType {
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
  hide?: boolean | Partial<HideOptions & DetectOverflowOptions>
  autoUpdate?: boolean | Partial<AutoUpdateOptions>
  zIndex?: number | string
  transitionName?: string
  transitionType?: 'transition' | 'animation'
  enter?: string
  enterFrom?: string
  enterTo?: string
  leave?: string
  leaveFrom?: string
  leaveTo?: string
  originClass?: string | OriginClassResolver
  tailwindcssOriginClass?: boolean
  portal?: boolean
  transform?: boolean
  adaptiveWidth?: boolean
  middleware?: Middleware[] | ((refs: {
    referenceEl: Ref<HTMLElement | null>
    floatingEl: Ref<HTMLElement | null>
  }) => Middleware[])
}

export const FloatProps = {
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
    default: 'bottom-start',
  },
  strategy: {
    type: String as PropType<Strategy>,
    default: 'absolute',
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
    type: [Boolean, Object] as PropType<boolean | Partial<HideOptions & DetectOverflowOptions>>,
    default: false,
  },
  autoUpdate: {
    type: [Boolean, Object] as PropType<boolean | Partial<AutoUpdateOptions>>,
    default: true,
  },
  zIndex: {
    type: [Number, String],
    default: 9999,
  },
  transitionName: String,
  transitionType: String as PropType<'transition' | 'animation'>,
  enter: String,
  enterFrom: String,
  enterTo: String,
  leave: String,
  leaveFrom: String,
  leaveTo: String,
  originClass: [String, Function] as PropType<string | OriginClassResolver>,
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
    default: true,
  },
  adaptiveWidth: {
    type: Boolean,
    default: false,
  },
  middleware: {
    type: [Array, Function] as PropType<Middleware[] | ((refs: {
      referenceEl: Ref<ReferenceElement | null>
      floatingEl: Ref<FloatingElement | null>
    }) => Middleware[])>,
    default: () => [],
  },
}

export const Float = defineComponent({
  name: 'Float',
  props: FloatProps,
  emits: ['show', 'hide', 'update'],
  setup(props, { emit, slots, attrs }) {
    const mounted = ref(false)
    const show = ref(props.show !== null ? props.show : false)

    const propPlacement = toRef(props, 'placement')
    const propStrategy = toRef(props, 'strategy')
    const middleware = shallowRef(undefined) as ShallowRef<Middleware[] | undefined>

    const reference = ref(null) as Ref<ReferenceElement | null>
    const floating = ref(null) as Ref<FloatingElement | null>
    const arrowRef = ref(null) as Ref<HTMLElement | null>
    const arrowX = ref<number | undefined>(undefined)
    const arrowY = ref<number | undefined>(undefined)

    const { x, y, placement, strategy, middlewareData, update } = useFloating(reference, floating, {
      placement: propPlacement,
      strategy: propStrategy,
      middleware,
    })

    const originClassValue = computed(() => {
      if (typeof props.originClass === 'function') {
        return props.originClass(placement.value)
      } else if (typeof props.originClass === 'string') {
        return props.originClass
      } else if (props.tailwindcssOriginClass) {
        return tailwindcssOriginClassResolver(placement.value)
      }
      return ''
    })

    const referenceEl = computed(() => dom(reference)) as ComputedRef<ReferenceElement | null>
    const floatingEl = computed(() => dom(floating)) as ComputedRef<FloatingElement | null>

    const referenceElWidth = ref<number | null>(null)

    function updateFloating() {
      if (
        isVisibleDOMElement(referenceEl) &&
        isVisibleDOMElement(floatingEl)
      ) {
        update()
        emit('update')
      }
    }

    watch([propPlacement, propStrategy, middleware], () => {
      updateFloating()
    }, { flush: 'sync' })

    watch([
      () => props.offset,
      () => props.flip,
      () => props.shift,
      () => props.autoPlacement,
      () => props.arrow,
      () => props.hide,
      () => props.middleware,
    ], () => {
      const _middleware = []
      if (typeof props.offset === 'number' ||
          typeof props.offset === 'object' ||
          typeof props.offset === 'function'
      ) {
        _middleware.push(offset(props.offset))
      }
      if (props.flip === true ||
          typeof props.flip === 'number' ||
          typeof props.flip === 'object'
      ) {
        _middleware.push(flip({
          padding: typeof props.flip === 'number' ? props.flip : undefined,
          ...(typeof props.flip === 'object' ? props.flip : {}),
        }))
      }
      if (props.shift === true ||
          typeof props.shift === 'number' ||
          typeof props.shift === 'object'
      ) {
        _middleware.push(shift({
          padding: typeof props.shift === 'number' ? props.shift : undefined,
          ...(typeof props.shift === 'object' ? props.shift : {}),
        }))
      }
      if (props.autoPlacement === true || typeof props.autoPlacement === 'object') {
        _middleware.push(autoPlacement(
          typeof props.autoPlacement === 'object'
            ? props.autoPlacement
            : undefined
        ))
      }
      if (props.arrow === true || typeof props.arrow === 'number') {
        _middleware.push(arrow({
          element: arrowRef,
          padding: props.arrow === true ? 0 : props.arrow,
        }))
      }
      _middleware.push(...(
        typeof props.middleware === 'function'
          ? props.middleware({
            referenceEl,
            floatingEl,
          })
          : props.middleware
      ))
      if (props.hide === true || typeof props.hide === 'object') {
        _middleware.push(hide(
          typeof props.hide === 'object' ? props.hide : undefined
        ))
      }
      middleware.value = _middleware
    }, { immediate: true })

    watch(middlewareData, () => {
      const arrowData = middlewareData.value.arrow as { x?: number, y?: number }
      arrowX.value = arrowData?.x
      arrowY.value = arrowData?.y
    })

    function useAutoUpdate() {
      if (isVisibleDOMElement(referenceEl) &&
          isVisibleDOMElement(floatingEl) &&
          props.autoUpdate !== false
      ) {
        return autoUpdate(
          referenceEl.value!,
          floatingEl.value!,
          updateFloating,
          typeof props.autoUpdate === 'object'
            ? props.autoUpdate
            : undefined
        )
      }

      return () => {}
    }

    let cleanupResizeObserver: () => void = () => {}

    function useReferenceElResizeObserver() {
      if (props.adaptiveWidth &&
          env.isClient &&
          typeof ResizeObserver !== 'undefined' &&
          referenceEl.value instanceof HTMLElement
      ) {
        const observer = new ResizeObserver(([entry]) => {
          referenceElWidth.value = entry.borderBoxSize.reduce((acc, { inlineSize }) => acc + inlineSize, 0)
        })
        observer.observe(referenceEl.value)

        return () => {
          observer.disconnect()
          referenceElWidth.value = null
        }
      }

      return () => {}
    }

    onMounted(() => {
      mounted.value = true
      cleanupResizeObserver = useReferenceElResizeObserver()
    })

    onBeforeUnmount(() => {
      cleanupResizeObserver()
    })

    watch(show, async (value, oldValue, onCleanup) => {
      await nextTick()

      if (isVisibleDOMElement(referenceEl) &&
          isVisibleDOMElement(floatingEl) &&
          show.value
      ) {
        const cleanup = useAutoUpdate()
        emit('show')

        onCleanup(() => {
          cleanup()
          emit('hide')
        })
      }
    }, { flush: 'post', immediate: true })

    const arrowApi = {
      ref: arrowRef,
      placement,
      x: arrowX,
      y: arrowY,
    } as ArrowState

    provide(ArrowContext, arrowApi)

    return () => {
      if (slots.default) {
        const [referenceNode, floatingNode] = flattenFragment(slots.default() || []).filter(isValidElement)

        if (!isValidElement(referenceNode)) {
          return
        }

        const transitionClassesProps = {
          enterActiveClass: props.enter || originClassValue.value
            ? `${props.enter || ''} ${originClassValue.value}`
            : undefined,
          enterFromClass: props.enterFrom,
          enterToClass: props.enterTo,
          leaveActiveClass: props.leave || originClassValue.value
            ? `${props.leave || ''} ${originClassValue.value}`
            : undefined,
          leaveFromClass: props.leaveFrom,
          leaveToClass: props.leaveTo,
        }

        const transitionProps = {
          name: props.transitionName,
          type: props.transitionType,
          ...(!props.transitionName ? transitionClassesProps : {}),
          onBeforeEnter() {
            show.value = true
          },
          onAfterLeave() {
            show.value = false
          },
        }

        const floatingProps = {
          ref: floating,
          style: {
            ...(props.transform ? {
              position: strategy.value,
              zIndex: props.zIndex,
              top: '0px',
              left: '0px',
              right: 'auto',
              bottom: 'auto',
              transform: `translate(${Math.round(x.value || 0)}px,${Math.round(y.value || 0)}px)`,
            } : {
              position: strategy.value,
              zIndex: props.zIndex,
              top: `${y.value || 0}px`,
              left: `${x.value || 0}px`,
            }),
            width: props.adaptiveWidth && typeof referenceElWidth.value === 'number'
              ? `${referenceElWidth.value}px`
              : undefined,
          },
        }

        function renderWrapper(nodes: VNode[]) {
          if (props.as === 'template') {
            return nodes
          } else if (typeof props.as === 'string') {
            return h(props.as, attrs, nodes)
          }
          return h(props.as, attrs, () => nodes)
        }

        function renderPortal(node: VNode) {
          if (props.portal) {
            return h(Portal, () => node)
          }
          return node
        }

        function renderFloating(node: VNode) {
          if (props.floatingAs === 'template') {
            return node
          } else if (typeof props.floatingAs === 'string') {
            return h(props.floatingAs, floatingProps, node)
          }
          return h(props.floatingAs, floatingProps, () => node)
        }

        function renderFloatingNode() {
          function createFloatingNode() {
            const contentProps = props.floatingAs === 'template' ? floatingProps : null
            const el = cloneVNode(floatingNode, contentProps)

            if (el.props?.unmount === false) {
              updateFloating()
              return el
            }

            if (typeof props.show === 'boolean' ? props.show : true) {
              return el
            }

            return createCommentVNode()
          }

          if (env.isServer) {
            if (mounted.value && props.show) {
              return createFloatingNode()
            }
            return createCommentVNode()
          }

          return h(Transition, transitionProps, createFloatingNode)
        }

        return renderWrapper([
          cloneVNode(referenceNode, { ref: reference }),

          renderPortal(
            renderFloating(
              renderFloatingNode()
            )
          ),
        ])
      }
    }
  },
})

export const FloatArrowProps = {
  as: {
    type: [String, Function] as PropType<string | FunctionalComponent>,
    default: 'div',
  },
  offset: {
    type: Number,
    default: 4,
  },
}

export const FloatArrow = defineComponent({
  name: 'FloatArrow',
  props: FloatArrowProps,
  setup(props, { slots, attrs }) {
    const { ref, placement, x, y } = useArrowContext('FloatArrow')

    return () => {
      const staticSide = {
        top: 'bottom',
        right: 'left',
        bottom: 'top',
        left: 'right',
      }[placement.value.split('-')[0]]!

      const style = {
        left: typeof x.value === 'number' ? `${x.value}px` : undefined,
        top: typeof y.value === 'number' ? `${y.value}px` : undefined,
        right: undefined,
        bottom: undefined,
        [staticSide]: `${props.offset * -1}px`,
      }

      if (props.as === 'template') {
        const slot = { placement: placement.value }
        const children = slots.default?.(slot)
        const [node] = Array.isArray(children) ? children : [children]
        if (!node || !isValidElement(node)) {
          throw new Error('When the prop `as` of <FloatArrow /> is \'template\', there must be contains 1 child element.')
        }
        return cloneVNode(node, { ref, style })
      }

      return h(props.as, Object.assign({}, attrs, { ref, style }))
    }
  },
})
