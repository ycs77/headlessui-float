import { useMemo } from 'react'
import type { Placement } from '@floating-ui/core'
import { type ClassResolver, tailwindcssOriginClassResolver } from '../class-resolvers'

export function useOriginClass(props: {
  originClass?: string | ClassResolver
  tailwindcssOriginClass?: boolean
}, placement: Placement) {
  return useMemo(() => {
    if (typeof props.originClass === 'function') {
      return props.originClass(placement)
    } else if (typeof props.originClass === 'string') {
      return props.originClass
    } else if (props.tailwindcssOriginClass) {
      return tailwindcssOriginClassResolver(placement)
    }
    return ''
  }, [placement, props.originClass, props.tailwindcssOriginClass])
}
