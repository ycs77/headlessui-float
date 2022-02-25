import { reactive, provide, getCurrentInstance, InjectionKey, ComponentInternalInstance } from 'vue'

interface ComponentInstance extends ComponentInternalInstance {
  provides: Record<string | symbol, any>
}

export interface ArrowState {
  el: HTMLElement | null
  set: (el: HTMLElement | null) => void
}
export const arrowStateKey = Symbol() as InjectionKey<ArrowState>

export const useArrow = () => {
  const instance = getCurrentInstance()!
  const provides =
    instance.parent == null
      ? instance.vnode.appContext && instance.vnode.appContext.provides
      : (instance.parent as ComponentInstance).provides

  const arrowState: ArrowState =
    provides && (arrowStateKey as string | symbol) in provides
      ? provides[arrowStateKey as string | symbol]
      : reactive({
        el: null,
        set: el => {
          arrowState.el = el
        },
      })

  provide(arrowStateKey, arrowState)

  return arrowState
}
