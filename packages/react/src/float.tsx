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
import type { ElementType, MutableRefObject, ReactElement, RefObject } from 'react'
import { createPortal } from 'react-dom'
import { Transition } from '@headlessui/react'
import { arrow, autoPlacement, autoUpdate, flip, hide, offset, shift, useFloating } from '@floating-ui/react-dom'
import type { VirtualElement } from '@floating-ui/core'
import type { DetectOverflowOptions, Middleware, Placement, Strategy } from '@floating-ui/dom'
import type { Options as OffsetOptions } from '@floating-ui/core/src/middleware/offset'
import type { Options as ShiftOptions } from '@floating-ui/core/src/middleware/shift'
import type { Options as FlipOptions } from '@floating-ui/core/src/middleware/flip'
import type { Options as AutoPlacementOptions } from '@floating-ui/core/src/middleware/autoPlacement'
import type { Options as HideOptions } from '@floating-ui/core/src/middleware/hide'
import type { Options as AutoUpdateOptions } from '@floating-ui/dom/src/autoUpdate'
import throttle from 'lodash.throttle'
import { useId } from './hooks/use-id'
import { type OriginClassResolver, tailwindcssOriginClassResolver } from './origin-class-resolvers'

const referenceElResizeObserveCleanerMap = new Map<ReturnType<typeof useId>, (() => void)>()

interface ArrowState {
  arrowRef: RefObject<HTMLElement>
  placement: Placement
  x: number | null
  y: number | null
}

const ArrowContext = createContext<ArrowState | null>(null)
ArrowContext.displayName = 'ArrowContext'

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
  portal?: boolean | string
  transform?: boolean
  adaptiveWidth?: boolean
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

const FloatRoot = forwardRef<ElementType, FloatProps>((props, ref) => {
  const id = useId()

  const mounted = useRef(false)
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

  const [referenceElWidth, setReferenceElWidth] = useState<number | null>(null)

  const updateFloating = useCallback(() => {
    update()
    events.update()
  }, [update])

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
        throttle(updateFloating, 16),
        typeof props.autoUpdate === 'object'
          ? props.autoUpdate
          : undefined
      )
    }

    return () => {}
  }

  function startReferenceElResizeObserver() {
    if (props.adaptiveWidth &&
      typeof window !== 'undefined' &&
      'ResizeObserver' in window &&
      refs.reference.current &&
      !referenceElResizeObserveCleanerMap.get(id)
    ) {
      const observer = new ResizeObserver(([entry]) => {
        const width = entry.borderBoxSize.reduce((acc, { inlineSize }) => acc + inlineSize, 0)
        setReferenceElWidth(width)
      })
      observer.observe(refs.reference.current)
      referenceElResizeObserveCleanerMap.set(id, () => {
        observer.disconnect()
      })
    }
  }

  function clearReferenceElResizeObserver() {
    const disconnectResizeObserver = referenceElResizeObserveCleanerMap.get(id)
    if (disconnectResizeObserver) {
      disconnectResizeObserver()
      referenceElResizeObserveCleanerMap.delete(id)
    }
  }

  useEffect(() => {
    mounted.current = true
    startReferenceElResizeObserver()

    return () => {
      mounted.current = false
      clearReferenceElResizeObserver()
    }
  }, [])

  useEffect(() => {
    if (refs.reference.current && refs.floating.current && show) {
      const cleanup = useAutoUpdate()
      events.show()

      return () => {
        cleanup()
        events.hide()
      }
    }
  }, [show, reference, floating, update, refs])

  const arrowApi = {
    arrowRef,
    placement,
    x: middlewareData.arrow?.x ?? null,
    y: middlewareData.arrow?.y ?? null,
  } as ArrowState

  const [ReferenceNode, FloatingNode] = props.children

  if (!isValidElement<any>(ReferenceNode)) {
    return <Fragment />
  }

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
    ref: floating,
    style: {
      ...(props.transform || props.transform === undefined ? {
        position: strategy,
        zIndex: props.zIndex || 9999,
        top: 0,
        left: 0,
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

  function renderWrapper(children: ReactElement[]) {
    if (props.as === Fragment) {
      return <Fragment>{children}</Fragment>
    }

    const Wrapper = props.as || 'div'
    return (
      <Wrapper ref={ref} className={props.className}>
        {children}
      </Wrapper>
    )
  }

  function renderPortal(children: ReactElement) {
    if (mounted.current && props.portal) {
      const root = document.querySelector(props.portal === true ? 'body' : props.portal)
      if (root) {
        return createPortal(children, root)
      }
    }
    return children
  }

  function renderFloating(Children: ReactElement) {
    if (props.floatingAs === Fragment) {
      return <Children.type {...Children.props} {...floatingProps} />
    }

    const FloatingWrapper = props.floatingAs || 'div'
    return (
      <FloatingWrapper {...floatingProps}>
        <Children.type {...Children.props} />
      </FloatingWrapper>
    )
  }

  return renderWrapper([
    <ReferenceNode.type
      key="ReferenceNode"
      {...ReferenceNode.props}
      ref={reference}
    />,
    <ArrowContext.Provider
      key="FloatingNode"
      value={arrowApi}
    >
      {renderPortal(
        renderFloating(
          <Transition as={Fragment} {...transitionProps}>
            <FloatingNode.type {...FloatingNode.props} />
          </Transition>
        )
      )}
    </ArrowContext.Provider>,
  ])
})
FloatRoot.displayName = 'Float'

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
    left: typeof x === 'number' ? `${x}px` : '',
    top: typeof y === 'number' ? `${y}px` : '',
    right: '',
    bottom: '',
    [staticSide]: `${(props.offset ?? 4) * -1}px`,
  }

  if (props.as === Fragment) {
    const slot = { placement }
    const ArrowNode = typeof props.children === 'function'
      ? props.children(slot)
      : props.children
    if (!ArrowNode || !isValidElement<any>(ArrowNode)) {
      throw new Error('When the prop `as` of <Float.Arrow /> is <Fragment />, there must be contains 1 child element.')
    }
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

export const Float = Object.assign(FloatRoot, { Arrow })
