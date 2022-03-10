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
import { offset, flip, shift, autoPlacement, hide, autoUpdate, Placement, Strategy, Middleware } from '@floating-ui/dom'
import throttle from 'lodash.throttle'
import { useFloating, arrow, AuthUpdateOptions } from './useFloating'
import { OriginClassResolver } from './origin-class-resolvers'
import { filterSlot, flattenFragment, isValidElement } from './utils/render'
import { dom } from './utils/dom'

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
    if (Error.captureStackTrace) Error.captureStackTrace(err, FloatArrow)
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
    offset: Number,
    shift: {
      type: [Boolean, Number],
      default: 6,
    },
    flip: {
      type: Boolean,
      default: false,
    },
    arrow: {
      type: [Boolean, Number],
      default: false,
    },
    autoPlacement: {
      type: [Boolean, Object],
      default: false,
    },
    hide: {
      type: Boolean,
      default: false,
    },
    autoUpdate: {
      type: [Boolean, Object] as PropType<boolean | AuthUpdateOptions>,
      default: true,
    },
    zIndex: {
      type: Number,
      default: 9999,
    },
    transition: {
      type: Boolean,
      default: false,
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
    placementClass: {
      type: [String, Function] as PropType<string | OriginClassResolver>,
      default: '',
    },
    middleware: {
      type: Array as PropType<Middleware[]>,
      default: () => [],
    },
  },
  emits: ['show', 'hide'],
  setup(props, { slots, emit }) {
    const middleware = shallowRef(undefined) as ShallowRef<Middleware[] | undefined>

    const arrowRef = ref<HTMLElement | null>(null)
    const arrowX = ref<number | undefined>(undefined)
    const arrowY = ref<number | undefined>(undefined)

    const { x, y, placement, strategy, reference, floating, middlewareData, update } = useFloating({
      placement: props.placement,
      strategy: props.strategy,
      middleware,
    })

    function buildMiddleware() {
      const middleware = []
      if (typeof props.offset === 'number') {
        middleware.push(offset(props.offset))
      }
      if (props.shift === true || typeof props.shift === 'number') {
        middleware.push(shift({
          padding: props.shift === true ? 6 : props.shift,
        }))
      }
      if (props.flip) {
        middleware.push(flip())
      }
      if (props.arrow === true || typeof props.arrow === 'number') {
        middleware.push(arrow({
          element: arrowRef,
          padding: props.arrow === true ? 0 : props.arrow,
        }))
      }
      if (props.autoPlacement !== false) {
        middleware.push(autoPlacement(
          typeof props.autoPlacement === 'object'
            ? props.autoPlacement
            : undefined
        ))
      }
      if (props.hide) {
        middleware.push(hide())
      }
      return middleware.concat(props.middleware)
    }

    const arrowApi = {
      ref: arrowRef,
      placement,
      x: arrowX,
      y: arrowY,
    } as ArrowState

    let disposeAutoUpdate: (() => void) | undefined

    const startAutoUpdate = () => {
      if (disposeAutoUpdate) disposeAutoUpdate()

      if (dom(reference) &&
          dom(floating) &&
          props.autoUpdate !== false
      ) {
        disposeAutoUpdate = autoUpdate(
          dom(reference)!,
          dom(floating)!,
          throttle(update, 16),
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
      middleware.value = buildMiddleware()

      // if (dom(floating) && dom(floating)?.nodeType !== Node.COMMENT_NODE) {
      //   emit('show')
      //   startAutoUpdate()
      // }
    })

    watch(middlewareData, () => {
      const arrowData = middlewareData.value.arrow as { x?: number, y?: number }
      arrowX.value = arrowData?.x
      arrowY.value = arrowData?.y
    })

    provide(ArrowContext, arrowApi)

    return () => {
      if (slots.default) {
        const [referenceNode, floatingNode] = filterSlot(flattenFragment(slots.default() || []))

        if (!isValidElement(referenceNode)) {
          return
        }

        const placementClassValue = computed(() => {
          return typeof props.placementClass === 'function'
            ? props.placementClass(placement.value)
            : props.placementClass
        })

        const transitionProps = {
          enterActiveClass: props.transition ? `${props.enter} ${placementClassValue.value}` : '',
          enterFromClass: props.transition ? props.enterFrom : '',
          enterToClass: props.transition ? props.enterTo : '',
          leaveActiveClass: props.transition ? `${props.leave} ${placementClassValue.value}` : '',
          leaveFromClass: props.transition ? props.leaveFrom : '',
          leaveToClass: props.transition ? props.leaveTo : '',
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

          wrapPortal(h(Transition, transitionProps, () =>
            floatingNode
              ? cloneVNode(floatingNode, {
                ref: floating,
                style: {
                  position: strategy.value,
                  zIndex: props.zIndex,
                  top: typeof y.value === 'number' ? `${y.value}px` : '0',
                  left: typeof x.value === 'number' ? `${x.value}px` : '0',
                },
              })
              : createCommentVNode()
          )),
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
