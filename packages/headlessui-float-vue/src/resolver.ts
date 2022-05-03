// @ts-ignore
import type { ComponentResolver } from 'unplugin-vue-components'

const components = [
  'Float',
  'FloatArrow',
]

export interface HeadlessUiFloatResolverOptions {
  prefix?: string
}

export function HeadlessUiFloatResolver(options: HeadlessUiFloatResolverOptions = {}): ComponentResolver {
  const { prefix = '' } = options
  return {
    type: 'component',
    resolve: (name: string) => {
      if (name.startsWith(prefix)) {
        const componentName = name.substring(prefix.length)
        if (components.includes(componentName)) {
          return {
            importName: componentName,
            path: 'headlessui-float-vue',
          }
        }
      }
    },
  }
}
