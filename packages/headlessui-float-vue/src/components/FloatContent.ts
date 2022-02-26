import { defineComponent, computed, h, nextTick, inject, cloneVNode, Teleport, Transition, VNode } from 'vue'
import { floatingKey, floatApiKey } from '../composables/useFloat'

export default defineComponent({
  name: 'FloatContent',
  setup(props, { slots }) {
    const floatApi = inject(floatApiKey)
    if (!floatApi) {
      console.error(`[headlessui-float]: <FloatContent> must be move in <Float> component.`)
      return
    }

    const floatingRef = inject(floatingKey)!

    const rProps = floatApi.rootProps

    const placementOriginClass = computed(() => {
      return rProps.originClass || rProps.placementClassResolver(rProps.placement)
    })

    const transitionProps = {
      enterActiveClass: rProps.transition ? `${rProps.enterActiveClass} ${placementOriginClass.value}` : undefined,
      enterFromClass: rProps.transition ? rProps.enterFromClass : undefined,
      enterToClass: rProps.transition ? rProps.enterToClass : undefined,
      leaveActiveClass: rProps.transition ? `${rProps.leaveActiveClass} ${placementOriginClass.value}` : undefined,
      leaveFromClass: rProps.transition ? rProps.leaveFromClass : undefined,
      leaveToClass: rProps.transition ? rProps.leaveToClass : undefined,

      async onBeforeEnter() {
        await nextTick()
        await floatApi.update()
        await floatApi.show()
      },
      onAfterLeave() {
        floatApi.hide()
      },
    }

    const wrapTeleport = (node: VNode) => {
      if (rProps.teleport === false) {
        return node
      }
      return h(Teleport, { to: rProps.teleport === true ? 'body' : rProps.teleport }, [node])
    }

    return () => {
      if (slots.default) {
        const [node] = slots.default()
        return wrapTeleport(h(Transition, transitionProps, () =>
          node
            ? cloneVNode(node, { ref: floatingRef })
            : undefined
        ))
      }
    }
  },
})
