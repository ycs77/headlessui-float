import type { ClassResolver } from './type'

export const tailwindcssRtlOriginSafelist = [
  'origin-bottom',
  'origin-top',
  'ltr:origin-right rtl:origin-left',
  'ltr:origin-left rtl:origin-right',
  'ltr:origin-bottom-left rtl:origin-bottom-right',
  'ltr:origin-bottom-right rtl:origin-bottom-left',
  'ltr:origin-top-left rtl:origin-top-right',
  'ltr:origin-top-right rtl:origin-top-left',
]

export const tailwindcssRtlOriginClassResolver: ClassResolver = placement => {
  switch (placement) {
    case 'top':
      return 'origin-bottom'
    case 'bottom':
      return 'origin-top'
    case 'left':
      return 'ltr:origin-right rtl:origin-left'
    case 'right':
      return 'ltr:origin-left rtl:origin-right'
    case 'top-start':
    case 'right-end':
      return 'ltr:origin-bottom-left rtl:origin-bottom-right'
    case 'top-end':
    case 'left-end':
      return 'ltr:origin-bottom-right rtl:origin-bottom-left'
    case 'right-start':
    case 'bottom-start':
      return 'ltr:origin-top-left rtl:origin-top-right'
    case 'left-start':
    case 'bottom-end':
      return 'ltr:origin-top-right rtl:origin-top-left'
    default:
      return 'origin-center'
  }
}
