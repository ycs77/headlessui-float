import {
  createContext,
  useEffect,
  useLayoutEffect,
  useContext,
  useReducer,
  isValidElement,

  // types
  Dispatch,
} from 'react'
import { useFloating, flip, autoUpdate, Placement, Strategy } from '@floating-ui/react-dom'
import { VirtualElement } from '@floating-ui/core'
import { Transition } from '@headlessui/react'
import throttle from 'lodash.throttle'
import { match } from './utils/match'

interface FloatState {
  open: boolean
  referenceRef: (node: Element | VirtualElement | null) => void
  floatingRef: (node: HTMLElement | null) => void
  floatingX: number | null
  floatingY: number | null
  placement: Placement
  strategy: Strategy
//   middleware: Ref<Middleware[]>
//   transition: boolean
//   enter?: string
//   enterFrom?: string
//   enterTo?: string
//   leave?: string
//   leaveFrom?: string
//   leaveTo?: string
//   originClass?: string
//   teleport: boolean | string
//   placementClassResolver: PlacementClassResolver
}

enum ActionTypes {
  UpdateFloatContent,
  ShowFloatContent,
  HideFloatContent,
}

type Actions =
  | { type: ActionTypes.UpdateFloatContent, x: number | null, y: number | null }
  | { type: ActionTypes.ShowFloatContent }
  | { type: ActionTypes.HideFloatContent }

const reducers: {
  [P in ActionTypes]: (
    state: FloatState,
    action: Extract<Actions, { type: P }>
  ) => FloatState
} = {
  [ActionTypes.UpdateFloatContent](state, action) {
    state.floatingX = action.x
    state.floatingY = action.y
    return state
  },
  [ActionTypes.ShowFloatContent](state) {
    return state
  },
  [ActionTypes.HideFloatContent](state) {
    return state
  },
}

const FloatContext = createContext<[FloatState, Dispatch<Actions>] | null>(null)
FloatContext.displayName = 'FloatContext'

function useFloatContext(component: string) {
  let context = useContext(FloatContext)
  if (context === null) {
    let err = new Error(`<${component} /> is missing a parent <Menu /> component.`)
    // @ts-ignore
    if (Error.captureStackTrace) Error.captureStackTrace(err, useFloatContext)
    throw err
  }
  return context
}

function stateReducer(state: FloatState, action: Actions) {
  return match(action.type, reducers, state, action)
}

function FloatRoot(props: {
  open: boolean,
  placement: Placement,
  strategy: Strategy,
  update: () => void
  show: () => void
  hide: () => void
  children: any,
}) {
  const events = {
    update: props.update || (() => {}),
    show: props.show || (() => {}),
    hide: props.hide || (() => {}),
  }

  const { x, y, reference, floating, update, refs } = useFloating({
    placement: props.placement || 'bottom-start',
    strategy: props.strategy || 'absolute',
    // middleware: middleware,
  })

  const reducerBag = useReducer(stateReducer, {
    open: props.open,
    referenceRef: reference,
    floatingRef: floating,
    placement: props.placement || 'bottom-start',
    strategy: props.strategy || 'absolute',
  } as FloatState)
  const [{}, dispatch] = reducerBag

  let cleanAutoUpdate: (() => void) | undefined

  useEffect(() => {
    if (props.open) {
      dispatch({ type: ActionTypes.UpdateFloatContent, x, y })
      update()

      if (refs.reference.current && refs.floating.current && !cleanAutoUpdate) {
        cleanAutoUpdate = autoUpdate(
          refs.reference.current,
          refs.floating.current,
          throttle(update, 16)
        )
      }

      events.update()
      events.show()
    } else {
      if (cleanAutoUpdate) cleanAutoUpdate()

      events.hide()
    }
  }, [props.open, x, y])

  // hasFloatComponent...

  const [referenceNode, floatingNode] = Array.isArray(props.children) ? props.children : [props.children]

  return (
    <FloatContext.Provider value={reducerBag}>
      <Reference>{referenceNode}</Reference>
      <Content>{floatingNode}</Content>
    </FloatContext.Provider>
  )
}

function Reference(props: { children: any }) {
  const [state, dispatch] = useFloatContext('Float.Reference')

  const Child = isValidElement(props.children[0]) ? props.children[0] : props.children

  return (<Child.type {...Child.props} ref={state.referenceRef} />)
}

function Content(props: { children: any }) {
  const [state, dispatch] = useFloatContext('Float.Content')

  const Child = isValidElement(props.children[0]) ? props.children[0] : props.children

  return (
    // <Transition show={state.show}>
      <Child.type {...Child.props} ref={state.floatingRef} style={{
        position: state.strategy,
        top: state.floatingY || '',
        left: state.floatingX || '',
      }} />
    // </Transition>
  )
}

export const Float = Object.assign(FloatRoot, { Reference, Content })
