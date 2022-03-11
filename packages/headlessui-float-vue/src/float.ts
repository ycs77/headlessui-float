import {
  defineComponent,
  ref,
  shallowRef,
  computed,
  watch,
  provide,
  inject,
  nextTick,
  onMounted,
  h,
  Teleport,
  Transition,
  cloneVNode,
  createCommentVNode,

  // types
  Ref,
  ShallowRef,
  PropType,
  InjectionKey,
  VNode,
} from 'vue'
import { offset, flip, shift, autoPlacement, hide, autoUpdate } from '@floating-ui/dom'
import throttle from 'lodash.throttle'
import { useFloating, arrow } from './useFloating'
import { OriginClassResolver, tailwindcssOriginClassResolver } from './origin-class-resolvers'
import { filterSlot, flattenFragment, isVisibleDOMElement, isValidElement } from './utils/render'
import { dom } from './utils/dom'
import type { Options as OffsetOptions } from '@floating-ui/core/src/middleware/offset'
import type { Options as ShiftOptions } from '@floating-ui/core/src/middleware/shift'
import type { Options as FlipOptions } from '@floating-ui/core/src/middleware/flip'
import type { Options as AutoPlacementOptions } from '@floating-ui/core/src/middleware/autoPlacement'
import type { Options as HideOptions } from '@floating-ui/core/src/middleware/hide'
import type { Placement, Strategy, Middleware, DetectOverflowOptions } from '@floating-ui/dom'
import type { Options as AutoUpdateOptions } from '@floating-ui/dom/src/autoUpdate'

interface ArrowState {
  ref: Ref<HTMLElement | null>
  placement: Ref<Placement>
  x: Ref<number | undefined>
  y: Ref<number | undefined>
}

const ArrowContext = Symbol() as InjectionKey<ArrowState>

export function useArrowContext(component: string) {
  let context = inject(ArrowContext, null)

  if (context === null) {
    let err = new Error(`<${component} /> must be in the <Float /> component.`)
    if (Error.captureStackTrace) Error.captureStackTrace(err, useArrowContext)
    throw err
  }

  return context
}

export const Float = defineComponent({
  name: 'Float',
  props: {
    placement: {
      type: String as PropType<Placement>,
      default: 'bottom-start',
    },
    strategy: {
      type: String as PropType<Strategy>,
      default: 'absolute',
    },
    offset: [Number, Object, Function] as PropType<OffsetOptions>,
    shift: {
      type: [Boolean, Number, Object] as PropType<boolean | number | (ShiftOptions & DetectOverflowOptions)>,
      default: false,
    },
    flip: {
      type: [Boolean, Object] as PropType<boolean | (FlipOptions & DetectOverflowOptions)>,
      default: false,
    },
    arrow: {
      type: [Boolean, Number],
      default: false,
    },
    autoPlacement: {
      type: [Boolean, Object] as PropType<boolean | (AutoPlacementOptions & DetectOverflowOptions)>,
      default: false,
    },
    hide: {
      type: [Boolean, Object] as PropType<boolean | (HideOptions & DetectOverflowOptions)>,
      default: false,
    },
    autoUpdate: {
      type: [Boolean, Object] as PropType<boolean | AutoUpdateOptions>,
      default: true,
    },
    zIndex: {
      type: Number,
      default: 9999,
    },
    enter: String,
    enterFrom: String,
    enterTo: String,
    leave: String,
    leaveFrom: String,
    leaveTo: String,
    portal: {
      type: [Boolean, String],
      default: false,
    },
    originClass: [String, Function] as PropType<string | OriginClassResolver>,
    tailwindcssOriginClass: {
      type: Boolean,
      default: false,
    },
    middleware: {
      type: [Array, Function] as PropType<Middleware[] | ((refs: {
        referenceEl: Ref<HTMLElement | null>,
        floatingEl: Ref<HTMLElement | null>,
      }) => Middleware[])>,
      default: () => [],
    },
  },
  emits: ['show', 'hide', 'update'],
  setup(props, { slots, emit }) {
    const propPlacement = ref(props.placement)
    const propStrategy = ref(props.strategy)
    const middleware = shallowRef(undefined) as ShallowRef<Middleware[] | undefined>

    const arrowRef = ref<HTMLElement | null>(null)
    const arrowX = ref<number | undefined>(undefined)
    const arrowY = ref<number | undefined>(undefined)

    const { x, y, placement, strategy, reference, floating, middlewareData, update } = useFloating({
      placement: propPlacement,
      strategy: propStrategy,
      middleware,
    })

    const referenceEl = ref(dom(reference))
    const floatingEl = ref(dom(floating))
    const updateEl = () => {
      referenceEl.value = dom(reference)
      floatingEl.value = dom(floating)
    }

    const updateFloating = () => {
      update()
      emit('update')
    }

    watch(() => props.placement, () => {
      propPlacement.value = props.placement
      updateEl()
      if (isVisibleDOMElement(referenceEl) && isVisibleDOMElement(floatingEl)) {
        updateFloating()
      }
    })

    watch(() => props.strategy, () => {
      propStrategy.value = props.strategy
      updateEl()
      if (isVisibleDOMElement(referenceEl) && isVisibleDOMElement(floatingEl)) {
        updateFloating()
      }
    })

    watch([
      () => props.offset,
      () => props.shift,
      () => props.flip,
      () => props.arrow,
      () => props.autoPlacement,
      () => props.hide,
      () => props.middleware,
    ], () => {
      updateEl()
      const _middleware = []
      if (typeof props.offset === 'number' ||
          typeof props.offset === 'object' ||
          typeof props.offset === 'function'
      ) {
        _middleware.push(offset(props.offset))
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
      if (props.flip === true || typeof props.flip === 'object') {
        _middleware.push(flip(
          typeof props.flip === 'object' ? props.flip : undefined
        ))
      }
      if (props.arrow === true || typeof props.arrow === 'number') {
        _middleware.push(arrow({
          element: arrowRef,
          padding: props.arrow === true ? 0 : props.arrow,
        }))
      }
      if (props.autoPlacement === true || typeof props.autoPlacement === 'object') {
        _middleware.push(autoPlacement(
          typeof props.autoPlacement === 'object'
            ? props.autoPlacement
            : undefined
        ))
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

      if (isVisibleDOMElement(referenceEl) && isVisibleDOMElement(floatingEl)) {
        updateFloating()
      }
    }, { immediate: true })

    let disposeAutoUpdate: (() => void) | undefined

    const startAutoUpdate = () => {
      updateEl()
      if (isVisibleDOMElement(referenceEl) &&
          isVisibleDOMElement(floatingEl) &&
          props.autoUpdate !== false
      ) {
        disposeAutoUpdate = autoUpdate(
          referenceEl.value!,
          floatingEl.value!,
          throttle(updateFloating, 16),
          typeof props.autoUpdate === 'object'
            ? props.autoUpdate
            : undefined
        )
      }
    }

    const clearAutoUpdate = () => {
      if (disposeAutoUpdate) disposeAutoUpdate()
      disposeAutoUpdate = undefined
    }

    onMounted(() => {
      if (isVisibleDOMElement(dom(floating))) {
        emit('show')
        startAutoUpdate()
      }
    })

    watch(middlewareData, () => {
      const arrowData = middlewareData.value.arrow as { x?: number, y?: number }
      arrowX.value = arrowData?.x
      arrowY.value = arrowData?.y
    })

    const arrowApi = {
      ref: arrowRef,
      placement,
      x: arrowX,
      y: arrowY,
    } as ArrowState

    provide(ArrowContext, arrowApi)

    return () => {
      if (slots.default) {
        const [referenceNode, floatingNode] = filterSlot(flattenFragment(slots.default() || []))

        if (!isValidElement(referenceNode)) {
          return
        }

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

        const transitionProps = {
          enterActiveClass: `${props.enter} ${originClassValue.value}`,
          enterFromClass: props.enterFrom,
          enterToClass: props.enterTo,
          leaveActiveClass: `${props.leave} ${originClassValue.value}`,
          leaveFromClass: props.leaveFrom,
          leaveToClass: props.leaveTo,
          onBeforeEnter() {
            nextTick(() => {
              emit('show')
              startAutoUpdate()
            })
          },
          onAfterLeave() {
            clearAutoUpdate()
            emit('hide')
          },
        }

        const wrapPortal = (node: VNode) => {
          if (props.portal !== false) {
            return h(Teleport, { to: props.portal === true ? 'body' : props.portal }, [node])
          }
          return node
        }

        return [
          cloneVNode(referenceNode, { ref: reference }),

          wrapPortal(
            h('div', {
              ref: floating,
              style: {
                position: strategy.value,
                zIndex: props.zIndex,
                top: '0',
                left: '0',
                right: 'auto',
                bottom: 'auto',
                transform: `translate(${Math.round(x.value || 0)}px,${Math.round(y.value || 0)}px)`,
              },
            }, h(Transition, transitionProps, () =>
              floatingNode
                ? cloneVNode(floatingNode)
                : createCommentVNode()
            ))
          ),
        ]
      }
    }
  },
})

export const FloatArrow = defineComponent({
  name: 'FloatArrow',
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
        left: typeof x.value === 'number' ? `${x.value}px` : '',
        top: typeof y.value === 'number' ? `${y.value}px` : '',
        right: '',
        bottom: '',
        [staticSide]: '-4px',
      }

      const node = slots.default?.()[0]
      return node
        ? cloneVNode(node, { ref, style })
        : h('div', Object.assign({}, attrs, { ref, style }))
    }
  },
})
