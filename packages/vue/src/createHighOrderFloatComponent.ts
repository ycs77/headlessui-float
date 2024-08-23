import { defineComponent, h, mergeProps } from 'vue'
import { Float } from './float'
import type { FloatProps } from './float'

export function createHighOrderFloatComponent(baseProps: FloatProps) {
  const HighOrderFloat = defineComponent({
    name: 'HighOrderFloat',
    setup(overrideProps, { slots }) {
      return () => h(Float, mergeProps(
        baseProps as Record<string, any>,
        overrideProps as Record<string, any>
      ), slots)
    },
  })

  return HighOrderFloat as unknown as typeof Float
}
