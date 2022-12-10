import { type ComponentPublicInstance, type Ref, ref as createRef } from 'vue'

// Reference: https://github.com/tailwindlabs/headlessui/blob/426cbf34c50252932f4e26a954226539316ca8bc/packages/%40headlessui-vue/src/utils/dom.ts#L3-L8

export function dom<T extends Element | ComponentPublicInstance>(ref?: Ref<T | null>): T | null {
  if (ref == null) return null
  if (ref.value == null) return null

  const el = ((ref.value as { $el?: T }).$el ?? ref.value) as T | null
  if ((el as { $el?: T }).$el) return dom(createRef(el) as any)
  return el
}
