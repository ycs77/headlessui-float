import { defineComponent, inject, cloneVNode } from 'vue'
import { floatingElKey, floatApiKey, referenceElKey } from '../composables/useFloat'
import { useFloatContent } from '../composables/useFloatContent'

export default defineComponent({
  name: 'FloatContent',
  setup(props, { slots }) {
    const floatApi = inject(floatApiKey)
    if (!floatApi) {
      console.error(`[headlessui-float]: <FloatContent> must be move in <Float> component.`)
      return
    }

    const referenceEl = inject(referenceElKey)!
    const floatingEl = inject(floatingElKey)!
    const { createFloatContent } = useFloatContent({ floatApi, referenceEl, floatingEl })

    return () => {
      if (slots.default) {
        const [node] = slots.default()
        return createFloatContent(
          node
            ? cloneVNode(node, { ref: floatingEl })
            : undefined
        )
      }
    }
  },
})
