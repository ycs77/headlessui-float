import { cloneVNode, defineComponent, h, inject, onMounted, getCurrentInstance } from 'vue'
import { arrowElKey } from '../composables/useArrow'

export default defineComponent({
  name: 'FloatArrow',
  setup(props, { slots, attrs }) {
    const arrowEl = inject(arrowElKey)
    if (!arrowEl) {
      console.error(`[headlessui-float]: <FloatArrow> must be move in Headless UI's Items component.`)
      return
    }

    onMounted(() => {
      arrowEl.value = getCurrentInstance()!.vnode.el as HTMLElement
    })

    return () => {
      const node = slots.default?.()[0]
      return node ? cloneVNode(node) : h('div', attrs)
    }
  },
})
