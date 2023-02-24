import { type MutableRefObject, useEffect } from 'react'
import type { ReferenceType } from '@floating-ui/react'
import { env } from '../utils/env'

export function useReferenceElResizeObserver(
  enabled: boolean | undefined,
  reference: MutableRefObject<ReferenceType | null>,
  setReferenceElWidth: (width: number | null) => void,
) {
  useEffect(() => {
    if (enabled &&
        env.isClient &&
        typeof ResizeObserver !== 'undefined' &&
        reference.current &&
        reference.current instanceof Element
    ) {
      const observer = new ResizeObserver(([entry]) => {
        const width = entry.borderBoxSize.reduce((acc, { inlineSize }) => acc + inlineSize, 0)
        setReferenceElWidth(width)
      })
      observer.observe(reference.current)

      return () => {
        observer.disconnect()
        setReferenceElWidth(null)
      }
    }
  }, [])
}
