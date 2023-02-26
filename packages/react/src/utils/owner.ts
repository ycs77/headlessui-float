import type { MutableRefObject } from 'react'
import { env } from './env'

// Reference: https://github.com/tailwindlabs/headlessui/blob/7794d563e181787e995db1f877cd26c460e385ee/packages/%40headlessui-react/src/utils/owner.ts

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
