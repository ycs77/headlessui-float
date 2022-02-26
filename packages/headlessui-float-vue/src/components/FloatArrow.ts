import { cloneVNode, defineComponent, h, inject, onMounted } from 'vue'
import { arrowElKey } from '../composables/useArrow'

export default defineComponent({
  name: 'FloatArrow',
  setup(props, { slots, attrs }) {
    const arrowEl = inject(arrowElKey)
    if (!arrowEl) {
      console.error(`[headlessui-float]: <FloatArrow> must be move in Headless UI's Items component.`)
      return
    }

    return () => {
      const node = slots.default?.()[0]
      return node
        ? cloneVNode(node, { ref: arrowEl })
        : h('div', Object.assign({}, attrs, { ref: arrowEl }))
    }
  },
})
