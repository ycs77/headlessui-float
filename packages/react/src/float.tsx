import {
  Fragment,
  createContext,
  forwardRef,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { Dispatch, ElementType, MutableRefObject, ReactElement, RefObject, SetStateAction } from 'react'
import { Portal, Transition } from '@headlessui/react'
import { arrow, autoPlacement, autoUpdate, flip, hide, offset, shift, useFloating } from '@floating-ui/react-dom'
import type { VirtualElement } from '@floating-ui/core'
import type { DetectOverflowOptions, Middleware, Placement, Strategy } from '@floating-ui/dom'
import type { Options as OffsetOptions } from '@floating-ui/core/src/middleware/offset'
import type { Options as ShiftOptions } from '@floating-ui/core/src/middleware/shift'
import type { Options as FlipOptions } from '@floating-ui/core/src/middleware/flip'
import type { Options as AutoPlacementOptions } from '@floating-ui/core/src/middleware/autoPlacement'
import type { Options as HideOptions } from '@floating-ui/core/src/middleware/hide'
import type { Options as AutoUpdateOptions } from '@floating-ui/dom/src/autoUpdate'
import { env } from './utils/env'
import { type OriginClassResolver, tailwindcssOriginClassResolver } from './origin-class-resolvers'

interface ReferenceState {
  referenceRef: (node: HTMLElement) => void
}

interface FloatingState {
  floatingRef: (node: HTMLElement) => void
  props: FloatProps
  mounted: MutableRefObject<boolean>
  setShow: Dispatch<SetStateAction<boolean>>
  x: number | null
  y: number | null
  placement: Placement
  strategy: Strategy
  referenceElWidth: number | null
}

interface ArrowState {
  arrowRef: RefObject<HTMLElement>
  placement: Placement
  x: number | undefined
  y: number | undefined
}

const ReferenceContext = createContext<ReferenceState | null>(null)
ReferenceContext.displayName = 'ReferenceContext'
const FloatingContext = createContext<FloatingState | null>(null)
FloatingContext.displayName = 'FloatingContext'
const ArrowContext = createContext<ArrowState | null>(null)
ArrowContext.displayName = 'ArrowContext'

function useReferenceContext(component: string) {
  const context = useContext(ReferenceContext)
  if (context === null) {
    const err = new Error(`<${component} /> is missing a parent <Float /> component.`)
    if (Error.captureStackTrace) Error.captureStackTrace(err, useReferenceContext)
    throw err
  }
  return context
}

function useFloatingContext(component: string) {
  const context = useContext(FloatingContext)
  if (context === null) {
    const err = new Error(`<${component} /> is missing a parent <Float /> component.`)
    if (Error.captureStackTrace) Error.captureStackTrace(err, useFloatingContext)
    throw err
  }
  return context
}

function useArrowContext(component: string) {
  const context = useContext(ArrowContext)
  if (context === null) {
    const err = new Error(`<${component} /> is missing a parent <Float /> component.`)
    if (Error.captureStackTrace) Error.captureStackTrace(err, useArrowContext)
    throw err
  }
  return context
}

export interface FloatProps {
  as?: ElementType
  floatingAs?: ElementType
  show?: boolean
  placement?: Placement
  strategy?: Strategy
  offset?: OffsetOptions
  shift?: boolean | number | Partial<ShiftOptions & DetectOverflowOptions>
  flip?: boolean | number | Partial<FlipOptions & DetectOverflowOptions>
  arrow?: boolean | number
  autoPlacement?: boolean | Partial<AutoPlacementOptions & DetectOverflowOptions>
  hide?: boolean | Partial<HideOptions & DetectOverflowOptions>
  autoUpdate?: boolean | Partial<AutoUpdateOptions>
  zIndex?: number | string
  enter?: string
  enterFrom?: string
  enterTo?: string
  leave?: string
  leaveFrom?: string
  leaveTo?: string
  originClass?: string | OriginClassResolver
  tailwindcssOriginClass?: boolean
  portal?: boolean
  transform?: boolean
  adaptiveWidth?: boolean
  composable?: boolean
  dialog?: boolean
  middleware?: Middleware[] | ((refs: {
    referenceEl: MutableRefObject<Element | VirtualElement | null>
    floatingEl: MutableRefObject<HTMLElement | null>
  }) => Middleware[])

  className?: string | undefined
  children: ReactElement[]

  onShow?: () => void
  onHide?: () => void
  onUpdate?: () => void
}

export function renderReferenceElement(
  ReferenceNode: ReactElement,
  componentProps: FloatReferenceProps & Required<Pick<FloatReferenceProps, 'as'>>,
  attrs: Record<string, any>,
  context: ReferenceState
) {
  const { referenceRef } = context

  const props = componentProps

  if (props.as === Fragment) {
    return (
      <ReferenceNode.type
        {...ReferenceNode.props}
        {...attrs}
        ref={referenceRef}
      />
    )
  }

  const Wrapper = props.as || 'div'
  return (
    <Wrapper {...attrs}>
      <ReferenceNode.type
        {...ReferenceNode.props}
        ref={referenceRef}
      />
    </Wrapper>
  )
}

export function renderFloatingElement(
  FloatingNode: ReactElement,
  componentProps: FloatContentProps & Required<Pick<FloatContentProps, 'as'>>,
  attrs: Record<string, any>,
  context: FloatingState
) {
  const { floatingRef, props: rootProps, mounted, setShow, x, y, placement, strategy, referenceElWidth } = context

  const props = {
    ...rootProps,
    ...componentProps,
  } as FloatProps & FloatContentProps

  const originClassValue = useMemo(() => {
    if (typeof props.originClass === 'function') {
      return props.originClass(placement)
    } else if (typeof props.originClass === 'string') {
      return props.originClass
    } else if (props.tailwindcssOriginClass) {
      return tailwindcssOriginClassResolver(placement)
    }
    return ''
  }, [props.originClass, props.tailwindcssOriginClass])

  const transitionProps = {
    show: mounted.current ? props.show : false,
    enter: `${props.enter || ''} ${originClassValue}`,
    enterFrom: `${props.enterFrom || ''}`,
    enterTo: `${props.enterTo || ''}`,
    leave: `${props.leave || ''} ${originClassValue}`,
    leaveFrom: `${props.leaveFrom || ''}`,
    leaveTo: `${props.leaveTo || ''}`,
    beforeEnter: () => {
      setShow(true)
    },
    afterLeave: () => {
      setShow(false)
    },
  }

  const floatingProps = {
    style: {
      // If enable dialog mode, then set `transform` to false.
      ...((props.dialog ? false : (props.transform || props.transform === undefined)) ? {
        position: strategy,
        zIndex: props.zIndex || 9999,
        top: '0px',
        left: '0px',
        right: 'auto',
        bottom: 'auto',
        transform: `translate(${Math.round(x || 0)}px,${Math.round(y || 0)}px)`,
      } : {
        position: strategy,
        zIndex: props.zIndex || 9999,
        top: `${y || 0}px`,
        left: `${x || 0}px`,
      }),
      width: props.adaptiveWidth && typeof referenceElWidth === 'number'
        ? `${referenceElWidth}px`
        : undefined,
    },
  }

  function renderPortal(children: ReactElement) {
    if (props.portal) {
      return <Portal>{children}</Portal>
    }
    return children
  }

  function renderFloating(FloatingNode: ReactElement) {
    const nodeProps = {
      ...floatingProps,
      ...attrs,
      ref: floatingRef,
    }

    if (props.as === Fragment) {
      return (
        <FloatingNode.type
          {...FloatingNode.props}
          {...nodeProps}
        />
      )
    }

    const Wrapper = props.as || 'div'
    return (
      <Wrapper {...nodeProps}>
        <FloatingNode.type {...FloatingNode.props} />
      </Wrapper>
    )
  }

  function renderFloatingNode() {
    if (env.isServer) {
      if (mounted.current && props.show) {
        return <FloatingNode.type {...FloatingNode.props} />
      }
      return <Fragment />
    }

    if (props.transitionChild) {
      return (
        <Transition.Child as={Fragment} {...transitionProps}>
          <FloatingNode.type {...FloatingNode.props} />
        </Transition.Child>
      )
    }

    return (
      <Transition as={Fragment} {...transitionProps}>
        <FloatingNode.type {...FloatingNode.props} />
      </Transition>
    )
  }

  return renderPortal(
    renderFloating(
      renderFloatingNode()
    )
  )
}

const FloatRoot = forwardRef<ElementType, FloatProps>((props, ref) => {
  const mounted = useRef(false)
  const [ReferenceNode, FloatingNode] = props.children

  if (!isValidElement<any>(ReferenceNode)) {
    console.warn('<Float /> is missing a reference and floating element.')
    return <Fragment />
  }

  const [show, setShow] = useState(props.show !== undefined ? props.show : false)
  const [middleware, setMiddleware] = useState<Middleware[]>()

  const arrowRef = useRef<HTMLElement>(null)

  const events = {
    show: props.onShow || (() => {}),
    hide: props.onHide || (() => {}),
    update: props.onUpdate || (() => {}),
  }

  const { x, y, placement, strategy, reference, floating, update, refs, middlewareData } = useFloating<HTMLElement>({
    placement: props.placement || 'bottom-start',
    strategy: props.strategy,
    middleware,
  })

  const [referenceElWidth, setReferenceElWidth] = useState<number | null>(null)

  const updateFloating = useCallback(() => {
    update()
    events.update()
  }, [update])

  useEffect(() => {
    updateFloating()
  }, [props.placement, props.strategy, middleware])

  useEffect(() => {
    const _middleware = []
    if (typeof props.offset === 'number' ||
        typeof props.offset === 'object' ||
        typeof props.offset === 'function'
    ) {
      _middleware.push(offset(props.offset))
    }
    if (props.flip === true ||
        typeof props.flip === 'number' ||
        typeof props.flip === 'object'
    ) {
      _middleware.push(flip({
        padding: typeof props.flip === 'number' ? props.flip : undefined,
        ...(typeof props.flip === 'object' ? props.flip : {}),
      }))
    }
    if (props.shift === true ||
        typeof props.shift === 'number' ||
        typeof props.shift === 'object'
    ) {
      _middleware.push(shift({
        padding: typeof props.shift === 'number' ? props.shift : undefined,
        ...(typeof props.shift === 'object' ? props.shift : {}),
      }))
    }
    if (props.autoPlacement === true || typeof props.autoPlacement === 'object') {
      _middleware.push(autoPlacement(
        typeof props.autoPlacement === 'object'
          ? props.autoPlacement
          : undefined
      ))
    }
    if (props.arrow === true || typeof props.arrow === 'number') {
      _middleware.push(arrow({
        element: arrowRef,
        padding: props.arrow === true ? 0 : props.arrow,
      }))
    }
    _middleware.push(...(
      typeof props.middleware === 'function'
        ? props.middleware({
          referenceEl: refs.reference,
          floatingEl: refs.floating,
        })
        : props.middleware || []
    ))
    if (props.hide === true || typeof props.hide === 'object') {
      _middleware.push(hide(
        typeof props.hide === 'object' ? props.hide : undefined
      ))
    }
    setMiddleware(_middleware)
  }, [
    props.offset,
    props.shift,
    props.flip,
    props.arrow,
    props.autoPlacement,
    props.hide,
    props.middleware,
  ])

  function useAutoUpdate() {
    if (refs.reference.current &&
        refs.floating.current &&
        props.autoUpdate !== false
    ) {
      return autoUpdate(
        refs.reference.current,
        refs.floating.current,
        updateFloating,
        typeof props.autoUpdate === 'object'
          ? props.autoUpdate
          : undefined
      )
    }

    return () => {}
  }

  function useReferenceElResizeObserver() {
    if (props.adaptiveWidth &&
        env.isClient &&
        typeof ResizeObserver !== 'undefined' &&
        refs.reference.current
    ) {
      const observer = new ResizeObserver(([entry]) => {
        const width = entry.borderBoxSize.reduce((acc, { inlineSize }) => acc + inlineSize, 0)
        setReferenceElWidth(width)
      })
      observer.observe(refs.reference.current)

      return () => {
        observer.disconnect()
        setReferenceElWidth(null)
      }
    }

    return () => {}
  }

  useEffect(() => {
    mounted.current = true
    const cleanupResizeObserver = useReferenceElResizeObserver()

    return () => {
      cleanupResizeObserver()
    }
  }, [])

  useEffect(() => {
    if (refs.reference.current &&
        refs.floating.current &&
        show
    ) {
      const cleanup = useAutoUpdate()
      events.show()

      return () => {
        cleanup()
        events.hide()
      }
    }
  }, [show, reference, floating, update, refs])

  const referenceApi = {
    referenceRef: reference,
  } as ReferenceState

  const floatingApi = {
    floatingRef: floating,
    props,
    mounted,
    setShow,
    x,
    y,
    placement,
    strategy,
    referenceElWidth,
  } as FloatingState

  const arrowApi = {
    arrowRef,
    placement,
    x: middlewareData.arrow?.x,
    y: middlewareData.arrow?.y,
  } as ArrowState

  function renderWrapper(children: ReactElement | ReactElement[]) {
    if (props.as === Fragment || !props.as) {
      return <Fragment>{children}</Fragment>
    }

    const Wrapper = props.as || 'div'
    return (
      <Wrapper ref={ref} className={props.className}>
        {children}
      </Wrapper>
    )
  }

  // If enable dialog mode, then set `composable` to true.
  if (props.composable || props.dialog) {
    return renderWrapper(
      <ReferenceContext.Provider key="FloatingNode" value={referenceApi}>
        <FloatingContext.Provider value={floatingApi}>
          <ArrowContext.Provider value={arrowApi}>
            {props.children}
          </ArrowContext.Provider>
        </FloatingContext.Provider>
      </ReferenceContext.Provider>
    )
  }

  const referenceElement = renderReferenceElement(
    ReferenceNode,
    { as: Fragment },
    { key: 'ReferenceNode' },
    referenceApi
  )

  const floatingElement = renderFloatingElement(
    FloatingNode,
    { as: props.floatingAs || 'div' },
    {},
    floatingApi
  )

  return renderWrapper([
    referenceElement,
    <ArrowContext.Provider key="FloatingNode" value={arrowApi}>
      {floatingElement}
    </ArrowContext.Provider>,
  ])
})
FloatRoot.displayName = 'Float'

export interface FloatReferenceProps {
  as?: ElementType
  className?: string
  children?: ReactElement
}

function Reference(props: FloatReferenceProps) {
  if (!props.children) {
    return <Fragment />
  }

  const attrs = { ...props } as Record<string, any>
  for (const key of ['as', 'children']) {
    delete attrs[key]
  }

  const context = useReferenceContext('Float.Reference')

  return renderReferenceElement(
    props.children,
    { ...props, as: props.as || Fragment },
    attrs,
    context
  )
}

export interface FloatContentProps {
  as?: ElementType
  enter?: string
  enterFrom?: string
  enterTo?: string
  leave?: string
  leaveFrom?: string
  leaveTo?: string
  originClass?: string | OriginClassResolver
  tailwindcssOriginClass?: boolean
  transitionChild?: boolean
  className?: string
  children?: ReactElement
}

function Content(props: FloatContentProps) {
  if (!props.children) {
    return <Fragment />
  }

  const attrs = { ...props } as Record<string, any>
  for (const key of ['as', 'enter', 'enterFrom', 'enterTo', 'leave', 'leaveFrom', 'leaveTo', 'originClass', 'tailwindcssOriginClass', 'transitionChild', 'children']) {
    delete attrs[key]
  }

  const context = useFloatingContext('Float.Content')

  return renderFloatingElement(
    props.children,
    { ...props, as: props.as || 'div' },
    attrs,
    context
  )
}

export interface FloatArrowProps {
  as?: ElementType
  offset?: number
  className?: string | ((bag: FloatArrowRenderProp) => string)
  children?: ReactElement | ((slot: FloatArrowRenderProp) => ReactElement)
}

export interface FloatArrowRenderProp {
  placement: Placement
}

function Arrow(props: FloatArrowProps) {
  const { arrowRef, placement, x, y } = useArrowContext('Float.Arrow')

  const staticSide = {
    top: 'bottom',
    right: 'left',
    bottom: 'top',
    left: 'right',
  }[placement.split('-')[0]]!

  const style = {
    left: typeof x === 'number' ? `${x}px` : undefined,
    top: typeof y === 'number' ? `${y}px` : undefined,
    right: undefined,
    bottom: undefined,
    [staticSide]: `${(props.offset ?? 4) * -1}px`,
  }

  if (props.as === Fragment) {
    const slot = { placement }
    const ArrowNode = typeof props.children === 'function'
      ? props.children(slot)
      : props.children
    if (!ArrowNode || !isValidElement<any>(ArrowNode)) return
    return <ArrowNode.type {...ArrowNode.props} ref={arrowRef} style={style} />
  }

  const ArrowWrapper = props.as || 'div'
  return (
    <ArrowWrapper
      {...props}
      ref={arrowRef as RefObject<HTMLDivElement>}
      style={style}
    />
  )
}

export const Float = Object.assign(FloatRoot, { Reference, Content, Arrow })
