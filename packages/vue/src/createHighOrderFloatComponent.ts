import { type FunctionalComponent, h, mergeProps } from 'vue'
import { Float, type FloatProps } from './float'

export function createHighOrderFloatComponent(props: FloatProps): FunctionalComponent<FloatProps> {
  return (userProps, { slots }) => {
    return h(Float, mergeProps(
      props as Record<string, any>,
      userProps as Record<string, any>
    ), slots)
  }
}
