import { type SetupContext, h, mergeProps } from 'vue'
import { Float, type FloatProps, type FloatSlotProps } from './float'

export function createHighOrderFloatComponent(props: FloatProps) {
  return ((userProps: FloatProps, { slots }: SetupContext) => {
    return h(Float, mergeProps(
      props as Record<string, any>,
      userProps as Record<string, any>
    ), slots)
  }) as unknown as {
    new (): {
      $props: FloatProps
      $slots: {
        default(props: FloatSlotProps): any
      }
    }
  }
}
