// Reference: https://github.com/tailwindlabs/headlessui/blob/226042231d7529d530be7c65790fbb681b5adb63/packages/%40headlessui-react/src/utils/owner.ts

import type { MutableRefObject } from 'react'
import { env } from './env'

export function getOwnerDocument<T extends Element | MutableRefObject<Element | null>>(
  element: T | null | undefined
) {
  if (env.isServer) return null
  if (element instanceof Node) return element.ownerDocument
  if (element && Object.prototype.hasOwnProperty.call(element, 'current')) {
    if (element.current instanceof Node) return element.current.ownerDocument
  }

  return document
}
