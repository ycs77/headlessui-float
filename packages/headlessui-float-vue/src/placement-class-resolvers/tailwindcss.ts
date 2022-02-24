import { PlacementClassResolver } from '../types'

export const tailwindcssPlacementClassResolver: PlacementClassResolver = placement => {
  switch (placement) {
    case 'top':
      return 'origin-bottom'
    case 'bottom':
      return 'origin-top'
    case 'left':
      return 'origin-right'
    case 'right':
      return 'origin-left'
    case 'top-start':
    case 'right-end':
      return 'origin-bottom-left'
    case 'top-end':
    case 'left-end':
      return 'origin-bottom-right'
    case 'right-start':
    case 'bottom-start':
      return 'origin-top-left'
    case 'left-start':
    case 'bottom-end':
      return 'origin-top-right'
    default:
      return ''
  }
}
