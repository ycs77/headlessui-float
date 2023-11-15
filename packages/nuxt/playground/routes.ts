import type { RouteRecordRaw } from 'vue-router'

export type RouteRecord = RouteRecordRaw & {
  title?: string
  group?: string
  soon?: boolean
}

export const featuresRoutes = <RouteRecord[]>[
  { path: '/floatingui-options', title: 'Floating UI options' },
  { path: '/transition' },
  { path: '/arrow' },
  { path: '/portal' },
  { path: '/high-order-component', title: 'High-order component' },
]

export const componentsRoutes = <RouteRecord[]>[
  { path: '/menu' },
  { path: '/listbox' },
  { path: '/combobox' },
  { path: '/popover' },
  { path: '/virtual-element' },
]

export const routes = <RouteRecord[]>[
  ...featuresRoutes.map(route => ({ ...route, group: 'features' })),
  ...componentsRoutes.map(route => ({ ...route, group: 'components' })),
]
