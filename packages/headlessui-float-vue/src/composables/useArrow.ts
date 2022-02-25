import { ref, provide, InjectionKey, Ref } from 'vue'
import { injectOrCreate } from '../utils/injection'

export type ArrowEl = Ref<HTMLElement | null>

export const arrowElKey = Symbol() as InjectionKey<ArrowEl>

export function useArrow() {
  const isNew = ref(false)
  const arrowEl = injectOrCreate(arrowElKey, () => {
    isNew.value = true
    return ref(null)
  })

  if (isNew.value) {
    provide(arrowElKey, arrowEl)
  }

  return arrowEl
}
