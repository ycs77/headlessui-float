import type { Ref } from 'vue'
import { dom } from './dom'
import { env } from './env'

// Reference: https://github.com/tailwindlabs/headlessui/blob/7794d563e181787e995db1f877cd26c460e385ee/packages/%40headlessui-vue/src/utils/owner.ts

export function getOwnerDocument<T extends Element | Ref<Element | null>>(
  element: T | null | undefined
) {
  if (env.isServer) return null
  if (element instanceof Node) return element.ownerDocument
  if (Object.prototype.hasOwnProperty.call(element, 'value')) {
    const domElement = dom(element)
    if (domElement) return domElement.ownerDocument
  }

  return document
}
