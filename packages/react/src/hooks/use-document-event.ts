// Reference: https://github.com/tailwindlabs/headlessui/blob/7794d563e181787e995db1f877cd26c460e385ee/packages/%40headlessui-react/src/hooks/use-document-event.ts

import { useEffect } from 'react'
import { useLatestValue } from './use-latest-value'

export function useDocumentEvent<TType extends keyof DocumentEventMap>(
  type: TType,
  listener: (ev: DocumentEventMap[TType]) => any,
  options?: boolean | AddEventListenerOptions
) {
  const listenerRef = useLatestValue(listener)

  useEffect(() => {
    function handler(event: DocumentEventMap[TType]) {
      listenerRef.current(event)
    }

    document.addEventListener(type, handler, options)
    return () => document.removeEventListener(type, handler, options)
  }, [type, options])
}
