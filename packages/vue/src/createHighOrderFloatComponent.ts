import { type FunctionalComponent, h, mergeProps } from 'vue'
import { Float, type FloatPropsType } from './float'

export function createHighOrderFloatComponent(props: FloatPropsType): FunctionalComponent<FloatPropsType> {
  return (userProps, { slots }) => {
    return h(Float, mergeProps(
      props as Record<string, any>,
      userProps as Record<string, any>
    ), slots)
  }
}
