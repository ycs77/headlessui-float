import { computed, h, nextTick, Teleport, Transition, Ref, VNode } from 'vue'
import { getScrollParents } from '@floating-ui/dom'
import { FloatApi } from './useFloat'
import { dom } from '../utils/dom'

export interface UseFloatContent {
  floatApi: FloatApi
  referenceEl: Ref<HTMLElement | null>
  floatingEl: Ref<HTMLElement | null>
}

export function useFloatContent(options: UseFloatContent) {
  const { floatApi, referenceEl, floatingEl } = options
  const props = floatApi.rootProps

  const getScrollParentsSafe = (el: Ref<HTMLElement | null> | HTMLElement | null) =>
    dom(el) ? getScrollParents(dom(el)!) : []

  const attachListeners = () => {
    [
      ...getScrollParentsSafe(referenceEl),
      ...getScrollParentsSafe(floatingEl),
    ].forEach((el) => {
      el.addEventListener('scroll', floatApi.update)
      el.addEventListener('resize', floatApi.update)
    })
  }

  const detachListeners = () => {
    [
      ...getScrollParentsSafe(dom(referenceEl)!),
      ...getScrollParentsSafe(floatingEl),
    ].forEach((el) => {
      el.removeEventListener('scroll', floatApi.update)
      el.removeEventListener('resize', floatApi.update)
    })
  }

  const placementOriginClass = computed(() => {
    return props.originClass || props.placementClassResolver(props.placement)
  })

  const transitionProps = {
    enterActiveClass: props.transition ? `${props.enterActiveClass} ${placementOriginClass.value}` : undefined,
    enterFromClass: props.transition ? props.enterFromClass : undefined,
    enterToClass: props.transition ? props.enterToClass : undefined,
    leaveActiveClass: props.transition ? `${props.leaveActiveClass} ${placementOriginClass.value}` : undefined,
    leaveFromClass: props.transition ? props.leaveFromClass : undefined,
    leaveToClass: props.transition ? props.leaveToClass : undefined,
    async onBeforeEnter() {
      await nextTick()
      floatApi.update()
      attachListeners()
    },
    onAfterLeave() {
      detachListeners()
      floatApi.hide()
    },
  }

  const wrapTeleport = (node: VNode) => {
    if (props.teleport === false) {
      return node
    }
    return h(Teleport, { to: props.teleport === true ? 'body' : props.teleport }, [node])
  }

  const createFloatContent = (content: any) => wrapTeleport(h(Transition, transitionProps, () => content))

  return { createFloatContent }
}
