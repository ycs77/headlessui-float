import { defineComponent, inject, onMounted, cloneVNode, getCurrentInstance } from 'vue'
import { floatApiKey, referenceElKey } from '../composables/useFloat'

export default defineComponent({
  name: 'FloatButton',
  setup(props, { slots }) {
    const floatApi = inject(floatApiKey)
    if (!floatApi) {
      console.error(`[headlessui-float]: <FloatButton> must be move in <Float> component.`)
      return
    }

    const referenceEl = inject(referenceElKey)!

    onMounted(() => {
      referenceEl.value = getCurrentInstance()!.vnode.el as HTMLElement
    })

    return () => {
      if (slots.default) {
        const [node] = slots.default()
        return node
          ? cloneVNode(node, { ref: referenceEl })
          : undefined
      }
    }
  },
})
