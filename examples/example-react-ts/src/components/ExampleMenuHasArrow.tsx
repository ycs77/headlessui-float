import { Menu } from '@headlessui/react'
import { Float } from '@headlessui-float/react'
import Block from '@/components/Block'

export default function ExampleMenuHasArrow() {
  return (
    <Block title="Menu (Dropdown) has Arrow" titleClass="text-indigo-400">
      <Menu>
        <Float placement="bottom-end" offset={12} flip arrow>
          <Menu.Button className="flex justify-center items-center px-5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-500 text-sm rounded-md">
            Options
          </Menu.Button>

          <Menu.Items className="w-48 bg-white border border-gray-200 rounded-md shadow-lg focus:outline-none">
            <Float.Arrow className="absolute bg-white w-5 h-5 rotate-45 border border-gray-200" />
            <div className="relative bg-white rounded-md overflow-hidden">
              <Menu.Item>
                {({ active }) => (
                  <button type="button" className={`block w-full px-4 py-1.5 text-left text-sm ${
                    active ? 'bg-indigo-500 text-white' : ''
                  }`}>
                    Account settings
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button type="button" className={`block w-full px-4 py-1.5 text-left text-sm ${
                    active ? 'bg-indigo-500 text-white' : ''
                  }`}>
                    Documentation
                  </button>
                )}
              </Menu.Item>
              <Menu.Item disabled>
                <span className="block w-full px-4 py-1.5 text-left text-sm opacity-50 cursor-default">
                  Invite a friend (coming soon!)
                </span>
              </Menu.Item>
            </div>
          </Menu.Items>
        </Float>
      </Menu>
    </Block>
  )
}
