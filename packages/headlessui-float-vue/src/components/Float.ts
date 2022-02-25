import { defineComponent, ref, computed, nextTick, h, cloneVNode, Transition, Teleport, PropType, VNode } from 'vue'
import { computePosition, offset, flip, shift, arrow, getScrollParents, Placement, Strategy, Middleware, Platform } from '@floating-ui/dom'
import { defaultPlacementClassResolver } from '../placement-class-resolvers'
import { dom } from '../utils/dom'
import { filterSlot, flattenFragment, isValidElement } from '../utils/render'
import { useArrow } from '../states/arrowState'
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
      default: true,
    },
    arrowPadding: {
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
    platform: Object as PropType<Platform>,
  },
  setup(props, { slots }) {
    const arrowState = useArrow()

    const referenceEl = ref<HTMLElement | null>(null)
    const floatingEl = ref<HTMLElement | null>(null)

    const placementOriginClass = computed(() => {
      return props.originClass || props.placementClassResolver(props.placement)
    })

    const getComputePositionOptions = () => {
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
      if (arrowState.el) {
        middleware.push(arrow({
          element: arrowState.el,
          padding: props.arrowPadding,
        }))
      }

      const options = {
        placement: props.placement,
        strategy: props.strategy,
        middleware: middleware.concat(props.middleware),
      }
      if (props.platform) {
        Object.assign(options, { platform: props.platform })
      }
      return options
    }

    const updateFloatingEl = () => {
      Object.assign(dom(floatingEl)!.style, {
        position: props.strategy,
        zIndex: props.zIndex,
      })

      computePosition(dom(referenceEl)!, dom(floatingEl)!, getComputePositionOptions())
        .then(({ x, y, placement, middlewareData }) => {
          Object.assign(dom(floatingEl)!.style, {
            left: `${x}px`,
            top: `${y}px`,
          })

          if (arrowState.el) {
            const { x: arrowX, y: arrowY } = middlewareData.arrow as { x?: number, y?: number }
            const staticSide = {
              top: 'bottom',
              right: 'left',
              bottom: 'top',
              left: 'right',
            }[placement.split('-')[0]]!
            Object.assign(arrowState.el.style, {
              left: typeof arrowX === 'number' ? `${arrowX}px` : '',
              top: typeof arrowY === 'number' ? `${arrowY}px` : '',
              right: '',
              bottom: '',
              [staticSide]: '-4px',
            })
          }
        })
    }

    const hideFloatingEl = () => {
      if (dom(floatingEl)?.style) {
        Object.assign(dom(floatingEl)!.style, {
          position: null,
          zIndex: null,
          left: null,
          top: null,
        })
      }
    }

    const attachListeners = () => {
      [
        ...getScrollParents(dom(referenceEl)!),
        ...getScrollParents(dom(floatingEl)!),
      ].forEach((el) => {
        el.addEventListener('scroll', updateFloatingEl)
        el.addEventListener('resize', updateFloatingEl)
      })
    }
    const detachListeners = () => {
      [
        ...getScrollParents(dom(referenceEl)!),
        ...(dom(floatingEl) ? getScrollParents(dom(floatingEl)!) : []),
      ].forEach((el) => {
        el.removeEventListener('scroll', updateFloatingEl)
        el.removeEventListener('resize', updateFloatingEl)
      })
    }

    const transitionProps = {
      enterActiveClass: props.transition ? `${props.enterActiveClass} ${placementOriginClass.value}` : undefined,
      enterFromClass: props.transition ? props.enterFromClass : undefined,
      enterToClass: props.transition ? props.enterToClass : undefined,
      leaveActiveClass: props.transition ? `${props.leaveActiveClass} ${placementOriginClass.value}` : undefined,
      leaveFromClass: props.transition ? props.leaveFromClass : undefined,
      leaveToClass: props.transition ? props.leaveToClass : undefined,
      async onBeforeEnter() {
        await nextTick()
        updateFloatingEl()
        attachListeners()
      },
      onAfterLeave() {
        detachListeners()
        hideFloatingEl()
      },
    }

    return () => {
      const [referenceNode, defaultSlotContentNode, ...otherNodes] = filterSlot(
        flattenFragment(slots.default?.() || [])
      )

      if (!isValidElement(referenceNode)) {
        console.error(`[headlessui-float]: default slot must contains Headless UI's Button & Items Components.`)
        return
      }

      let floatingNode = filterSlot(
        flattenFragment(slots.content?.() || [])
      )[0] || defaultSlotContentNode

      const eachFloatingNode = (node: any): any => {
        const newNode = cloneVNode(node)
        if (typeof newNode.children === 'string') {
          newNode.children = newNode.children+'123'
        }
        if (Array.isArray(newNode.children)) {
          newNode.children = newNode.children.map(n => eachFloatingNode(n))
        }
        return newNode
      }
      floatingNode = eachFloatingNode(floatingNode)

      const wrapTeleport = (node: VNode) => {
        if (props.teleport === false) {
          return node
        }
        return h(Teleport, { to: props.teleport === true ? 'body' : props.teleport }, [node])
      }

      return [
        cloneVNode(referenceNode, { ref: referenceEl }),
        wrapTeleport(
          h(Transition, transitionProps, () => {
            return floatingNode
              ? cloneVNode(floatingNode, { ref: floatingEl })
              : undefined
          })
        ),
        ...otherNodes.map(node => cloneVNode(node)),
      ]
    }
  },
})
