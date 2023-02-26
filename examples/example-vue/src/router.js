import { createRouter, createWebHistory } from 'vue-router'
import FloatinguiOptions from '@/pages/floatingui-options.vue'
import Transition from '@/pages/transition.vue'
import Arrow from '@/pages/arrow.vue'
import AdaptiveWidth from '@/pages/adaptive-width.vue'
import Portal from '@/pages/portal.vue'
import Static from '@/pages/static.vue'
import HighOrderComponent from '@/pages/high-order-component.vue'
import Menu from '@/pages/menu.vue'
import Listbox from '@/pages/listbox.vue'
import Combobox from '@/pages/combobox.vue'
import Dialog from '@/pages/dialog.vue'
import Popover from '@/pages/popover.vue'
import VirtualElement from '@/pages/virtual-element.vue'

export const featuresRoutes = [
  { path: '/floatingui-options', component: FloatinguiOptions, title: 'Floating UI options' },
  { path: '/transition', component: Transition },
  { path: '/arrow', component: Arrow },
  { path: '/adaptive-width', component: AdaptiveWidth },
  { path: '/portal', component: Portal },
  { path: '/static', component: Static },
  { path: '/high-order-component', component: HighOrderComponent, title: 'High-order component' },
]

export const componentsRoutes = [
  { path: '/menu', component: Menu },
  { path: '/listbox', component: Listbox },
  { path: '/combobox', component: Combobox },
  { path: '/dialog', component: Dialog },
  { path: '/popover', component: Popover },
  { path: '/virtual-element', component: VirtualElement },
]

export const routes = [
  { path: '/', redirect: '/floatingui-options' },
  ...featuresRoutes.map(route => ({ ...route, group: 'features' })),
  ...componentsRoutes.map(route => ({ ...route, group: 'components' })),
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
