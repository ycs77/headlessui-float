// Reference: https://github.com/tailwindlabs/headlessui/blob/7794d563e181787e995db1f877cd26c460e385ee/packages/%40headlessui-react/src/hooks/use-latest-value.ts

import { useRef } from 'react'
import { useIsoMorphicEffect } from './use-iso-morphic-effect'

export function useLatestValue<T>(value: T) {
  const cache = useRef(value)

  useIsoMorphicEffect(() => {
    cache.current = value
  }, [value])

  return cache
}
