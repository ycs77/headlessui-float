export function showVueTransitionWarn(component: string, props: {
  vueTransition?: boolean
  transitionName?: string
  transitionType?: 'transition' | 'animation'
} & Record<string, any>) {
  if (!props.vueTransition && (props.transitionName || props.transitionType)) {
    console.warn(`[headlessui-float]: <${component} /> pass "transition-name" or "transition-type" prop, must be set "vue-transition" prop.`)
  }
}
