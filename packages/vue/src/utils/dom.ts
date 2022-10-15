import { type Ref, unref } from 'vue'

// Reference: https://github.com/tailwindlabs/headlessui/blob/d8424fe311923f6858f6e3d55083df957bca824d/packages/%40headlessui-vue/src/utils/dom.ts#L3-L7

export function dom<T extends HTMLElement>(ref?: Ref<T | null> | T | null): T | null {
  ref = unref(ref)
  if (ref == null) return null

  const el = ((ref as T & { $el: unknown })?.$el ?? ref) as T | null
  if ((el as T & { $el: unknown }).$el) return dom(el)
  return el
}
