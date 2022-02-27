import { defineComponent, ref, computed, nextTick, provide, inject, h, cloneVNode, Teleport, Transition, Ref, PropType, InjectionKey, VNode } from 'vue'
import { offset, flip, shift, autoPlacement, hide, autoUpdate, Placement, Strategy, Middleware } from '@floating-ui/dom'
import throttle from 'lodash.throttle'
import { useFloating, arrow, AuthUpdateOptions } from '../composables/useFloating'
import { PlacementClassResolver, defaultPlacementClassResolver } from '../placement-class-resolvers'
import { filterSlot, findVNodeComponent, flattenFragment, isValidElement } from '../utils/render'
import { dom } from '../utils/dom'
import { injectOrCreate } from '../utils/injection'

interface FloatState {
  reference: Ref<HTMLElement | null>
  floating: Ref<HTMLElement | null>
  placement: Placement
  strategy: Strategy
  middleware: Ref<Middleware[]>
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
  update(): Promise<void>
  show(): void
  hide(): void
}

type ArrowEl = Ref<HTMLElement | null>

const FloatContext = Symbol() as InjectionKey<FloatState>
const ArrowElContext = Symbol() as InjectionKey<ArrowEl>

function useFloatContext(component: string) {
  let context = inject(FloatContext, null)

  if (context === null) {
    let err = new Error(`<${component} /> is missing a parent <Float /> component.`)
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
    const arrowEl = useArrow()

    const middleware = ref(undefined) as Ref<Middleware[] | undefined>

    const { reference, floating, update } = useFloating({
      placement: props.placement,
      strategy: props.strategy,
      middleware: middleware,
    })

    function initMiddleware() {
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
      reference,
      floating,
      placement: props.placement,
      strategy: props.strategy,
      middleware,
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
      async update() {
        if (middleware.value === undefined) {
          middleware.value = initMiddleware()
        }

        let floatingDom = dom(floating)
        if (floatingDom?.style) {
          Object.assign(floatingDom.style, {
            position: api.strategy,
            zIndex: props.zIndex,
          })
        }

        const { x, y, placement, strategy, middlewareData } = await update()

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

          emit('update', { x, y, placement, strategy, middlewareData, reference, floating })
        }
      },
      show() {
        if (dom(reference) && dom(floating) && props.autoUpdate !== false) {
          const options = props.autoUpdate === true ? undefined : props.autoUpdate

          if (cleanAutoUpdate) cleanAutoUpdate()

          cleanAutoUpdate = autoUpdate(
            dom(reference)!,
            dom(floating)!,
            throttle(api.update, 16),
            options
          )
        }

        emit('show')
      },
      hide() {
        if (cleanAutoUpdate) cleanAutoUpdate()

        if (dom(floating)?.style) {
          Object.assign(dom(floating)!.style, {
            position: null,
            zIndex: null,
            left: null,
            top: null,
          })
        }

        emit('hide')
      },
    } as FloatState

    provide(FloatContext, api)

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
          ? cloneVNode(node, { ref: api.reference })
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

      async onBeforeEnter() {
        await nextTick()
        await api.update()
        api.show()
      },
      onAfterLeave() {
        api.hide()
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
        const [node] = slots.default()
        return wrapTeleport(h(Transition, transitionProps, () =>
          node
            ? cloneVNode(node, { ref: api.floating })
            : undefined
        ))
      }
    }
  },
})

export const FloatArrow = defineComponent({
  name: 'FloatArrow',
  setup(props, { slots, attrs }) {
    const arrowEl = inject(ArrowElContext, null)

    if (arrowEl === null) {
      let err = new Error(`<FloatArrow /> must be in the Items component of the Headless UI.`)
      if (Error.captureStackTrace) Error.captureStackTrace(err, FloatArrow)
      throw err
    }

    return () => {
      const node = slots.default?.()[0]
      return node
        ? cloneVNode(node, { ref: arrowEl })
        : h('div', Object.assign({}, attrs, { ref: arrowEl }))
    }
  },
})
