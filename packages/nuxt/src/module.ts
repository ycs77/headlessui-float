import { addComponent, defineNuxtModule } from '@nuxt/kit'

export interface ModuleOptions {
  prefix?: string
}

const components = [
  'Float',
  'FloatArrow',
  'FloatContent',
  'FloatReference',
]

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'headlessui-float',
    configKey: 'headlessuiFloat',
    compatibility: {
      nuxt: '^3.0.0',
    },
  },
  defaults: {
    prefix: '',
  },
  setup(options) {
    components.forEach(componentName => {
      addComponent({
        name: `${options.prefix}${componentName}`,
        export: componentName,
        filePath: '@headlessui-float/vue',
      })
    })
  },
})
