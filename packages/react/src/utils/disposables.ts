// Reference: https://github.com/tailwindlabs/headlessui/blob/7794d563e181787e995db1f877cd26c460e385ee/packages/%40headlessui-react/src/utils/disposables.ts

import { microTask } from './micro-task'

export type Disposables = ReturnType<typeof disposables>

export function disposables() {
  const disposables: Function[] = []

  const api = {
    addEventListener<TEventName extends keyof WindowEventMap>(
      element: HTMLElement | Window | Document,
      name: TEventName,
      listener: (event: WindowEventMap[TEventName]) => any,
      options?: boolean | AddEventListenerOptions
    ) {
      element.addEventListener(name, listener as any, options)
      return api.add(() => element.removeEventListener(name, listener as any, options))
    },

    requestAnimationFrame(...args: Parameters<typeof requestAnimationFrame>) {
      const raf = requestAnimationFrame(...args)
      return api.add(() => cancelAnimationFrame(raf))
    },

    nextFrame(...args: Parameters<typeof requestAnimationFrame>) {
      return api.requestAnimationFrame(() => {
        return api.requestAnimationFrame(...args)
      })
    },

    setTimeout(...args: Parameters<typeof setTimeout>) {
      const timer = setTimeout(...args)
      return api.add(() => clearTimeout(timer))
    },

    microTask(...args: Parameters<typeof microTask>) {
      const task = { current: true }
      microTask(() => {
        if (task.current) {
          args[0]()
        }
      })
      return api.add(() => {
        task.current = false
      })
    },

    add(cb: () => void) {
      disposables.push(cb)
      return () => {
        const idx = disposables.indexOf(cb)
        if (idx >= 0) {
          const [dispose] = disposables.splice(idx, 1)
          dispose()
        }
      }
    },

    dispose() {
      for (const dispose of disposables.splice(0)) {
        dispose()
      }
    },

    style(node: HTMLElement, property: string, value: string) {
      const previous = node.style.getPropertyValue(property)
      Object.assign(node.style, { [property]: value })
      return this.add(() => {
        Object.assign(node.style, { [property]: previous })
      })
    },
  }

  return api
}
