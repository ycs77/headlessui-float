// Reference: https://github.com/tailwindlabs/headlessui/blob/226042231d7529d530be7c65790fbb681b5adb63/packages/%40headlessui-vue/src/utils/owner.ts

import type { Ref } from 'vue'
import { dom } from './dom'
import { env } from './env'

export function getOwnerDocument<T extends HTMLElement | Ref<HTMLElement | null>>(
  element: T | null | undefined
) {
  if (env.isServer) return null
  if (element instanceof Node) return element.ownerDocument
  if (element && Object.prototype.hasOwnProperty.call(element, 'value')) {
    const domElement = dom(element as any)
    if (domElement) return domElement.ownerDocument
  }

  return document
}
