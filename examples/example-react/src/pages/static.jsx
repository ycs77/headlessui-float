import { useRef, useState } from 'react'
import { Float } from '@headlessui-float/react'
import Block from '@/components/Block'
import HeroiconsChevronRight20Solid from '~icons/heroicons/chevron-right-20-solid'

function HoverMenu() {
  const delay = 150
  const [show, setShow] = useState(false)
  const timer = useRef(null)

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
  const keys = ['m0', 'm1', 'm2']

  const defaultMapping = {}
  for (const key of keys) {
    defaultMapping[key] = false
  }
  const [openMapping, setOpenMapping] = useState(defaultMapping)

  const menuEnter = key => {
    setOpenMapping(state => ({ ...state, [key]: true }))
  }
  const menuLeave = key => {
    setOpenMapping(state => ({ ...state, [key]: false }))
  }

  return (
    <Block title="Nested Menu" contentClass="h-[300px] p-4" data-testid="block-nested-menu">
      <Float show={openMapping.m0} placement="bottom-start">
        <button
          type="button"
          className="flex justify-center items-center px-5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-500 text-sm rounded-md"
          onMouseEnter={() => menuEnter('m0')}
          onMouseLeave={() => menuLeave('m0')}
        >
          Options
        </button>
        <ul
          className="w-48 bg-white border border-gray-200 shadow-lg focus:outline-none"
          onMouseEnter={() => menuEnter('m0')}
          onMouseLeave={() => menuLeave('m0')}
        >
          <li>
            <button
              type="button"
              className="block w-full px-4 py-1.5 hover:bg-indigo-500 hover:text-white text-left text-sm"
              onClick={() => menuLeave('m0')}
            >
              Account settings
            </button>
          </li>
          <li>
            <Float
              show={openMapping.m1}
              placement="right-start"
              flip={{ fallbackPlacements: ['right', 'left', 'bottom', 'top'] }}
              shift
            >
              <button
                type="button"
                className="relative block w-full px-4 py-1.5 hover:bg-indigo-500 hover:text-white text-left text-sm"
                onMouseEnter={() => menuEnter('m1')}
                onMouseLeave={() => menuLeave('m1')}
              >
                Documentation
                <HeroiconsChevronRight20Solid className="absolute top-2 right-2 w-4 h-4" />
              </button>
              <ul
                className="w-48 bg-white border border-gray-200 shadow-lg focus:outline-none"
                onMouseEnter={() => menuEnter('m1')}
                onMouseLeave={() => menuLeave('m1')}
              >
                <li>
                  <button
                    type="button"
                    className="block w-full px-4 py-1.5 hover:bg-indigo-500 hover:text-white text-left text-sm"
                    onClick={() => menuLeave('m1')}
                  >
                    Installation
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="block w-full px-4 py-1.5 hover:bg-indigo-500 hover:text-white text-left text-sm"
                    onClick={() => menuLeave('m1')}
                  >
                    Usage
                  </button>
                </li>
                <li>
                  <Float
                    show={openMapping.m2}
                    placement="right-start"
                    flip={{ fallbackPlacements: ['right', 'left', 'bottom', 'top'] }}
                    shift
                  >
                    <button
                      type="button"
                      className="relative block w-full px-4 py-1.5 hover:bg-indigo-500 hover:text-white text-left text-sm"
                      onMouseEnter={() => menuEnter('m2')}
                      onMouseLeave={() => menuLeave('m2')}
                    >
                      Options
                      <HeroiconsChevronRight20Solid className="absolute top-2 right-2 w-4 h-4" />
                    </button>
                    <ul
                      className="w-48 bg-white border border-gray-200 shadow-lg focus:outline-none"
                      onMouseEnter={() => menuEnter('m2')}
                      onMouseLeave={() => menuLeave('m2')}
                    >
                      <li>
                        <button
                          type="button"
                          className="block w-full px-4 py-1.5 hover:bg-indigo-500 hover:text-white text-left text-sm"
                          onClick={() => menuLeave('m2')}
                        >
                          Option 1
                        </button>
                      </li>
                      <li>
                        <button
                          type="button"
                          className="block w-full px-4 py-1.5 hover:bg-indigo-500 hover:text-white text-left text-sm"
                          onClick={() => menuLeave('m2')}
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
