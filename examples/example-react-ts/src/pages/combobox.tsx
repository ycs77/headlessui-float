import { Fragment, useState } from 'react'
import { Combobox } from '@headlessui/react'
import { Float } from '@headlessui-float/react'
import Block from '@/components/Block'
import HeroiconsCheck20Solid from '~icons/heroicons/check-20-solid'
import HeroiconsChevronUpDown20Solid from '~icons/heroicons/chevron-up-down-20-solid'

const people = [
  { id: 1, name: 'Wade Cooper' },
  { id: 2, name: 'Arlene Mccoy' },
  { id: 3, name: 'Devon Webb' },
  { id: 4, name: 'Tom Cook' },
  { id: 5, name: 'Tanya Fox' },
  { id: 6, name: 'Hellen Schmidt' },
]

export default function ExampleCombobox() {
  const [selected, setSelected] = useState(people[0])
  const [query, setQuery] = useState('')

  const filteredPeople =
    query === ''
      ? people
      : people.filter(person =>
        person.name
          .toLowerCase()
          .replace(/\s+/g, '')
          .includes(query.toLowerCase().replace(/\s+/g, ''))
      )

  return (
    <Block title="Floating Combobox" contentClass="h-[320px] p-4" data-testid="block-combobox">
      <Combobox value={selected} onChange={setSelected}>
        <Float
          as="div"
          className="relative w-64"
          placement="bottom-start"
          offset={4}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          floatingAs={Fragment}
          onHide={() => setQuery('')}
        >
          <div className="relative w-full text-left bg-white border border-gray-200 rounded-lg shadow-md cursor-default focus:outline-none sm:text-sm overflow-hidden">
            <Combobox.Input
              className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:outline-none focus:ring-0"
              displayValue={(person: any) => person?.name}
              onChange={event => setQuery(event.target.value)}
            />

            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <HeroiconsChevronUpDown20Solid className="w-5 h-5 text-gray-400" aria-hidden="true" />
            </Combobox.Button>
          </div>

          <Combobox.Options className="absolute w-full py-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredPeople.length === 0 && query !== '' ? (
              <div className="relative py-2 px-4 text-gray-700 cursor-default select-none">
                Nothing found.
              </div>
            ) : (
              filteredPeople.map(person => (
                <Combobox.Option
                  key={person.id}
                  className={({ active }) =>
                    `relative py-2 pl-10 pr-4 cursor-default select-none ${
                      active ? 'text-white bg-teal-600' : 'text-gray-900'
                    }`
                  }
                  value={person}
                >
                  {({ selected, active }) => (
                    <>
                      <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                        { person.name }
                      </span>
                      {selected && (
                        <span
                          className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                            active ? 'text-white' : 'text-teal-600'
                          }`}
                        >
                          <HeroiconsCheck20Solid className="w-5 h-5" aria-hidden="true" />
                        </span>
                      )}
                    </>
                  )}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </Float>
      </Combobox>
    </Block>
  )
}
