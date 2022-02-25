import { defineComponent, ref, computed, nextTick, h, cloneVNode, Transition, Teleport, PropType, ComponentPublicInstance, VNode } from 'vue'
import { computePosition, offset, flip, shift, Placement, Strategy, Middleware } from '@floating-ui/dom'
import { ComputePositionConfig } from '@floating-ui/core'
import { defaultPlacementClassResolver } from '../placement-class-resolvers'
import { filterSlot, isValidElement } from '../utils/render'
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
    offset: {
      type: Number,
      default: 0,
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
    options: {
      type: Object as PropType<Partial<ComputePositionConfig>>,
      default: () => ({}),
    },
  },
  setup(props, { slots }) {
    const buttonRef = ref<ComponentPublicInstance>(null!)

    const placementOriginClass = computed(() => {
      return props.originClass || props.placementClassResolver(props.placement)
    })

    return () => {
      const [buttonNode, defaultContentNode] = filterSlot(slots.default?.() || [])
      const [contentNode] = filterSlot(slots.content?.() || [])

      if (!isValidElement(buttonNode)) {
        console.error(`[headlessui-float]: default slot must contains Headless UI's Button & Items Components.`)
        return
      }

      const showFloatEl = async (floatingEl: any) => {
        await nextTick()

        Object.assign(floatingEl.style, {
          position: props.strategy,
          zIndex: props.zIndex,
        })

        computePosition(buttonRef.value.$el, floatingEl, {
          ...props.options,
          placement: props.placement,
          strategy: props.strategy,
          middleware: [
            offset(props.offset),
            flip(),
            shift({ padding: 6 }),
          ].concat(props.middleware),
        }).then(({ x, y }) => {
          Object.assign(floatingEl.style, {
            left: `${x}px`,
            top: `${y}px`,
          })
        })
      }

      const hideFloatEl = async (floatingEl: any) => {
        await nextTick()

        Object.assign(floatingEl.style, {
          position: null,
          zIndex: null,
          left: null,
          top: null,
        })
      }

      const transitionProps = {
        enterActiveClass: props.transition ? `${props.enterActiveClass} ${placementOriginClass.value}` : undefined,
        enterFromClass: props.transition ? props.enterFromClass : undefined,
        enterToClass: props.transition ? props.enterToClass : undefined,
        leaveActiveClass: props.transition ? `${props.leaveActiveClass} ${placementOriginClass.value}` : undefined,
        leaveFromClass: props.transition ? props.leaveFromClass : undefined,
        leaveToClass: props.transition ? props.leaveToClass : undefined,
        onBeforeEnter: showFloatEl,
        onAfterLeave: hideFloatEl,
      }

      const wrapTeleport = (node: VNode) => {
        if (props.teleport === false) {
          return node
        }
        return h(Teleport, { to: props.teleport === true ? 'body' : props.teleport }, [node])
      }

      return [
        ...[cloneVNode(buttonNode, { ref: buttonRef })],

        wrapTeleport(
          h(Transition, transitionProps, () => contentNode || defaultContentNode)
        ),
      ]
    }
  },
})
