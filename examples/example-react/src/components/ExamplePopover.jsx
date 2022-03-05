import { Popover } from '@headlessui/react'
import { Float } from 'headlessui-float-react'
import HighOrderFloat from '@/components/HighOrderFloat'
import Block from '@/components/Block'
import HeroiconsOutlineMenuAlt2 from '~icons/heroicons-outline/menu-alt-2'

export default function ExamplePopover() {
  return (
    <Block title="Popover" titleClass="text-rose-400">
      <Popover>
        {({ open }) => (
          <HighOrderFloat
            show={open}
            placement="bottom-start"
            offset={15}
            arrow
            enterFrom="opacity-0 -translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 -translate-y-1"
          >
            <Popover.Button className="w-8 h-8 flex justify-center items-center bg-rose-50 hover:bg-rose-100 text-rose-500 rounded">
              <HeroiconsOutlineMenuAlt2 className="w-5 h-5" aria-hidden="true" />
            </Popover.Button>

            <Popover.Panel className="w-[240px] h-[70px] bg-white border border-gray-200 rounded-md shadow-lg focus:outline-none">
              <Float.Arrow className="absolute bg-white w-5 h-5 rotate-45 border border-gray-200" />
              <div className="relative z-[1] h-full bg-white p-3 text-rose-500 rounded-md">
                Popover & arrow, content...
              </div>
            </Popover.Panel>
          </HighOrderFloat>
        )}
      </Popover>
    </Block>
  )
}
