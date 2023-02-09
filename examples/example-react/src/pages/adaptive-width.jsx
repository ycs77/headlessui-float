import { Fragment, useState } from 'react'
import { Listbox } from '@headlessui/react'
import { Float } from '@headlessui-float/react'
import Block from '@/components/Block'
import HeroiconsOutlineCheck from '~icons/heroicons-outline/check'
import HeroiconsOutlineSelector from '~icons/heroicons-outline/selector'

const people = [
  { id: 1, name: 'Durward Reynolds', unavailable: false },
  { id: 2, name: 'Kenton Towne', unavailable: false },
  { id: 3, name: 'Therese Wunsch', unavailable: false },
  { id: 4, name: 'Benedict Kessler', unavailable: true },
  { id: 5, name: 'Katelyn Rohan', unavailable: false },
]

export default function ExampleAdaptiveWidth() {
  const [selected, setSelected] = useState(people[0])

  return (
    <>
      <Block title="Adaptive width using CSS" contentClass="block-adaptive-width-css h-[300px] p-4">
        <Listbox value={selected} onChange={setSelected}>
          <Float
            as="div"
            className="relative"
            placement="bottom"
            offset={4}
            floatingAs={Fragment}
          >
            <Listbox.Button className="relative w-full bg-white pl-3.5 pr-10 py-2 text-left text-amber-500 text-sm leading-5 border border-gray-200 rounded-lg shadow-md">
              {selected.name}
              <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <HeroiconsOutlineSelector className="w-5 h-5 text-gray-400" aria-hidden="true" />
              </span>
            </Listbox.Button>

            <Listbox.Options className="w-full bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden focus:outline-none">
              {people.map(person => (
                <Listbox.Option
                  key={person.id}
                  className={({ active }) =>
                    `relative block w-full pl-10 pr-3 py-2 text-left text-gray-600 text-sm cursor-default ${
                      active ? 'bg-amber-100 text-amber-700' : ''
                    } ${person.unavailable ? 'text-gray-300' : ''}`
                  }
                  value={person}
                  disabled={person.unavailable}
                >
                  {({ selected }) => (
                    <>
                      <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                        { person.name }
                      </span>
                      {selected && (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                          <HeroiconsOutlineCheck className="w-5 h-5" aria-hidden="true" />
                        </span>
                      )}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Float>
        </Listbox>
      </Block>

      <Block title="Adaptive width using JS" contentClass="block-adaptive-width-js h-[300px] p-4">
        <Listbox value={selected} onChange={setSelected}>
          <Float
            as="div"
            placement="bottom"
            offset={4}
            floatingAs={Fragment}
            adaptiveWidth
            portal
          >
            <Listbox.Button className="relative w-full bg-white pl-3.5 pr-10 py-2 text-left text-amber-500 text-sm leading-5 border border-gray-200 rounded-lg shadow-md">
              {selected.name}
              <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <HeroiconsOutlineSelector className="w-5 h-5 text-gray-400" aria-hidden="true" />
              </span>
            </Listbox.Button>

            <Listbox.Options className="bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden focus:outline-none">
              {people.map(person => (
                <Listbox.Option
                  key={person.id}
                  className={({ active }) =>
                    `relative block w-full pl-10 pr-3 py-2 text-left text-gray-600 text-sm cursor-default ${
                      active ? 'bg-amber-100 text-amber-700' : ''
                    } ${person.unavailable ? 'text-gray-300' : ''}`
                  }
                  value={person}
                  disabled={person.unavailable}
                >
                  {({ selected }) => (
                    <>
                      <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                        { person.name }
                      </span>
                      {selected && (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                          <HeroiconsOutlineCheck className="w-5 h-5" aria-hidden="true" />
                        </span>
                      )}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Float>
        </Listbox>
      </Block>
    </>
  )
}
