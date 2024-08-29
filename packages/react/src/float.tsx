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
import type { CSSProperties, Dispatch, ElementType, MutableRefObject, ReactElement, RefObject, SetStateAction } from 'react'
import { Portal, Transition } from '@headlessui/react'
import { type ExtendedRefs, useFloating } from '@floating-ui/react'
import type { AutoPlacementOptions, FlipOptions, HideOptions, OffsetOptions, ShiftOptions } from '@floating-ui/core'
import { autoUpdate } from '@floating-ui/dom'
import type { AutoUpdateOptions, DetectOverflowOptions, Middleware, Placement, Strategy, VirtualElement } from '@floating-ui/dom'
import { roundByDPR } from './utils/dpr'
import type { ClassResolver } from './class-resolvers'
import { useId } from './hooks/use-id'
import { useFloatingMiddlewareFromProps } from './hooks/use-floating-middleware-from-props'
import { useReferenceElResizeObserver } from './hooks/use-reference-el-resize-observer'
import { useOriginClass } from './hooks/use-origin-class'
import { useOutsideClick } from './hooks/use-outside-click'
import { useDocumentEvent } from './hooks/use-document-event'
import { getOwnerDocument } from './utils/owner'

interface ReferenceState {
  referenceRef: (node: HTMLElement) => void
  placement: Placement
}

interface FloatingState {
  floatingRef: (node: HTMLElement) => void
  props: Omit<FloatProps, 'children' | 'className'>
  mounted: MutableRefObject<boolean>
  setShow: Dispatch<SetStateAction<boolean>>
  referenceHidden: boolean | undefined
  escaped: boolean | undefined
  placement: Placement
  floatingStyles: CSSProperties
  referenceElWidth: number | null
}

interface ArrowState {
  arrowRef: RefObject<HTMLElement>
  placement: Placement
  x: number | undefined
  y: number | undefined
}

const showStateMap = new Map<ReturnType<typeof useId>, boolean>()

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
  hide?: boolean | Partial<HideOptions & DetectOverflowOptions> | Partial<HideOptions & DetectOverflowOptions>[]
  referenceHiddenClass?: string
  escapedClass?: string
  autoUpdate?: boolean | Partial<AutoUpdateOptions>
  zIndex?: number | string
  enter?: string
  enterFrom?: string
  enterTo?: string
  leave?: string
  leaveFrom?: string
  leaveTo?: string
  originClass?: string | ClassResolver
  tailwindcssOriginClass?: boolean
  portal?: boolean
  transform?: boolean
  adaptiveWidth?: boolean | {
    attribute?: string
  }
  composable?: boolean
  dialog?: boolean
  middleware?: Middleware[] | ((refs: {
    referenceEl: MutableRefObject<Element | VirtualElement | null>
    floatingEl: MutableRefObject<HTMLElement | null>
  }) => Middleware[])

  className?: string | ((bag: FloatReferenceRenderProp) => string)
  children: ReactElement[] | ((slot: FloatReferenceRenderProp) => ReactElement[])

  onShow?: () => void
  onHide?: () => void
  onUpdate?: () => void
}

export function renderReferenceElement(
  ReferenceNode: ReactElement,
  componentProps: FloatReferenceProps & Required<Pick<FloatReferenceProps, 'as'>>,
  { key, ...attrs }: Record<string, any>,
  context: ReferenceState
) {
  const { referenceRef } = context

  const props = componentProps

  if (props.as === Fragment) {
    return (
      <ReferenceNode.type
        key={key}
        {...ReferenceNode.props}
        {...attrs}
        ref={referenceRef}
      />
    )
  }

  const Wrapper = props.as || 'div'
  return (
    <Wrapper key={key} {...attrs} ref={referenceRef}>
      <ReferenceNode.type {...ReferenceNode.props} />
    </Wrapper>
  )
}

export type RenderFloatingElementProps =
  FloatContentProps &
  Required<Pick<FloatContentProps, 'as'>> &
  { show?: boolean | null }

export function renderFloatingElement(
  FloatingNode: ReactElement,
  componentProps: RenderFloatingElementProps,
  { key, ...attrs }: Record<string, any>,
  context: FloatingState
) {
  const { floatingRef, props: rootProps, mounted, setShow, referenceHidden, escaped, placement, floatingStyles, referenceElWidth } = context

  const props = {
    ...rootProps,
    ...componentProps,
  } as FloatProps & FloatContentProps

  const originClass = useOriginClass(props, placement)

  const transitionProps = {
    show: mounted.current ? props.show : false,
    unmount: FloatingNode.props.unmount === false ? false : undefined,
    enter: `${props.enter || ''} ${originClass}`,
    enterFrom: `${props.enterFrom || ''}`,
    enterTo: `${props.enterTo || ''}`,
    leave: `${props.leave || ''} ${originClass}`,
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
    className: [
      referenceHidden ? props.referenceHiddenClass : undefined,
      escaped ? props.escapedClass : undefined,
    ].filter(c => !!c).join(' '),

    style: {
      ...floatingStyles,
      zIndex: props.zIndex || 9999,
    } as Record<string, any>,
  }

  if (props.adaptiveWidth && typeof referenceElWidth === 'number') {
    const adaptiveWidthOptions = {
      attribute: 'width',
      ...typeof props.adaptiveWidth === 'object'
        ? props.adaptiveWidth
        : {},
    }

    floatingProps.style[adaptiveWidthOptions.attribute] = `${referenceElWidth}px`
  }

  function renderPortal(children: ReactElement) {
    if (props.portal) {
      if (mounted.current) {
        return <Portal>{children}</Portal>
      }
      return <Fragment />
    }
    return children
  }

  function renderFloating(FloatingNode: ReactElement) {
    const nodeProps = {
      ...floatingProps,
      ...attrs,
      ref: floatingRef,
    }

    if (FloatingNode.type === Fragment) {
      return <Fragment />
    }

    if (props.as === Fragment) {
      return (
        <FloatingNode.type
          key={key}
          {...FloatingNode.props}
          {...nodeProps}
        />
      )
    }

    const Wrapper = props.as || 'div'
    return (
      <Wrapper key={key} {...nodeProps}>
        <FloatingNode.type {...FloatingNode.props} />
      </Wrapper>
    )
  }

  function renderFloatingNode() {
    if (!mounted.current) {
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

function useFloat(
  [show, setShow]: [boolean, Dispatch<SetStateAction<boolean>>],
  props: Omit<FloatProps, 'children' | 'className'>
) {
  const id = useId()

  const mounted = useRef(false)

  const [middleware, setMiddleware] = useState<Middleware[]>()

  const [referenceHidden, setReferenceHidden] = useState<boolean | undefined>(undefined)
  const [escaped, setEscaped] = useState<boolean | undefined>(undefined)

  const arrowRef = useRef<HTMLElement>(null)

  const events = useMemo(() => ({
    show: props.onShow || (() => {}),
    hide: props.onHide || (() => {}),
    update: props.onUpdate || (() => {}),
  }), [props.onShow, props.onHide, props.onUpdate])

  const { placement, update, refs, floatingStyles, isPositioned, middlewareData } = useFloating<HTMLElement>({
    placement: props.placement || 'bottom-start',
    strategy: props.strategy,
    middleware,
    transform: props.dialog ? false : props.transform ?? false, // If enable dialog mode, then set `transform` to false.
  })

  const [referenceElWidth, setReferenceElWidth] = useState<number | null>(null)

  useEffect(() => {
    mounted.current = true
  }, [])

  useEffect(() => {
    if (show && !showStateMap.get(id)) {
      showStateMap.set(id, true)
      events.show()
    } else if (!show && showStateMap.get(id)) {
      showStateMap.delete(id)
      events.hide()
    }
  }, [show])

  const updateFloating = useCallback(() => {
    update()
    events.update()
  }, [update, events])

  useEffect(updateFloating, [props.placement, props.strategy, middleware])

  useFloatingMiddlewareFromProps(setMiddleware, refs, arrowRef, props)

  useEffect(() => {
    if (props.hide === true || typeof props.hide === 'object' || Array.isArray(props.hide)) {
      setReferenceHidden(middlewareData.hide?.referenceHidden || !isPositioned)
      setEscaped(middlewareData.hide?.escaped)
    }
  }, [middlewareData, props.hide, isPositioned])

  useReferenceElResizeObserver(!!props.adaptiveWidth, refs.reference, setReferenceElWidth)

  useEffect(() => {
    if (refs.reference.current &&
        refs.floating.current &&
        show
    ) {
      return props.autoUpdate !== false
        ? autoUpdate(
          refs.reference.current!,
          refs.floating.current!,
          updateFloating,
          typeof props.autoUpdate === 'object'
            ? props.autoUpdate
            : undefined
        )
        : () => {}
    }
  }, [show, updateFloating, refs])

  const needForRAF = useRef(true)

  useEffect(() => {
    // only watch on the reference element is virtual element.
    if (!(refs.reference.current instanceof Element) &&
        refs.reference.current &&
        refs.floating.current &&
        needForRAF.current
    ) {
      needForRAF.current = false
      updateFloating()
      window.requestAnimationFrame(() => {
        needForRAF.current = true
        updateFloating()
      })
    }
  }, [refs])

  const referenceApi: ReferenceState = {
    referenceRef: refs.setReference,
    placement,
  }

  const floatingApi: FloatingState = {
    floatingRef: refs.setFloating,
    props,
    mounted,
    setShow,
    referenceHidden,
    escaped,
    placement,
    floatingStyles,
    referenceElWidth,
  }

  const arrowApi: ArrowState = {
    arrowRef,
    placement,
    x: middlewareData.arrow?.x,
    y: middlewareData.arrow?.y,
  }

  return { referenceApi, floatingApi, arrowApi, placement, update: updateFloating, refs, middlewareData }
}

export interface FloatRenderProp {
  placement: Placement
}

const FloatRoot = forwardRef<ElementType, FloatProps>((props, ref) => {
  const [show, setShow] = useState(props.show ?? false)

  const {
    referenceApi,
    floatingApi,
    arrowApi,
    placement,
  } = useFloat([show, setShow], props)

  const slot: FloatRenderProp = { placement }

  const [ReferenceNode, FloatingNode] = typeof props.children === 'function'
    ? props.children(slot)
    : props.children

  if (!isValidElement<any>(ReferenceNode)) {
    console.warn('<Float /> is missing a reference and floating element.')
    return <Fragment />
  }

  function renderWrapper(children: ReactElement | ReactElement[]) {
    if (props.as === Fragment || !props.as) {
      return <Fragment>{children}</Fragment>
    }

    const Wrapper = props.as
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
            {typeof props.children === 'function'
              ? props.children(slot)
              : props.children}
          </ArrowContext.Provider>
        </FloatingContext.Provider>
      </ReferenceContext.Provider>
    )
  }

  const referenceElement = renderReferenceElement(
    ReferenceNode,
    { as: Fragment },
    { key: 'reference-node' },
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
    <ArrowContext.Provider key="floating-node" value={arrowApi}>
      {floatingElement}
    </ArrowContext.Provider>,
  ])
})
FloatRoot.displayName = 'Float'

export interface FloatReferenceProps extends Pick<FloatProps, 'as'> {
  className?: string | ((bag: FloatReferenceRenderProp) => string)
  children?: ReactElement | ((slot: FloatReferenceRenderProp) => ReactElement)
}

export interface FloatReferenceRenderProp {
  placement: Placement
}

function Reference(props: FloatReferenceProps) {
  if (!props.children) {
    return <Fragment />
  }

  const attrs = useMemo(() => {
    const { as, children, ...attrs } = props
    return attrs
  }, [props])

  const context = useReferenceContext('Float.Reference')
  const { placement } = context

  const slot: FloatReferenceRenderProp = { placement }

  return renderReferenceElement(
    typeof props.children === 'function'
      ? props.children(slot)
      : props.children,
    { ...props, as: props.as || Fragment },
    attrs,
    context
  )
}

export interface FloatContentProps extends Pick<FloatProps, 'as' | 'enter' | 'enterFrom' | 'enterTo' | 'leave' | 'leaveFrom' | 'leaveTo' | 'originClass' | 'tailwindcssOriginClass'> {
  transitionChild?: boolean
  className?: string | ((bag: FloatContentRenderProp) => string)
  children?: ReactElement | ((slot: FloatContentRenderProp) => ReactElement)
}

export interface FloatContentRenderProp {
  placement: Placement
}

function Content(props: FloatContentProps) {
  if (!props.children) {
    return <Fragment />
  }

  const attrs = useMemo(() => {
    const { as, enter, enterFrom, enterTo, leave, leaveFrom, leaveTo, originClass, tailwindcssOriginClass, transitionChild, children, ...attrs } = props
    return attrs
  }, [props])

  const context = useFloatingContext('Float.Content')
  const { placement } = context

  const slot: FloatContentRenderProp = { placement }

  return renderFloatingElement(
    typeof props.children === 'function'
      ? props.children(slot)
      : props.children,
    { ...props, as: props.as || 'div' },
    attrs,
    context
  )
}

export interface FloatArrowProps extends Pick<FloatProps, 'as'> {
  offset?: number
  className?: string | ((bag: FloatArrowRenderProp) => string)
  children?: ReactElement | ((slot: FloatArrowRenderProp) => ReactElement)
}

export interface FloatArrowRenderProp {
  placement: Placement
}

function Arrow(props: FloatArrowProps) {
  const { arrowRef, placement, x, y } = useArrowContext('Float.Arrow')

  const attrs = useMemo(() => {
    const { as, offset, children, ...attrs } = props
    return attrs
  }, [props])

  const staticSide = {
    top: 'bottom',
    right: 'left',
    bottom: 'top',
    left: 'right',
  }[placement.split('-')[0]]!

  const style = {
    left: arrowRef.current && typeof x === 'number'
      ? `${roundByDPR(arrowRef.current, x)}px`
      : undefined,
    top: arrowRef.current && typeof y === 'number'
      ? `${roundByDPR(arrowRef.current, y)}px`
      : undefined,
    right: undefined,
    bottom: undefined,
    [staticSide]: `${(props.offset ?? 4) * -1}px`,
    ...(attrs as Record<string, any>).style,
  }

  if (props.as === Fragment) {
    const slot: FloatArrowRenderProp = { placement }

    const ArrowNode = typeof props.children === 'function'
      ? props.children(slot)
      : props.children

    if (!ArrowNode || !isValidElement<any>(ArrowNode)) {
      return <Fragment />
    }

    return (
      <ArrowNode.type
        {...ArrowNode.props}
        ref={arrowRef}
        style={style}
      />
    )
  }

  const Wrapper = props.as || 'div'
  return (
    <Wrapper
      ref={arrowRef as RefObject<HTMLDivElement>}
      {...attrs}
      style={style}
    >
      {props.children}
    </Wrapper>
  )
}

export interface FloatVirtualProps extends Pick<FloatProps, 'as' | 'show' | 'placement' | 'strategy' | 'offset' | 'shift' | 'flip' | 'arrow' | 'autoPlacement' | 'autoUpdate' | 'zIndex' | 'enter' | 'enterFrom' | 'enterTo' | 'leave' | 'leaveFrom' | 'leaveTo' | 'originClass' | 'tailwindcssOriginClass' | 'portal' | 'transform' | 'middleware' | 'onShow' | 'onHide' | 'onUpdate'> {
  onInitial: (props: FloatVirtualInitialProps) => void
  className?: string
  children?: ReactElement | ((slot: FloatVirtualRenderProp) => ReactElement)
}

export interface FloatVirtualInitialProps {
  show: boolean
  setShow: Dispatch<SetStateAction<boolean>>
  placement: Placement
  refs: ExtendedRefs<HTMLElement>
}

export interface FloatVirtualRenderProp {
  placement: Placement
  close: () => void
}

function Virtual({ onInitial, children, ...props }: FloatVirtualProps) {
  const [show, setShow] = useState(props.show ?? false)

  const attrs = useMemo(() => {
    const { as, show, placement, strategy, offset, shift, flip, arrow, autoPlacement, autoUpdate, zIndex, enter, enterFrom, enterTo, leave, leaveFrom, leaveTo, originClass, tailwindcssOriginClass, portal, transform, middleware, onShow, onHide, onUpdate, ...attrs } = props
    return attrs
  }, [props])

  const {
    floatingApi,
    arrowApi,
    placement,
    refs,
  } = useFloat([show, setShow], props)

  useEffect(() => {
    setShow(props.show ?? false)
  }, [props.show])

  function close() {
    if (show)
      setShow(false)
  }

  onInitial({ show, setShow, placement, refs })

  if (!children) {
    return <Fragment />
  }

  const slot: FloatVirtualRenderProp = { placement, close }

  const floatingElement = renderFloatingElement(
    typeof children === 'function'
      ? children(slot)
      : children,
    {
      ...props,
      as: props.as || Fragment,
      show,
    },
    attrs,
    floatingApi
  )

  return (
    <ArrowContext.Provider value={arrowApi}>
      {floatingElement}
    </ArrowContext.Provider>
  )
}

export interface FloatContextMenuProps extends Omit<FloatVirtualProps, 'show' | 'portal' | 'onInitial'> {}

function ContextMenu(props: FloatContextMenuProps) {
  const [mounted, setMounted] = useState(false)

  function onInitial({ setShow, refs }: FloatVirtualInitialProps) {
    useDocumentEvent('contextmenu', e => {
      e.preventDefault()

      refs.setPositionReference({
        getBoundingClientRect() {
          return {
            width: 0,
            height: 0,
            x: e.clientX,
            y: e.clientY,
            top: e.clientY,
            left: e.clientX,
            right: e.clientX,
            bottom: e.clientY,
          }
        },
      })

      setShow(true)
    })

    useOutsideClick(refs.floating, () => {
      setShow(false)
    })
  }

  useEffect(() => {
    setMounted(true)

    return () => {
      setMounted(false)
    }
  }, [])

  if (!mounted) {
    return <Fragment />
  }

  return (
    <Virtual
      flip
      {...props}
      show={false}
      portal
      onInitial={onInitial}
    />
  )
}

export interface FloatCursorProps extends Omit<FloatVirtualProps, 'show' | 'portal' | 'onInitial'> {
  globalHideCursor?: boolean
}

function Cursor({ globalHideCursor, ...props }: FloatCursorProps) {
  const [mounted, setMounted] = useState(false)

  function onInitial({ setShow, refs }: FloatVirtualInitialProps) {
    function open() {
      setShow(true)
    }
    function close() {
      setShow(false)
    }

    function setPosition(position: { clientX: number, clientY: number }) {
      refs.setPositionReference({
        getBoundingClientRect() {
          return {
            width: 0,
            height: 0,
            x: position.clientX,
            y: position.clientY,
            top: position.clientY,
            left: position.clientX,
            right: position.clientX,
            bottom: position.clientY,
          }
        },
      })
    }

    function onMouseMove(e: MouseEvent) {
      open()
      setPosition(e)
    }

    function onTouchMove(e: TouchEvent) {
      open()
      setPosition(e.touches[0])
    }

    const ownerDocument = getOwnerDocument(refs.floating)
    if (!ownerDocument) return

    useEffect(() => {
      if ((globalHideCursor || globalHideCursor === undefined) &&
          !ownerDocument.getElementById('headlesui-float-cursor-style')
      ) {
        const style = ownerDocument.createElement('style')
        const head = ownerDocument.head || ownerDocument.getElementsByTagName('head')[0]
        head.appendChild(style)
        style.id = 'headlesui-float-cursor-style'
        style.appendChild(ownerDocument.createTextNode([
          '*, *::before, *::after {',
          '  cursor: none !important;',
          '}',
          '.headlesui-float-cursor-root {',
          '  pointer-events: none !important;',
          '}',
        ].join('\n')))

        return () => ownerDocument.getElementById('headlesui-float-cursor-style')?.remove()
      }
    }, [globalHideCursor])

    if (('ontouchstart' in window) || (navigator.maxTouchPoints > 0)) {
      useDocumentEvent('touchstart', onTouchMove)
      useDocumentEvent('touchend', close)
      useDocumentEvent('touchmove', onTouchMove)
    } else {
      useDocumentEvent('mouseenter', onMouseMove)
      useDocumentEvent('mouseleave', close)
      useDocumentEvent('mousemove', onMouseMove)
    }
  }

  useEffect(() => {
    setMounted(true)

    return () => {
      setMounted(false)
    }
  }, [])

  if (!mounted) {
    return <Fragment />
  }

  return (
    <Virtual
      {...props}
      portal
      className="headlesui-float-cursor-root"
      onInitial={onInitial}
    />
  )
}

export const Float = Object.assign(FloatRoot, { Reference, Content, Arrow, Virtual, ContextMenu, Cursor })
