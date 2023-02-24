import { autoUpdate } from '@floating-ui/dom'
import type { ExtendedRefs } from '@floating-ui/react'
import type { Options as AutoUpdateOptions } from '@floating-ui/dom/src/autoUpdate'

export function useAutoUpdate(
  refs: ExtendedRefs<HTMLElement>,
  update: () => void,
  options: boolean | Partial<AutoUpdateOptions> | undefined,
) {
  if (refs.reference.current &&
      refs.floating.current &&
      options !== false
  ) {
    return autoUpdate(
      refs.reference.current,
      refs.floating.current,
      update,
      typeof options === 'object'
        ? options
        : undefined
    )
  }

  return () => {}
}
