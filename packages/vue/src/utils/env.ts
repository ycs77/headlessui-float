// Reference: https://github.com/tailwindlabs/headlessui/blob/c7f6bc60ed2ab6c84fb080b0f419ed16824c880d/packages/%40headlessui-vue/src/utils/env.ts

type RenderEnv = 'client' | 'server'

class Env {
  current: RenderEnv = this.detect()

  set(env: RenderEnv): void {
    if (this.current === env) return

    this.current = env
  }

  reset(): void {
    this.set(this.detect())
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
