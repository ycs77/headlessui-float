import {
  useState,
  useRef,
  useEffect,
  useMemo,
  useContext,
  createContext,
  ReactElement,
  isValidElement,
  Fragment,

  // types
  RefObject,
  MutableRefObject,
} from 'react'
import { createPortal } from 'react-dom'
import { useFloating, offset, flip, shift, arrow, autoPlacement, hide, autoUpdate } from '@floating-ui/react-dom'
import { Transition } from '@headlessui/react'
import throttle from 'lodash.throttle'
import { OriginClassResolver, tailwindcssOriginClassResolver } from './origin-class-resolvers'
import type { VirtualElement } from '@floating-ui/core'
import type { Options as OffsetOptions } from '@floating-ui/core/src/middleware/offset'
import type { Options as ShiftOptions } from '@floating-ui/core/src/middleware/shift'
import type { Options as FlipOptions } from '@floating-ui/core/src/middleware/flip'
import type { Options as AutoPlacementOptions } from '@floating-ui/core/src/middleware/autoPlacement'
import type { Options as HideOptions } from '@floating-ui/core/src/middleware/hide'
import type { Placement, Strategy, Middleware, DetectOverflowOptions } from '@floating-ui/dom'
import type { Options as AutoUpdateOptions } from '@floating-ui/dom/src/autoUpdate'

interface ArrowState {
  arrowRef: RefObject<HTMLElement>
  placement: Placement
  x: number | undefined
  y: number | undefined
}

const ArrowContext = createContext<ArrowState | null>(null)
ArrowContext.displayName = 'ArrowContext'

export function useArrowContext(component: string) {
  let context = useContext(ArrowContext)
  if (context === null) {
    let err = new Error(`<${component} /> is missing a parent <Float /> component.`)
    if (Error.captureStackTrace) Error.captureStackTrace(err, useArrowContext)
    throw err
  }
  return context
}

function FloatRoot(props: {
  show?: boolean,
  placement?: Placement,
  strategy?: Strategy,
  offset?: OffsetOptions,
  shift?: boolean | number | (ShiftOptions & DetectOverflowOptions),
  flip?: boolean | (FlipOptions & DetectOverflowOptions),
  arrow?: boolean | number,
  autoPlacement?: boolean | (AutoPlacementOptions & DetectOverflowOptions),
  hide?: boolean | (HideOptions & DetectOverflowOptions),
  autoUpdate?: boolean | AutoUpdateOptions,
  zIndex?: number,
  enter?: string,
  enterFrom?: string,
  enterTo?: string,
  leave?: string,
  leaveFrom?: string,
  leaveTo?: string,
  originClass?: string | OriginClassResolver,
  tailwindcssOriginClass?: boolean,
  portal?: boolean | string,
  // wrapFloating?: boolean,
  transform?: boolean,
  middleware?: Middleware[] | ((refs: {
    referenceEl: MutableRefObject<Element | VirtualElement | null>;
    floatingEl: MutableRefObject<HTMLElement | null>;
  }) => Middleware[]),
  onShow?: () => void,
  onHide?: () => void,
  onUpdate?: () => void,
  children: ReactElement[],
}) {
  const [middleware, setMiddleware] = useState<Middleware[]>()

  const arrowRef = useRef<HTMLElement>(null)

  const events = {
    show: props.onShow || (() => {}),
    hide: props.onHide || (() => {}),
    update: props.onUpdate || (() => {}),
  }

  const { x, y, placement, strategy, reference, floating, update, refs, middlewareData } = useFloating({
    placement: props.placement || 'bottom-start',
    strategy: props.strategy,
    middleware,
  })

  const updateFloating = () => {
    update()
    events.update()
  }

  useEffect(() => {
    const _middleware = []
    if (typeof props.offset === 'number' ||
        typeof props.offset === 'object' ||
        typeof props.offset === 'function'
    ) {
      _middleware.push(offset(props.offset))
    }
    if (props.flip === true || typeof props.flip === 'object') {
      _middleware.push(flip(
        typeof props.flip === 'object' ? props.flip : undefined
      ))
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

  useEffect(() => {
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
  }, [refs.reference, refs.floating, update])

  const arrowApi = {
    arrowRef,
    placement,
    x: middlewareData.arrow?.x,
    y: middlewareData.arrow?.y,
  } as ArrowState

  const [ReferenceNode, FloatingNode] = props.children

  if (!isValidElement(ReferenceNode)) {
    return
  }

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
    show: props.show,
    enter: `${props.enter || ''} ${originClassValue}`,
    enterFrom: `${props.enterFrom || ''}`,
    enterTo: `${props.enterTo || ''}`,
    leave: `${props.leave || ''} ${originClassValue}`,
    leaveFrom: `${props.leaveFrom || ''}`,
    leaveTo: `${props.leaveTo || ''}`,
    beforeEnter: () => events.show(),
    afterLeave: () => events.hide(),
  }

  const floatingProps = {
    ref: floating,
    style: props.transform || props.transform === undefined ? {
      position: strategy,
      zIndex: props.zIndex || 9999,
      top: 0,
      left: 0,
      right: 'auto',
      bottom: 'auto',
      transform: `translate(${Math.round(x || 0)}px,${Math.round(y || 0)}px)`,
    } :  {
      position: strategy,
      zIndex: props.zIndex,
      top: `${y || 0}px`,
      left: `${x || 0}px`,
    },
  }

  const wrapPortal = (children: ReactElement) => {
    if (props.portal) {
      const root = document?.querySelector(props.portal === true ? 'body' : props.portal)
      if (root) {
        return createPortal(children, root)
      }
    }
    return children
  }

  return (
    <>
      <ReferenceNode.type {...ReferenceNode.props} ref={reference} />
      <ArrowContext.Provider value={arrowApi}>
        {wrapPortal(
          <div {...floatingProps}>
            <Transition as={Fragment} {...transitionProps}>
              <FloatingNode.type {...FloatingNode.props} />
            </Transition>
          </div>
        )}
      </ArrowContext.Provider>
    </>
  )
}

function Arrow(props: {
  children: any,
  offset: number | string,
}) {
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
    [staticSide]: `${parseInt(String(props.offset)) * -1}px`,
  }

  const applyProps = (props: { [key: string]: any }) => {
    const nodeProps = { ...props }
    delete nodeProps.children
    return nodeProps
  }

  const slot = { placement }
  const resolvedChildren = typeof props.children === 'function'
    ? props.children(slot)
    : props.children

  const [ArrowNode] = Array.isArray(resolvedChildren) ? resolvedChildren : [resolvedChildren]
  if (ArrowNode) {
    return <ArrowNode.type {...ArrowNode.props} ref={arrowRef} style={style} />
  }
  return (
    <div
      {...applyProps(props)}
      ref={arrowRef as RefObject<HTMLDivElement>}
      style={style}
    />
  )
}

export const Float = Object.assign(FloatRoot, { Arrow })
