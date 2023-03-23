import { type Ref, computed } from 'vue'
import type { Placement } from '@floating-ui/core'
import { type ClassResolver, tailwindcssOriginClassResolver } from '../class-resolvers'

export function useTransitionAndOriginClass(props: {
  enter?: string
  leave?: string
  originClass?: string | ClassResolver
  tailwindcssOriginClass?: boolean
}, placement: Ref<Placement>) {
  const originClassRef = computed(() => {
    if (typeof props.originClass === 'function') {
      return props.originClass(placement.value)
    } else if (typeof props.originClass === 'string') {
      return props.originClass
    } else if (props.tailwindcssOriginClass) {
      return tailwindcssOriginClassResolver(placement.value)
    }
    return undefined
  })

  const enterActiveClassRef = computed(() =>
    props.enter || originClassRef.value
      ? `${props.enter || ''} ${originClassRef.value || ''}`
      : undefined
  )

  const leaveActiveClassRef = computed(() =>
    props.leave || originClassRef.value
      ? `${props.leave || ''} ${originClassRef.value || ''}`
      : undefined
  )

  return { originClassRef, enterActiveClassRef, leaveActiveClassRef }
}
