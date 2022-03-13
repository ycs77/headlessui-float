import { useState } from 'react'
import { Float } from 'headlessui-float-react'
import Block from '@/components/Block'
import HeroiconsOutlineChevronRight from '~icons/heroicons-outline/chevron-right'

export default function ExampleNestedMenu() {
  const [openMapping, setOpenMapping] = useState({})
  const menuEnter = key => {
    setOpenMapping(state => ({ ...state, [key]: true }))
  }
  const menuLeave = key => {
    setOpenMapping(state => ({ ...state, [key]: false }))
  }

  return (
    <Block title="Nested Menu (Dropdown) with pure HTML" titleClass="text-indigo-400">
      <Float show={openMapping['m0'] || false} placement="bottom-start">
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
              show={openMapping['m1'] || false}
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
                <HeroiconsOutlineChevronRight className="absolute top-2 right-2 w-4 h-4" />
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
                    show={openMapping['m2'] || false}
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
                      <HeroiconsOutlineChevronRight className="absolute top-2 right-2 w-4 h-4" />
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
