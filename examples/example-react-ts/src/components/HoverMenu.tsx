import { forwardRef, useRef, useState } from 'react'
import { Float } from '@headlessui-float/react'
import HeroiconsChevronRight20Solid from '~icons/heroicons/chevron-right-20-solid'

interface HoverMenuProps {
  items: {
    id: string
    label: string
    onClick?: (close: () => void) => void
    children?: any[]
  }[]
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  onClose?: () => void
}

const HoverMenu = forwardRef<HTMLUListElement, HoverMenuProps>((props, ref) => {
  const onMouseEnter = props.onMouseEnter ?? (() => {})
  const onMouseLeave = props.onMouseLeave ?? (() => {})
  const onClose = props.onClose ?? (() => {})

  const defaultStatus: Record<string, boolean> = {}
  for (const item of props.items) {
    defaultStatus[item.id] = false
  }
  const [status, setStatus] = useState<Record<string, boolean>>(defaultStatus)

  const delay = 1200
  const currentId = useRef<string | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  function open(id: string) {
    if (currentId.current !== null &&
        currentId.current !== id) {
      close(currentId.current)
    }

    if (timer.current !== null) {
      clearTimeout(timer.current)
      timer.current = null
    }

    currentId.current = id

    setStatus(state => {
      const newState = { ...state }
      newState[id] = true
      return newState
    })
  }

  function close(id: string) {
    currentId.current = null

    setStatus(state => {
      const newState = { ...state }
      newState[id] = false
      return newState
    })
  }

  function delayClose(id: string) {
    timer.current = setTimeout(() => {
      close(id)
    }, delay)
  }

  return (
    <ul
      ref={ref}
      className="w-48 bg-white border border-gray-200 shadow-lg focus:outline-none"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {props.items.map(item => (
        <li key={item.id}>
          {!item.children ? (
            <button
              type="button"
              className="relative block w-full px-4 py-1.5 hover:bg-indigo-500 hover:text-white text-left text-sm"
              onClick={() => item.onClick?.(() => onClose()) ?? onClose()}
            >
              {item.label}
            </button>
          ) : (
            <Float
              show={status[item.id]}
              placement="right-start"
              flip={{ fallbackPlacements: ['right', 'left', 'bottom', 'top'] }}
              shift
            >
              <button
                type="button"
                className="relative block w-full px-4 py-1.5 hover:bg-indigo-500 hover:text-white text-left text-sm"
                onMouseEnter={() => open(item.id)}
                onMouseLeave={() => delayClose(item.id)}
              >
                {item.label}
                <HeroiconsChevronRight20Solid className="absolute top-2 right-2 w-4 h-4" />
              </button>

              <div>
                <HoverMenu
                  items={item.children}
                  onMouseEnter={() => open(item.id)}
                  onMouseLeave={() => delayClose(item.id)}
                  onClose={onClose}
                />
              </div>
            </Float>
          )}
        </li>
      ))}
    </ul>
  )
})
HoverMenu.displayName = 'HoverMenu'

export default HoverMenu
