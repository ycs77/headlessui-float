// Reference: https://github.com/tailwindlabs/headlessui/blob/7794d563e181787e995db1f877cd26c460e385ee/packages/%40headlessui-react/src/hooks/use-iso-morphic-effect.ts

import { type DependencyList, type EffectCallback, useEffect, useLayoutEffect } from 'react'
import { env } from '../utils/env'

export const useIsoMorphicEffect = (effect: EffectCallback, deps?: DependencyList | undefined) => {
  if (env.isServer) {
    useEffect(effect, deps)
  } else {
    useLayoutEffect(effect, deps)
  }
}
