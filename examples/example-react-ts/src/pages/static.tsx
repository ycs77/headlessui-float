import { useRef, useState } from 'react'
import { Float } from '@headlessui-float/react'
import Block from '@/components/Block'
import HeroiconsChevronRight20Solid from '~icons/heroicons/chevron-right-20-solid'

function HoverMenu() {
  const delay = 150
  const [show, setShow] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const open = () => {
    if (timer.current !== null) {
      clearTimeout(timer.current)
      timer.current = null
    }
    setShow(true)
  }

  const close = () => setShow(false)

  const delayClose = () => {
    timer.current = setTimeout(() => {
      setShow(false)
    }, delay)
  }

  return (
    <Block title="Hover menu" contentClass="h-[200px] p-4" data-testid="block-hover-menu">
      <Float
        show={show}
        placement="bottom-start"
        offset={12}
        arrow
      >
        <button
          type="button"
          className="flex justify-center items-center px-5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-500 text-sm rounded-md"
          onMouseEnter={open}
          onMouseLeave={delayClose}
        >
          Options
        </button>

        <div
          className="w-48 bg-white border border-gray-200 rounded-md shadow-lg"
          onMouseEnter={open}
          onMouseLeave={delayClose}
        >
          <Float.Arrow className="absolute bg-white w-5 h-5 rotate-45 border border-gray-200" />

          <ul className="relative bg-white rounded-md overflow-hidden">
            <li>
              <button
                type="button"
                className="block w-full px-4 py-2 hover:bg-indigo-500 hover:text-white text-left text-sm"
                onClick={close}
              >
                Profile
              </button>
            </li>
            <li>
              <button
                type="button"
                className="block w-full px-4 py-2 hover:bg-indigo-500 hover:text-white text-left text-sm"
                onClick={close}
              >
                Account settings
              </button>
            </li>
          </ul>
        </div>
      </Float>
    </Block>
  )
}

function NestedMenu() {
  interface Node {
    id: string
    open?: boolean
    parentId?: string
  }

  const nodes: Node[] = [
    { id: '0' },
    { id: '1', parentId: '0' },
    { id: '2', parentId: '1' },
  ]

  const defaultNestedStatus: Record<string, Node> = {}
  for (const node of nodes) {
    defaultNestedStatus[node.id] = {
      open: false,
      ...node,
    }
  }
  const [nestedStatus, setNestedStatus] = useState<Record<string, Node>>(defaultNestedStatus)

  function closeParent(nestedStatus: Record<string, Node>, node: Node): Record<string, Node> {
    if (node.parentId) {
      const parent = nestedStatus[node.parentId]
      if (parent.open) {
        parent.open = false
      }
      return closeParent(nestedStatus, parent)
    }

    return nestedStatus
  }

  const menuEnter = (id: string) => {
    setNestedStatus(state => {
      const newState = { ...state }
      newState[id].open = true
      return newState
    })
  }
  const menuLeave = (id: string) => {
    setNestedStatus(state => {
      const newState = { ...state }
      newState[id].open = false
      return newState
    })
  }
  const menuClick = (id: string) => {
    setNestedStatus(state => {
      let newState = { ...state }
      newState[id].open = false
      newState = closeParent(newState, newState[id])
      return newState
    })
  }

  return (
    <Block title="Nested Menu" contentClass="h-[300px] p-4" data-testid="block-nested-menu">
      <Float show={nestedStatus['0'].open} placement="bottom-start">
        <button
          type="button"
          className="flex justify-center items-center px-5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-500 text-sm rounded-md"
          onMouseEnter={() => menuEnter('0')}
          onMouseLeave={() => menuLeave('0')}
        >
          Options
        </button>
        <ul
          className="w-48 bg-white border border-gray-200 shadow-lg focus:outline-none"
          onMouseEnter={() => menuEnter('0')}
          onMouseLeave={() => menuLeave('0')}
        >
          <li>
            <button
              type="button"
              className="block w-full px-4 py-1.5 hover:bg-indigo-500 hover:text-white text-left text-sm"
              onClick={() => menuClick('0')}
            >
              Account settings
            </button>
          </li>
          <li>
            <Float
              show={nestedStatus['1'].open}
              placement="right-start"
              flip={{ fallbackPlacements: ['right', 'left', 'bottom', 'top'] }}
              shift
            >
              <button
                type="button"
                className="relative block w-full px-4 py-1.5 hover:bg-indigo-500 hover:text-white text-left text-sm"
                onMouseEnter={() => menuEnter('1')}
                onMouseLeave={() => menuLeave('1')}
              >
                Documentation
                <HeroiconsChevronRight20Solid className="absolute top-2 right-2 w-4 h-4" />
              </button>
              <ul
                className="w-32 bg-white border border-gray-200 shadow-lg focus:outline-none"
                onMouseEnter={() => menuEnter('1')}
                onMouseLeave={() => menuLeave('1')}
              >
                <li>
                  <button
                    type="button"
                    className="block w-full px-4 py-1.5 hover:bg-indigo-500 hover:text-white text-left text-sm"
                    onClick={() => menuClick('1')}
                  >
                    Installation
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="block w-full px-4 py-1.5 hover:bg-indigo-500 hover:text-white text-left text-sm"
                    onClick={() => menuClick('1')}
                  >
                    Usage
                  </button>
                </li>
                <li>
                  <Float
                    show={nestedStatus['2'].open}
                    placement="right-start"
                    flip={{ fallbackPlacements: ['right', 'left', 'bottom', 'top'] }}
                    shift
                  >
                    <button
                      type="button"
                      className="relative block w-full px-4 py-1.5 hover:bg-indigo-500 hover:text-white text-left text-sm"
                      onMouseEnter={() => menuEnter('2')}
                      onMouseLeave={() => menuLeave('2')}
                    >
                      Options
                      <HeroiconsChevronRight20Solid className="absolute top-2 right-2 w-4 h-4" />
                    </button>
                    <ul
                      className="w-32 bg-white border border-gray-200 shadow-lg focus:outline-none"
                      onMouseEnter={() => menuEnter('2')}
                      onMouseLeave={() => menuLeave('2')}
                    >
                      <li>
                        <button
                          type="button"
                          className="block w-full px-4 py-1.5 hover:bg-indigo-500 hover:text-white text-left text-sm"
                          onClick={() => menuClick('2')}
                        >
                          Option 1
                        </button>
                      </li>
                      <li>
                        <button
                          type="button"
                          className="block w-full px-4 py-1.5 hover:bg-indigo-500 hover:text-white text-left text-sm"
                          onClick={() => menuClick('2')}
                        >
                          Option 2
                        </button>
                      </li>
                    </ul>
                  </Float>
                </li>
              </ul>
            </Float>
          </li>
          <li>
            <button type="button" className="block w-full px-4 py-1.5 text-left text-sm opacity-50 cursor-default" disabled>
              Invite a friend (coming soon!)
            </button>
          </li>
        </ul>
      </Float>
    </Block>
  )
}

export default function ExampleStatic() {
  return (
    <>
      <HoverMenu />
      <NestedMenu />
    </>
  )
}
