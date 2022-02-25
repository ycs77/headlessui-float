import { cloneVNode, defineComponent, h, inject, onMounted, getCurrentInstance } from 'vue'
import { arrowStateKey } from '../states/arrowState'

export default defineComponent({
  name: 'FloatArrow',
  setup(props, { slots, attrs }) {
    const arrowState = inject(arrowStateKey)
    if (!arrowState) {
        console.error(`[headlessui-float]: <FloatArrow> must be move in Headless UI's Items component.`)
        return
    }

    onMounted(() => {
      arrowState.set(getCurrentInstance()!.vnode.el as HTMLElement)
    })

    return () => {
      const node = slots.default?.()[0]
      return node ? cloneVNode(node) : h('div', attrs)
    }
  },
})
