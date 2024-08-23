// Reference: https://github.com/tailwindlabs/headlessui/blob/d4a94cb5647d9e11ffc72d92033d43cbc3361da7/packages/%40headlessui-vue/src/utils/dom.ts

import type { VirtualElement } from '@floating-ui/dom'
import { ref as createRef } from 'vue'
import type { ComponentPublicInstance, Ref } from 'vue'

type AsElement<T extends HTMLElement | VirtualElement | ComponentPublicInstance> =
  | (T extends HTMLElement ? T : HTMLElement)
  | null

export function dom<T extends HTMLElement | VirtualElement | ComponentPublicInstance>(
  ref?: Ref<T | null> | null
): AsElement<T> | null {
  if (ref == null) return null
  if (ref.value == null) return null

  // In this case we check for `Node` because returning `null` from a
  // component renders a `Comment` which is a `Node` but not `Element`
  // The types don't encode this possibility but we handle it here at runtime
  if (ref.value instanceof Node) {
    return ref.value as AsElement<T>
  }

  // Recursion call dom to get element in nested component
  if ('$el' in ref.value && ref.value.$el) {
    return dom(createRef(ref.value.$el))
  }

  // Pass `VirtualElement` for Floating UI
  if ('getBoundingClientRect' in ref.value) {
    return ref.value as AsElement<T>
  }

  return null
}
