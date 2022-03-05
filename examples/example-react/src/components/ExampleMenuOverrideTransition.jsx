import { Menu } from '@headlessui/react'
import HighOrderFloat from '@/components/HighOrderFloat'
import Block from '@/components/Block'

export default function ExampleMenuOverrideTransition() {
  return (
    <Block title="Menu (Dropdown) override transition class" titleClass="text-indigo-400">
      <Menu>
        <HighOrderFloat
          placement="bottom-end"
          enter="transition duration-100 ease-out"
          enterFrom="scale-50 opacity-0"
          enterTo="scale-100 opacity-100"
          leave="transition duration-75 ease-in"
          leaveFrom="scale-100 opacity-100"
          leaveTo="scale-50 opacity-0"
        >
          <Menu.Button className="flex justify-center items-center px-5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-500 text-sm rounded-md">
            Options
          </Menu.Button>

          <Menu.Items
            static
            className="w-48 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden focus:outline-none"
          >
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
          </Menu.Items>
        </HighOrderFloat>
      </Menu>
    </Block>
  )
}
