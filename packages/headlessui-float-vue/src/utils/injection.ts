import { getCurrentInstance, ComponentInternalInstance, InjectionKey } from 'vue'

interface ComponentInstance extends ComponentInternalInstance {
  provides: Record<string | symbol, any>
}

export function injectOrCreate<T>(key: InjectionKey<T>, createNewValue: () => T): T {
  const instance = getCurrentInstance()!
  const provides =
    instance.parent == null
      ? instance.vnode.appContext && instance.vnode.appContext.provides
      : (instance.parent as ComponentInstance).provides

  return provides && (key as string | symbol) in provides
      ? provides[key as string | symbol]
      : createNewValue()
}
