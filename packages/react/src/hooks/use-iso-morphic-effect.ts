import { type DependencyList, type EffectCallback, useEffect, useLayoutEffect } from 'react'
import { env } from '../utils/env'

// Reference: https://github.com/tailwindlabs/headlessui/blob/c7f6bc60ed2ab6c84fb080b0f419ed16824c880d/packages/%40headlessui-react/src/hooks/use-iso-morphic-effect.ts

export const useIsoMorphicEffect = (effect: EffectCallback, deps?: DependencyList | undefined) => {
  if (env.isServer) {
    useEffect(effect, deps)
  } else {
    useLayoutEffect(effect, deps)
  }
}
