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
} from 'react'
import { createPortal } from 'react-dom'
import { useFloating, offset, flip, shift, arrow, autoPlacement, hide, autoUpdate, Placement, Strategy, Middleware } from '@floating-ui/react-dom'
import { Transition } from '@headlessui/react'
import throttle from 'lodash.throttle'
import { OriginClassResolver } from './origin-class-resolvers'

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
    // @ts-ignore
    if (Error.captureStackTrace) Error.captureStackTrace(err, useFloatContext)
    throw err
  }
  return context
}

function FloatRoot(props: {
  open?: boolean,
  placement?: Placement,
  strategy?: Strategy,
  offset?: number,
  shift?: boolean | number,
  flip?: boolean,
  arrow?: boolean | number,
  autoPlacement?: boolean | object,
  hide?: boolean,
  autoUpdate?: boolean | object,
  zIndex?: number,
  transition?: boolean,
  enter?: string,
  enterFrom?: string,
  enterTo?: string,
  leave?: string,
  leaveFrom?: string,
  leaveTo?: string,
  portal?: boolean | string,
  placementClass?: string | OriginClassResolver,
  middleware?: Middleware[],
  onUpdate?: () => void,
  onShow?: () => void,
  onHide?: () => void,
  children: ReactElement[],
}) {
  const [middleware, setMiddleware] = useState<Middleware[]>()

  const arrowRef = useRef<HTMLElement>(null)

  const events = {
    update: props.onUpdate || (() => {}),
    show: props.onShow || (() => {}),
    hide: props.onHide || (() => {}),
  }

  const { x, y, placement, strategy, reference, floating, update, refs, middlewareData } = useFloating({
    placement: props.placement || 'bottom-start',
    strategy: props.strategy,
    middleware,
  })

  function buildMiddleware() {
    const middleware = []
    if (typeof props.offset === 'number') {
      middleware.push(offset(props.offset))
    }
    if (props.shift !== false) {
      middleware.push(shift({
        padding: props.shift === true || props.shift === undefined ? 6 : props.shift,
      }))
    }
    if (props.flip) {
      middleware.push(flip())
    }
    if (props.arrow === true || typeof props.arrow === 'number') {
      middleware.push(arrow({
        element: arrowRef,
        padding: props.arrow === true ? 0 : props.arrow,
      }))
    }
    if (props.autoPlacement) {
      middleware.push(autoPlacement(
        typeof props.autoPlacement === 'object'
          ? props.autoPlacement
          : undefined
      ))
    }
    if (props.hide) {
      middleware.push(hide())
    }
    return middleware.concat(props.middleware || [])
  }

  const arrowApi = {
    arrowRef,
    placement,
    x: middlewareData.arrow?.x,
    y: middlewareData.arrow?.y,
  } as ArrowState

  useEffect(() => {
    setMiddleware(buildMiddleware())
  }, [])

  useEffect(() => {
    if (refs.reference.current &&
        refs.floating.current &&
        props.autoUpdate !== false
    ) {
      return autoUpdate(
        refs.reference.current,
        refs.floating.current,
        throttle(update, 16),
        typeof props.autoUpdate === 'object'
          ? props.autoUpdate
          : undefined
      )
    }
  }, [refs.reference, refs.floating, update])

  const [ReferenceNode, FloatingNode] = props.children

  if (!isValidElement(ReferenceNode)) {
    return
  }

  const placementClassValue = useMemo(() => {
    return typeof props.placementClass === 'function'
      ? props.placementClass(placement)
      : props.placementClass
  }, [props.placementClass])

  const transitionProps = {
    show: props.open,
    enter: props.transition ? `${props.enter || ''} ${placementClassValue || ''}` : '',
    enterFrom: props.transition ? `${props.enterFrom || ''}` : '',
    enterTo: props.transition ? `${props.enterTo || ''}` : '',
    leave: props.transition ? `${props.leave || ''} ${placementClassValue || ''}` : '',
    leaveFrom: props.transition ? `${props.leaveFrom || ''}` : '',
    leaveTo: props.transition ? `${props.leaveTo || ''}` : '',
    beforeEnter: () => events.show(),
    afterLeave: () => events.hide(),
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
          <div ref={floating} style={{
            position: strategy,
            zIndex: props.zIndex || 9999,
            top: y || 0,
            left: x || 0,
          }}>
            <Transition as={Fragment} {...transitionProps}>
              <FloatingNode.type {...FloatingNode.props} />
            </Transition>
          </div>
        )}
      </ArrowContext.Provider>
    </>
  )
}

function Arrow(props: { children: any }) {
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
    [staticSide]: '-4px',
  }

  const applyProps = (props: { [key: string]: any }) => {
    const nodeProps = { ...props }
    delete nodeProps.children
    return nodeProps
  }

  const [ArrowNode] = Array.isArray(props.children) ? props.children : [props.children]
  return ArrowNode
    ? (<ArrowNode.type {...applyProps(props)} ref={arrowRef} style={style} />)
    : (<div {...applyProps(props)} ref={arrowRef as RefObject<HTMLDivElement>} style={style} />)
}

export const Float = Object.assign(FloatRoot, { Arrow })
