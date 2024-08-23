// Reference: https://github.com/tailwindlabs/headlessui/blob/7794d563e181787e995db1f877cd26c460e385ee/packages/%40headlessui-vue/src/hooks/use-document-event.ts

import { watchEffect } from 'vue'
import { env } from '../utils/env'

export function useDocumentEvent<TType extends keyof DocumentEventMap>(
  type: TType,
  listener: (this: Document, ev: DocumentEventMap[TType]) => any,
  options?: boolean | AddEventListenerOptions
) {
  if (env.isServer) return

  watchEffect(onInvalidate => {
    document.addEventListener(type, listener, options)
    onInvalidate(() => document.removeEventListener(type, listener, options))
  })
}
