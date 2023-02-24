import type { ComputedRef } from 'vue'
import { type ReferenceElement, autoUpdate } from '@floating-ui/dom'
import type { Options as AutoUpdateOptions } from '@floating-ui/dom/src/autoUpdate'
import { isVisibleDOMElement } from '../utils/render'

export function useAutoUpdate(
  referenceEl: ComputedRef<ReferenceElement | null>,
  floatingEl: ComputedRef<HTMLElement | null>,
  update: () => void,
  options: boolean | Partial<AutoUpdateOptions> | undefined,
) {
  if (isVisibleDOMElement(referenceEl) &&
      isVisibleDOMElement(floatingEl) &&
      options !== false
  ) {
    return autoUpdate(
      referenceEl.value!,
      floatingEl.value!,
      update,
      typeof options === 'object'
        ? options
        : undefined
    )
  }

  return () => {}
}
