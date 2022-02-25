import { defineComponent, ref, computed, toRef, nextTick, h, cloneVNode, Transition, Teleport, PropType, VNode } from 'vue'
import { offset, flip, shift, arrow, autoPlacement, hide, getScrollParents, Placement, Strategy, Middleware, Platform } from '@floating-ui/dom'
import { defaultPlacementClassResolver } from '../placement-class-resolvers'
import { dom } from '../utils/dom'
import { filterSlot, findVNode, flattenFragment, isValidElement } from '../utils/render'
import { useFloat } from '../composables/useFloat'
import { useFloatContent } from '../composables/useFloatContent'
import { useArrow } from '../composables/useArrow'
import { PlacementClassResolver } from '../types'

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
      type: [Boolean, Number] as PropType<number | false>,
      default: 6,
    },
    flip: {
      type: Boolean,
      default: false,
    },
    arrowPadding: {
      type: Number,
      default: 0,
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
    platform: Object as PropType<Platform>,
  },
  setup(props, { slots }) {
    const arrowEl = useArrow()
    const { floatApi, referenceEl, floatingEl } = useFloat({
      computePositionConfig: computePositionOptions(),
      updateMiddleware,
      rootProps: props,
      zIndex: props.zIndex,
      arrowEl,
    })

    function computePositionOptions() {
      const options = {
        placement: props.placement,
        strategy: props.strategy,
        middleware: [],
      }
      if (props.platform) {
        Object.assign(options, { platform: props.platform })
      }
      return options
    }

    function updateMiddleware() {
      const middleware = []
      if (typeof props.offset === 'number') {
        middleware.push(offset(props.offset))
      }
      if (typeof props.shift === 'number') {
        middleware.push(shift({ padding: props.shift }))
      }
      if (props.flip) {
        middleware.push(flip())
      }
      if (arrowEl.value) {
        middleware.push(arrow({
          element: arrowEl.value,
          padding: props.arrowPadding,
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

    return () => {
      if (slots.default) {
        const defaultSlotNodes = filterSlot(flattenFragment(slots.default() || []))
        const hasFloatComponent = typeof findVNode(defaultSlotNodes, node => {
          return ['FloatButton', 'FloatContent'].includes((node.type as { name: string }).name)
        }) !== 'undefined'

        if (hasFloatComponent) {
          return defaultSlotNodes
        }

        const { createFloatContent } = useFloatContent({ floatApi, referenceEl, floatingEl })

        const [referenceNode, floatingNode] = filterSlot(
          flattenFragment(slots.default() || [])
        )

        if (!isValidElement(referenceNode) || !isValidElement(floatingNode)) {
          console.error(`[headlessui-float]: default slot must contains Headless UI's Button & Items Components.`)
          return
        }

        return [
          cloneVNode(referenceNode, { ref: referenceEl }),
          createFloatContent(
            floatingNode
              ? cloneVNode(floatingNode, { ref: floatingEl })
              : undefined
          ),
        ]
      }
    }
  },
})
