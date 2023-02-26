import type { ElementType } from 'react'
import FloatinguiOptions from '@/pages/floatingui-options'
import Transition from '@/pages/transition'
import Arrow from '@/pages/arrow'
import AdaptiveWidth from '@/pages/adaptive-width'
import Portal from '@/pages/portal'
import Static from '@/pages/static'
import HighOrderComponent from '@/pages/high-order-component'
import Menu from '@/pages/menu'
import Listbox from '@/pages/listbox'
import Combobox from '@/pages/combobox'
import Dialog from '@/pages/dialog'
import Popover from '@/pages/popover'
import VirtualElement from '@/pages/virtual-element'

export interface RouteRecord {
  path: string
  component?: ElementType | null
  redirect?: string
  title?: string
  group?: string
  soon?: boolean
}

export const featuresRoutes = <RouteRecord[]>[
  { path: '/floatingui-options', component: FloatinguiOptions, title: 'Floating UI options' },
  { path: '/transition', component: Transition },
  { path: '/arrow', component: Arrow },
  { path: '/adaptive-width', component: AdaptiveWidth },
  { path: '/portal', component: Portal },
  { path: '/static', component: Static },
  { path: '/high-order-component', component: HighOrderComponent, title: 'High-order component' },
]

export const componentsRoutes = <RouteRecord[]>[
  { path: '/menu', component: Menu },
  { path: '/listbox', component: Listbox },
  { path: '/combobox', component: Combobox },
  { path: '/dialog', component: Dialog },
  { path: '/popover', component: Popover },
  { path: '/virtual-element', component: VirtualElement },
]

export const routes = <RouteRecord[]>[
  { path: '/', redirect: '/floatingui-options' },
  ...featuresRoutes.map(route => ({ ...route, group: 'features' })),
  ...componentsRoutes.map(route => ({ ...route, group: 'components' })),
]
