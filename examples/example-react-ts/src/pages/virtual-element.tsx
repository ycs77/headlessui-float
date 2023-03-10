import { Menu } from '@headlessui/react'
import { Float } from '@headlessui-float/react'
import Block from '@/components/Block'

export default function ExampleVirtualElement() {
  return (
    <>
      <ExampleContextMenu />
      <ExampleCustomCursor />
    </>
  )
}

function ExampleContextMenu() {
  return (
    <Block title="Context Menu" contentClass="h-[200px] p-4" data-testid="block-context-menu">
      <div className="h-full flex justify-center items-center text-gray-500 font-medium italic">
        Click right mouse button to show the Context Menu
      </div>

      <Float.ContextMenu
        enter="transition-opacity duration-200 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
      >
        {({ close }) => (
          <Menu>
            <Menu.Items static className="w-48 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden focus:outline-none">
              <Menu.Item>
                {({ active }) => (
                  <button type="button" className={`block w-full px-4 py-1.5 text-left text-sm ${
                    active ? 'bg-indigo-500 text-white' : ''
                  }`} onClick={close}>
                    Account settings
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button type="button" className={`block w-full px-4 py-1.5 text-left text-sm ${
                    active ? 'bg-indigo-500 text-white' : ''
                  }`} onClick={close}>
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
          </Menu>
        )}
      </Float.ContextMenu>
    </Block>
  )
}

function ExampleCustomCursor() {
  return (
    <Block title="Custom Cursor" contentClass="h-[200px] p-4" data-testid="block-cursor">
      <div className="h-full flex justify-center items-center text-gray-500 font-medium italic">
        Move cursor on screen
      </div>

      <Float.Cursor as="div">
        <div className="w-5 h-5 bg-emerald-500 rounded-full -translate-x-1/2 -translate-y-1/2" />
      </Float.Cursor>
    </Block>
  )
}