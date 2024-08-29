import { type Float, createHighOrderFloatComponent } from '@headlessui-float/vue'

const HighOrderFloat: typeof Float = createHighOrderFloatComponent({
  offset: 8,
  flip: true,
  shift: 6,
  portal: true,
  enter: 'transition duration-200 ease-out',
  enterFrom: 'scale-95 opacity-0',
  enterTo: 'scale-100 opacity-100',
  leave: 'transition duration-150 ease-in',
  leaveFrom: 'scale-100 opacity-100',
  leaveTo: 'scale-95 opacity-0',
  tailwindcssOriginClass: true,
})

export default HighOrderFloat
