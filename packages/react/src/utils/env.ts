// Reference: https://github.com/tailwindlabs/headlessui/blob/7794d563e181787e995db1f877cd26c460e385ee/packages/%40headlessui-react/src/utils/env.ts

export type RenderEnv = 'client' | 'server'

class Env {
  current: RenderEnv = this.detect()
  currentId = 0

  set(env: RenderEnv): void {
    if (this.current === env) return

    this.currentId = 0
    this.current = env
  }

  reset(): void {
    this.set(this.detect())
  }

  nextId() {
    return ++this.currentId
  }

  get isServer(): boolean {
    return this.current === 'server'
  }

  get isClient(): boolean {
    return this.current === 'client'
  }

  private detect(): RenderEnv {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return 'server'
    }

    return 'client'
  }
}

export const env = new Env()
