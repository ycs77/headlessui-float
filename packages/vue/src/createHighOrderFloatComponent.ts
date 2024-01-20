import { type SetupContext, h, mergeProps } from 'vue'
import { Float, type FloatProps, type FloatSlotProps } from './float'

export function createHighOrderFloatComponent(baseProps: FloatProps) {
  return ((overrideProps: FloatProps, { slots }: SetupContext) => {
    return h(Float, mergeProps(
      baseProps as Record<string, any>,
      overrideProps as Record<string, any>
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
