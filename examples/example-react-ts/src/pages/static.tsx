import { useRef, useState } from 'react'
import { Float } from '@headlessui-float/react'
import Block from '@/components/Block'
import HoverMenu from '@/components/HoverMenu'

function useHoverMenu(delay = 150) {
  const [show, setShow] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  function open() {
    if (timer.current !== null) {
      clearTimeout(timer.current)
      timer.current = null
    }
    setShow(true)
  }

  function close() {
    setShow(false)
  }

  function delayClose() {
    timer.current = setTimeout(() => {
      setShow(false)
    }, delay)
  }

  return { show, setShow, timer, open, close, delayClose }
}

function HoverArrowMenu() {
  const { show, open, close, delayClose } = useHoverMenu()

  return (
    <Block title="Hover Arrow menu" contentClass="h-[200px] p-4" data-testid="block-hover-arrow-menu">
      <Float
        show={show}
        placement="bottom-start"
        offset={12}
        arrow={5}
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
  const items = [
    {
      id: '1',
      label: 'Account settings',
      children: [
        {
          id: '1-1',
          label: 'Installation',
        },
        {
          id: '1-2',
          label: 'Usage',
        },
        {
          id: '1-3',
          label: 'Options',
          children: [
            {
              id: '1-3-1',
              label: 'Option 1',
            },
            {
              id: '1-3-2',
              label: 'Option 2',
            },
          ],
        },
      ],
    },
    {
      id: '2',
      label: 'Documentation',
      children: [
        {
          id: '2-1',
          label: 'Installation',
        },
        {
          id: '2-2',
          label: 'Usage',
        },
        {
          id: '2-3',
          label: 'Options',
          children: [
            {
              id: '2-3-1',
              label: 'Option 1',
            },
            {
              id: '2-3-2',
              label: 'Option 2',
            },
          ],
        },
      ],
    },
    {
      id: '3',
      label: 'Invite a friend',
      onClick(close: () => void) {
        // eslint-disable-next-line no-console
        console.log('Click invite a friend!')
        close()
      },
    },
  ]

  const { show, open, close, delayClose } = useHoverMenu()

  return (
    <Block title="Nested Menu" contentClass="h-[300px] p-4" data-testid="block-nested-menu">
      <Float show={show} placement="bottom-start">
        <button
          type="button"
          className="flex justify-center items-center px-5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-500 text-sm rounded-md"
          onMouseEnter={open}
          onMouseLeave={delayClose}
        >
          Options
        </button>

        <HoverMenu
          items={items}
          onClose={close}
          onMouseEnter={open}
          onMouseLeave={delayClose}
        />
      </Float>
    </Block>
  )
}

export default function ExampleStatic() {
  return (
    <>
      <HoverArrowMenu />
      <NestedMenu />
    </>
  )
}
