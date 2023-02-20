import { Fragment, useState } from 'react'
import { Listbox } from '@headlessui/react'
import { Float } from '@headlessui-float/react'
import Block from '@/components/Block'
import HeroiconsCheck20Solid from '~icons/heroicons/check-20-solid'
import HeroiconsChevronUpDown20Solid from '~icons/heroicons/chevron-up-down-20-solid'

const people = [
  { id: 1, name: 'Durward Reynolds' },
  { id: 2, name: 'Kenton Towne' },
  { id: 3, name: 'Therese Wunsch' },
  { id: 4, name: 'Benedict Kessler' },
  { id: 5, name: 'Katelyn Rohan' },
]

export default function ExampleListbox() {
  const [selected, setSelected] = useState(people[0])

  return (
    <Block title="Floating Listbox" contentClass="h-[300px] p-4" data-testid="block-listbox">
      <Listbox value={selected} onChange={setSelected}>
        <Float
          as="div"
          className="relative w-56"
          placement="bottom"
          offset={4}
          flip={10}
          floatingAs={Fragment}
        >
          <Listbox.Button className="relative w-full bg-white pl-3.5 pr-10 py-2 text-left text-amber-500 text-sm leading-5 border border-gray-200 rounded-lg shadow-md">
            {selected.name}
            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <HeroiconsChevronUpDown20Solid className="w-5 h-5 text-gray-400" aria-hidden="true" />
            </span>
          </Listbox.Button>

          <Listbox.Options className="w-full bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden focus:outline-none">
            {people.map(person => (
              <Listbox.Option
                key={person.id}
                className={({ active }) =>
                  `relative block w-full pl-10 pr-3 py-2 text-left text-sm cursor-default ${
                    active ? 'bg-amber-100 text-amber-700' : 'text-gray-600'
                  }`
                }
                value={person}
              >
                {({ selected }) => (
                  <>
                    <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                      { person.name }
                    </span>
                    {selected && (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                        <HeroiconsCheck20Solid className="w-5 h-5" aria-hidden="true" />
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
  )
}
