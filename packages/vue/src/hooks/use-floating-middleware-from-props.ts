import { watch } from 'vue'
import type { ComputedRef, Ref, ShallowRef } from 'vue'
import type { AutoPlacementOptions, FlipOptions, HideOptions, OffsetOptions, ShiftOptions } from '@floating-ui/core'
import { autoPlacement, flip, hide, offset, shift } from '@floating-ui/dom'
import type { DetectOverflowOptions, Middleware } from '@floating-ui/dom'
import { arrow } from '@floating-ui/vue'
import type { FloatingElement, ReferenceElement } from '../types'

export function useFloatingMiddlewareFromProps(
  middleware: ShallowRef<Middleware[]>,
  referenceEl: ComputedRef<ReferenceElement | null>,
  floatingEl: ComputedRef<FloatingElement | null>,
  arrowRef: Ref<HTMLElement | null>,
  props: {
    offset?: OffsetOptions
    shift?: boolean | number | Partial<ShiftOptions & DetectOverflowOptions>
    flip?: boolean | number | Partial<FlipOptions & DetectOverflowOptions>
    arrow?: boolean | number
    autoPlacement?: boolean | Partial<AutoPlacementOptions & DetectOverflowOptions>
    hide?: boolean | Partial<HideOptions & DetectOverflowOptions> | Partial<HideOptions & DetectOverflowOptions>[]
    middleware?: Middleware[] | ((refs: {
      referenceEl: ComputedRef<ReferenceElement | null>
      floatingEl: ComputedRef<FloatingElement | null>
    }) => Middleware[])
  }
) {
  watch([
    () => props.offset,
    () => props.flip,
    () => props.shift,
    () => props.autoPlacement,
    () => props.arrow,
    () => props.hide,
    () => props.middleware,
  ], () => {
    const _middleware = []
    if (typeof props.offset === 'number' ||
        typeof props.offset === 'object' ||
        typeof props.offset === 'function'
    ) {
      _middleware.push(offset(props.offset))
    }
    if (props.flip === true ||
        typeof props.flip === 'number' ||
        typeof props.flip === 'object'
    ) {
      _middleware.push(flip({
        padding: typeof props.flip === 'number' ? props.flip : undefined,
        ...(typeof props.flip === 'object' ? props.flip : {}),
      }))
    }
    if (props.shift === true ||
        typeof props.shift === 'number' ||
        typeof props.shift === 'object'
    ) {
      _middleware.push(shift({
        padding: typeof props.shift === 'number' ? props.shift : undefined,
        ...(typeof props.shift === 'object' ? props.shift : {}),
      }))
    }
    if (props.autoPlacement === true || typeof props.autoPlacement === 'object') {
      _middleware.push(autoPlacement(
        typeof props.autoPlacement === 'object'
          ? props.autoPlacement
          : undefined
      ))
    }
    _middleware.push(...(
      typeof props.middleware === 'function'
        ? props.middleware({
          referenceEl,
          floatingEl,
        })
        : props.middleware || []
    ))
    if (props.arrow === true || typeof props.arrow === 'number') {
      _middleware.push(arrow({
        element: arrowRef,
        padding: props.arrow === true ? 0 : props.arrow,
      }))
    }
    if (props.hide === true || typeof props.hide === 'object' || Array.isArray(props.hide)) {
      (Array.isArray(props.hide) ? props.hide : [props.hide]).forEach(hideOptions => {
        _middleware.push(hide(
          typeof hideOptions === 'object' ? hideOptions : undefined
        ))
      })
    }
    middleware.value = _middleware
  }, { immediate: true })
}
