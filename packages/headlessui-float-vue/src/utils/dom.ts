import { Ref } from 'vue'

/** @see https://github.com/tailwindlabs/headlessui/blob/d8424fe311923f6858f6e3d55083df957bca824d/packages/%40headlessui-vue/src/utils/dom.ts#L3-L7 */
export function dom<T extends HTMLElement>(ref?: Ref<T | null>): T | null {
  if (ref == null) return null
  if (ref.value == null) return null
  return ((ref as Ref<T & { $el: unknown }>).value.$el ?? ref.value) as T | null
}
