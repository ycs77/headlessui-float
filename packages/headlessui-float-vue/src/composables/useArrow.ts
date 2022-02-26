import { ref, provide, InjectionKey, Ref } from 'vue'
import { injectOrCreate } from '../utils/injection'

export type ArrowEl = Ref<HTMLElement | null>

export const arrowElKey = Symbol() as InjectionKey<ArrowEl>

export function useArrow() {
  const arrowEl = injectOrCreate(arrowElKey, () => ref(null))

  provide(arrowElKey, arrowEl)

  return arrowEl
}
