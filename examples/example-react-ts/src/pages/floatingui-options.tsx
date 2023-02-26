import { useState } from 'react'
import { Menu } from '@headlessui/react'
import { Float } from '@headlessui-float/react'
import type { Placement } from '@floating-ui/core'
import Block from '@/components/Block'

export default function ExampleFloatinguiOptions() {
  return (
    <>
      <ExamplePlacement />
      <ExampleOffset />
      <ExampleShift />
      <ExampleFlip />
    </>
  )
}

function ExamplePlacement() {
  const [placement, setPlacement] = useState<Placement>('bottom-start')
  return (
    <Block
      title="Placement"
      contentClass="relative h-[320px] flex justify-center items-center border rounded"
      data-testid="block-placement"
      form={
        <div className="absolute top-0 right-0">
          <div className="flex items-center">
            <div className="mr-2">placement</div>
            <select
              className="pl-2 pr-1 py-1 border border-gray-300 rounded"
              value={placement}
              onChange={event => setPlacement(event.target.value as Placement)}
              data-testid="placement-select"
            >
              <option>top-start</option>
              <option>top</option>
              <option>top-end</option>
              <option>right-start</option>
              <option>right</option>
              <option>right-end</option>
              <option>bottom-start</option>
              <option>bottom</option>
              <option>bottom-end</option>
              <option>left-start</option>
              <option>left</option>
              <option>left-end</option>
            </select>
          </div>
        </div>
      }
    >
      <Menu>
        <Float show placement={placement} zIndex={99}>
          <Menu.Button className="flex justify-center items-center px-5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-500 text-sm rounded-md">
            Options
          </Menu.Button>

          <Menu.Items static className="w-48 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden focus:outline-none">
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
        </Float>
      </Menu>
    </Block>
  )
}

function ExampleOffset() {
  const [offset, setOffset] = useState(4)
  return (
    <Block
      title="Offset"
      contentClass="relative h-[320px] border rounded"
      data-testid="block-offset"
      form={
        <div className="absolute top-0 right-0">
          <div className="flex items-center">
            <div className="mr-2">offset</div>
            <input
              type="number"
              className="w-[100px] px-2 py-1 border border-gray-300 rounded"
              value={offset}
              onChange={event => setOffset(parseInt(event.target.value))}
              data-testid="offset-input"
            />
          </div>
        </div>
      }
    >
      <Menu>
        <Float show placement="bottom-start" offset={offset} zIndex={99}>
          <Menu.Button className="flex justify-center items-center mx-auto px-5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-500 text-sm rounded-md">
            Options
          </Menu.Button>

          <Menu.Items static className="w-48 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden focus:outline-none">
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
        </Float>
      </Menu>
    </Block>
  )
}

function ExampleShift() {
  const [shift, setShift] = useState(4)
  return (
    <Block
      title="Shift"
      contentClass="relative h-[320px] overflow-y-auto border rounded"
      data-testid="block-shift"
      form={
        <div className="absolute top-0 right-0">
          <div className="flex items-center">
            <div className="mr-2">shift</div>
            <input
              type="number"
              className="w-[100px] px-2 py-1 border border-gray-300 rounded"
              value={shift}
              onChange={event => setShift(parseInt(event.target.value))}
              data-testid="shift-input"
            />
          </div>
        </div>
      }
    >
      <div className="h-[800px] pt-[382px]">
        <Menu>
          <Float show placement="right" shift={shift} zIndex={99}>
            <Menu.Button className="flex justify-center items-center mx-auto px-5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-500 text-sm rounded-md">
              Options
            </Menu.Button>

            <Menu.Items static className="w-48 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden focus:outline-none">
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
          </Float>
        </Menu>
      </div>
    </Block>
  )
}

function ExampleFlip() {
  const [flip, setFlip] = useState(0)
  return (
    <Block
      title="Flip"
      contentClass="relative h-[320px] overflow-y-auto border rounded"
      data-testid="block-flip"
      form={
        <div className="absolute top-0 right-0">
          <div className="flex items-center">
            <div className="mr-2">flip</div>
            <input
              type="number"
              className="w-[100px] px-2 py-1 border border-gray-300 rounded"
              value={flip}
              onChange={event => setFlip(parseInt(event.target.value))}
              data-testid="flip-input"
            />
          </div>
        </div>
      }
    >
      <div className="h-[800px] pt-[382px]">
        <Menu>
          <Float show placement="bottom" flip={flip} zIndex={99}>
            <Menu.Button className="flex justify-center items-center mx-auto px-5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-500 text-sm rounded-md">
              Options
            </Menu.Button>

            <Menu.Items static className="w-48 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden focus:outline-none">
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
          </Float>
        </Menu>
      </div>
    </Block>
  )
}
