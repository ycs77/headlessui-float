import { type ComputedRef, type Ref, onBeforeUnmount, onMounted } from 'vue'
import type { ReferenceElement } from '@floating-ui/dom'
import { env } from '../utils/env'

export function useReferenceElResizeObserver(
  enabled: boolean | undefined,
  referenceEl: ComputedRef<ReferenceElement | null>,
  referenceElWidth: Ref<number | null>,
) {
  let cleanupResizeObserver: () => void = () => {}

  onMounted(() => {
    if (enabled &&
        env.isClient &&
        typeof ResizeObserver !== 'undefined' &&
        referenceEl.value &&
        referenceEl.value instanceof Element
    ) {
      const observer = new ResizeObserver(([entry]) => {
        referenceElWidth.value = entry.borderBoxSize.reduce((acc, { inlineSize }) => acc + inlineSize, 0)
      })
      observer.observe(referenceEl.value)

      cleanupResizeObserver = () => {
        observer.disconnect()
        referenceElWidth.value = null
      }
    }
  })

  onBeforeUnmount(() => {
    cleanupResizeObserver()
  })
}
