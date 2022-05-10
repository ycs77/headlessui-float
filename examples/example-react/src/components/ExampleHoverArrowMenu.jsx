import { useRef, useState } from 'react'
import { Float } from 'headlessui-float-react'
import Block from '@/components/Block'

export default function ExampleHoverArrowMenu() {
  const [show, setShow] = useState(false)
  const timer = useRef(null)

  const open = () => {
    if (timer.current !== null) {
      clearTimeout(timer.current)
      timer.current = null
    }
    setShow(true)
  }

  const close = () => {
    setShow(false)
  }

  const delayClose = () => {
    timer.current = setTimeout(() => {
      setShow(false)
    }, 150)
  }

  return (
    <Block title="Hover Menu (Dropdown) with Arrow" titleClass="text-indigo-400">
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
