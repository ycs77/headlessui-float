import { useEffect, useLayoutEffect } from 'react'

// See: https://github.com/tailwindlabs/headlessui/blob/0162c57d88cfdc74209d6bdcac94d54078f97675/packages/%40headlessui-react/src/hooks/use-iso-morphic-effect.ts

export const useIsoMorphicEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect
