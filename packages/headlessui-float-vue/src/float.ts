import {
  defineComponent,
  ref,
  computed,
  nextTick,
  provide,
  inject,
  h,
  cloneVNode,
  Teleport,
  Transition,

  // types
  Ref,
  PropType,
  InjectionKey,
  VNode,
watch,
} from 'vue'
import { offset, flip, shift, autoPlacement, hide, autoUpdate, Placement, Strategy, Middleware, MiddlewareData } from '@floating-ui/dom'
import throttle from 'lodash.throttle'
import { useFloating, arrow, AuthUpdateOptions } from './useFloating'
import { PlacementClassResolver, defaultPlacementClassResolver } from './placement-class-resolvers'
import { filterSlot, findVNodeComponent, flattenFragment, isValidElement } from './utils/render'
import { dom } from './utils/dom'
import { injectOrCreate } from './utils/injection'

interface FloatState {
  open: Ref<boolean>
  referenceRef: Ref<HTMLElement | null>
  floatingRef: Ref<HTMLElement | null>
  floatingX: Ref<number | undefined>
  floatingY: Ref<number | undefined>
  arrowX: Ref<number | undefined>
  arrowY: Ref<number | undefined>
  placement: Placement
  strategy: Strategy
  middleware: Ref<Middleware[]>
  middlewareData: Ref<MiddlewareData>
  zIndex: number
  transition: boolean
  enter?: string
  enterFrom?: string
  enterTo?: string
  leave?: string
  leaveFrom?: string
  leaveTo?: string
  originClass?: string
  teleport: boolean | string
  placementClassResolver: PlacementClassResolver
}

type ArrowEl = Ref<HTMLElement | null>

const FloatContext = Symbol() as InjectionKey<FloatState>
const ArrowElContext = Symbol() as InjectionKey<ArrowEl>

function useFloatContext(component: string) {
  let context = inject(FloatContext, null)

  if (context === null) {
    let err = new Error(`<${component} /> is missing a parent <Float /> component.`)
    // @ts-ignore
    if (Error.captureStackTrace) Error.captureStackTrace(err, useFloatContext)
    throw err
  }

  return context
}

export function useArrow() {
  const arrowEl = injectOrCreate(ArrowElContext, () => ref(null))

  provide(ArrowElContext, arrowEl)

  return arrowEl
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
      type: Boolean,
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
    originClass: String,
    teleport: {
      type: [Boolean, String],
      default: false,
    },
    placementClassResolver: {
      type: Function as PropType<PlacementClassResolver>,
      default: defaultPlacementClassResolver,
    },
    middleware: {
      type: Array as PropType<Middleware[]>,
      default: () => [],
    },
  },
  emits: ['update', 'show', 'hide'],
  setup(props, { slots, emit }) {
    const open = ref(false)
    const middleware = ref(undefined) as Ref<Middleware[] | undefined>
    const arrowEl = useArrow()
    const arrowX = ref<number | undefined>(undefined)
    const arrowY = ref<number | undefined>(undefined)

    const { x, y, placement, strategy, reference, floating, middlewareData, update } = useFloating({
      placement: props.placement,
      strategy: props.strategy,
      middleware: middleware,
    })

    function buildMiddleware() {
      middleware.value = []
      if (typeof props.offset === 'number') {
        middleware.value.push(offset(props.offset))
      }
      if (props.shift === true || typeof props.shift === 'number') {
        middleware.value.push(shift({
          padding: props.shift === true ? 6 : props.shift,
        }))
      }
      if (props.flip) {
        middleware.value.push(flip())
      }
      if (props.arrow === true || typeof props.arrow === 'number') {
        middleware.value.push(arrow({
          element: arrowEl,
          padding: props.arrow === true ? 0 : props.arrow,
        }))
      }
      if (props.autoPlacement) {
        middleware.value.push(autoPlacement())
      }
      if (props.hide) {
        middleware.value.push(hide())
      }
      return middleware.value.concat(props.middleware)
    }

    let cleanAutoUpdate: (() => void) | undefined

    const api = {
      open,
      referenceRef: reference,
      floatingRef: floating,
      floatingX: x,
      floatingY: y,
      arrowX,
      arrowY,
      placement: placement.value,
      strategy: strategy.value,
      middleware,
      middlewareData,
      zIndex: props.zIndex,
      transition: props.transition,
      enter: props.enter,
      enterFrom: props.enterFrom,
      enterTo: props.enterTo,
      leave: props.leave,
      leaveFrom: props.leaveFrom,
      leaveTo: props.leaveTo,
      originClass: props.originClass,
      teleport: props.teleport,
      placementClassResolver: props.placementClassResolver,
    } as FloatState

    provide(FloatContext, api)

    watch([open, x, y], () => {
      if (open.value) {
        if (middleware.value === undefined) {
          middleware.value = buildMiddleware()
        }

        update()

        if (dom(reference) &&
            dom(floating) &&
            props.autoUpdate !== false &&
            !cleanAutoUpdate
        ) {
          cleanAutoUpdate = autoUpdate(
            dom(reference)!,
            dom(floating)!,
            throttle(update, 16),
            props.autoUpdate === true ? undefined : props.autoUpdate
          )
        }

        emit('update')
        emit('show')
      } else {
        if (cleanAutoUpdate) cleanAutoUpdate()

        emit('hide')
      }
    })

    watch(middlewareData, () => {
      const arrowData = middlewareData.value.arrow as { x?: number, y?: number }
      arrowX.value = arrowData?.x
      arrowY.value = arrowData?.y
    })

    return () => {
      if (slots.default) {
        const defaultSlotNodes = filterSlot(flattenFragment(slots.default() || []))

        const hasFloatComponent = typeof findVNodeComponent(
          defaultSlotNodes, ['FloatReference', 'FloatContent']
        ) !== 'undefined'

        if (hasFloatComponent) {
          return defaultSlotNodes
        }

        const [referenceNode, floatingNode] = defaultSlotNodes

        if (!isValidElement(referenceNode) || !isValidElement(floatingNode)) {
          let err = new Error('default slot must contains the Button & Items Components of the Headless UI.')
          // @ts-ignore
          if (Error.captureStackTrace) Error.captureStackTrace(err, Float)
          throw err
        }

        return [
          h(FloatReference, () => referenceNode),
          h(FloatContent, () => floatingNode),
        ]
      }
    }
  },
})

export const FloatReference = defineComponent({
  name: 'FloatReference',
  setup(props, { slots }) {
    const api = useFloatContext('FloatReference')

    return () => {
      if (slots.default) {
        const [node] = slots.default()
        return node
          ? cloneVNode(node, { ref: api.referenceRef })
          : undefined
      }
    }
  },
})

export const FloatContent = defineComponent({
  name: 'FloatContent',
  setup(props, { slots }) {
    const api = useFloatContext('FloatReference')

    const placementOriginClass = computed(() => {
      return api.originClass || api.placementClassResolver(api.placement)
    })

    const transitionProps = {
      enterActiveClass: api.transition ? `${api.enter} ${placementOriginClass.value}` : undefined,
      enterFromClass: api.transition ? api.enterFrom : undefined,
      enterToClass: api.transition ? api.enterTo : undefined,
      leaveActiveClass: api.transition ? `${api.leave} ${placementOriginClass.value}` : undefined,
      leaveFromClass: api.transition ? api.leaveFrom : undefined,
      leaveToClass: api.transition ? api.leaveTo : undefined,
      onBeforeEnter() {
        nextTick().then(() => {
          api.open.value = true
        })
      },
      onAfterLeave() {
        api.open.value = false
      },
    }

    const wrapTeleport = (node: VNode) => {
      if (api.teleport === false) {
        return node
      }
      return h(Teleport, { to: api.teleport === true ? 'body' : api.teleport }, [node])
    }

    return () => {
      if (slots.default) {
        const style = {
          position: api.strategy,
          zIndex: api.zIndex,
          top: typeof api.floatingY.value === 'number' ? `${api.floatingY.value}px` : '',
          left: typeof api.floatingX.value === 'number' ? `${api.floatingX.value}px` : '',
        }

        const [node] = slots.default()
        return wrapTeleport(h(Transition, transitionProps, () =>
          node
            ? cloneVNode(node, { ref: api.floatingRef, style })
            : undefined
        ))
      }
    }
  },
})

export const FloatArrow = defineComponent({
  name: 'FloatArrow',
  setup(props, { slots, attrs }) {
    const api = useFloatContext('FloatArrow')
    const arrowEl = inject(ArrowElContext, null)

    if (arrowEl === null) {
      let err = new Error(`<FloatArrow /> must be in the Items component of the Headless UI.`)
      // @ts-ignore
      if (Error.captureStackTrace) Error.captureStackTrace(err, FloatArrow)
      throw err
    }

    return () => {
      const staticSide = {
        top: 'bottom',
        right: 'left',
        bottom: 'top',
        left: 'right',
      }[api.placement.split('-')[0]]!

      const style = {
        left: typeof api.arrowX.value === 'number' ? `${api.arrowX.value}px` : '',
        top: typeof api.arrowY.value === 'number' ? `${api.arrowY.value}px` : '',
        right: '',
        bottom: '',
        [staticSide]: '-4px',
      }

      const props = { ref: arrowEl, style }

      const node = slots.default?.()[0]
      return node
        ? cloneVNode(node, props)
        : h('div', Object.assign({}, attrs, props))
    }
  },
})
