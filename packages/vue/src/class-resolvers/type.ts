import type { Placement } from '@floating-ui/dom'

export type ClassResolver = (placement: Placement) => string

/** @deprecated Replace to using `ClassResolver` */
export type OriginClassResolver = ClassResolver
