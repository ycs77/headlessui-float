import { defineComponent, h, PropType } from 'vue'
import { offset, flip, shift, autoPlacement, hide, Placement, Strategy, Middleware } from '@floating-ui/dom'
import FloatReference from './FloatReference'
import FloatContent from './FloatContent'
import { useFloat } from '../composables/useFloat'
import { arrow, Data } from '../composables/useFloating'
import { useArrow } from '../composables/useArrow'
import { PlacementClassResolver, defaultPlacementClassResolver } from '../placement-class-resolvers'
import { filterSlot, findVNodeComponent, flattenFragment, isValidElement } from '../utils/render'

export default defineComponent({
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
    zIndex: {
      type: Number,
      default: 9999,
    },
    transition: {
      type: Boolean,
      default: false,
    },
    enterActiveClass: String,
    enterFromClass: String,
    enterToClass: String,
    leaveActiveClass: String,
    leaveFromClass: String,
    leaveToClass: String,
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

    useFloat({
      placement: props.placement,
      strategy: props.strategy,
      middleware,
      rootProps: props,
      arrowEl,
      onUpdate,
      onShow,
      onHide,
    })

    function middleware() {
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
          element: arrowEl,
          padding: props.arrow === true ? 0 : props.arrow,
        }))
      }
      if (props.autoPlacement) {
        middleware.push(autoPlacement())
      }
      if (props.hide) {
        middleware.push(hide())
      }
      return middleware.concat(props.middleware)
    }

    function onUpdate(data: Data) {
      emit('update', data)
    }

    function onShow() {
      emit('show')
    }

    function onHide() {
      emit('hide')
    }

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
          console.error(`[headlessui-float]: default slot must contains Headless UI's Button & Items Components.`)
          return
        }

        return [
          h(FloatReference, () => referenceNode),
          h(FloatContent, () => floatingNode),
        ]
      }
    }
  },
})
