<template>
  <h1 class="mt-4 text-center text-gray-800 text-2xl font-bold">
    Headless UI Float - Vue Example
  </h1>

  <div class="p-6 grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">

    <Block title="Menu (Dropdown) with original Float" title-class="text-indigo-400">
      <Menu>
        <Float placement="bottom-start" :offset="4">
          <FloatReference>
            <MenuButton class="flex justify-center items-center px-5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-500 text-sm rounded-md">
              Options
            </MenuButton>
          </FloatReference>

          <FloatContent>
            <MenuItems class="w-48 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden focus:outline-none">
              <MenuItem v-slot="{ active }">
                <button type="button" class="block w-full px-4 py-1.5 text-left text-sm" :class="{ 'bg-indigo-500 text-white': active }">
                  Account settings
                </button>
              </MenuItem>
              <MenuItem v-slot="{ active }">
                <button type="button" class="block w-full px-4 py-1.5 text-left text-sm" :class="{ 'bg-indigo-500 text-white': active }">
                  Documentation
                </button>
              </MenuItem>
              <MenuItem disabled>
                <span class="block w-full px-4 py-1.5 text-left text-sm opacity-50 cursor-default">Invite a friend (coming soon!)</span>
              </MenuItem>
            </MenuItems>
          </FloatContent>
        </Float>
      </Menu>
    </Block>

    <Block title="Menu (Dropdown) with high-order Float" title-class="text-indigo-400">
      <Menu>
        <HighOrderFloat placement="bottom-end">
          <MenuButton class="flex justify-center items-center px-5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-500 text-sm rounded-md">
            Options
          </MenuButton>

          <MenuItems class="w-48 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden focus:outline-none">
            <MenuItem v-slot="{ active }">
              <button type="button" class="block w-full px-4 py-1.5 text-left text-sm" :class="{ 'bg-indigo-500 text-white': active }">
                Account settings
              </button>
            </MenuItem>
            <MenuItem v-slot="{ active }">
              <button type="button" class="block w-full px-4 py-1.5 text-left text-sm" :class="{ 'bg-indigo-500 text-white': active }">
                Documentation
              </button>
            </MenuItem>
            <MenuItem disabled>
              <span class="block w-full px-4 py-1.5 text-left text-sm opacity-50 cursor-default">Invite a friend (coming soon!)</span>
            </MenuItem>
          </MenuItems>
        </HighOrderFloat>
      </Menu>
    </Block>

    <Block title="Menu (Dropdown) override transition class" title-class="text-indigo-400">
      <Menu>
        <HighOrderFloat
          placement="bottom-end"
          enter="transition duration-100 ease-out"
          enter-from="scale-50 opacity-0"
          enter-to="scale-100 opacity-100"
          leave="transition duration-75 ease-in"
          leave-from="scale-100 opacity-100"
          leave-to="scale-50 opacity-0"
        >
          <MenuButton class="flex justify-center items-center px-5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-500 text-sm rounded-md">
            Options
          </MenuButton>

          <MenuItems class="w-48 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden focus:outline-none">
            <MenuItem v-slot="{ active }">
              <button type="button" class="block w-full px-4 py-1.5 text-left text-sm" :class="{ 'bg-indigo-500 text-white': active }">
                Account settings
              </button>
            </MenuItem>
            <MenuItem v-slot="{ active }">
              <button type="button" class="block w-full px-4 py-1.5 text-left text-sm" :class="{ 'bg-indigo-500 text-white': active }">
                Documentation
              </button>
            </MenuItem>
            <MenuItem disabled>
              <span class="block w-full px-4 py-1.5 text-left text-sm opacity-50 cursor-default">Invite a friend (coming soon!)</span>
            </MenuItem>
          </MenuItems>
        </HighOrderFloat>
      </Menu>
    </Block>

    <Block title="Menu (Dropdown) has Arrow" title-class="text-indigo-400">
      <Menu>
        <Float placement="bottom-end" :offset="12" flip arrow>
          <MenuButton class="flex justify-center items-center px-5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-500 text-sm rounded-md">
            Options
          </MenuButton>

          <MenuItems class="w-48 bg-white border border-gray-200 rounded-md shadow-lg focus:outline-none">
            <FloatArrow class="absolute bg-white w-5 h-5 rotate-45 border border-gray-200" />
            <div class="relative z-[1] bg-white rounded-md overflow-hidden">
              <MenuItem v-slot="{ active }">
                <button
                  type="button"
                  class="block w-full px-4 py-1.5 text-left text-sm"
                  :class="{ 'bg-indigo-500 text-white': active }"
                >
                  Account settings
                </button>
              </MenuItem>
              <MenuItem v-slot="{ active }">
                <button
                  type="button"
                  class="block w-full px-4 py-1.5 text-left text-sm"
                  :class="{ 'bg-indigo-500 text-white': active }"
                >
                  Documentation
                </button>
              </MenuItem>
              <MenuItem disabled>
                <span class="block w-full px-4 py-1.5 text-left text-sm opacity-50 cursor-default">Invite a friend (coming soon!)</span>
              </MenuItem>
            </div>
          </MenuItems>
        </Float>
      </Menu>
    </Block>

    <Block title="Explicit use FloatReference & FloatContent" title-class="text-indigo-400">
      <Menu>
        <Float placement="bottom-end">
          <div class="px-8 bg-purple-50">
            <FloatReference>
              <MenuButton class="flex justify-center items-center px-5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-500 text-sm rounded-md">
                Options
              </MenuButton>
            </FloatReference>
          </div>

          <div>
            <FloatContent>
              <MenuItems class="w-48 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden focus:outline-none">
                <MenuItem v-slot="{ active }">
                  <button type="button" class="block w-full px-4 py-1.5 text-left text-sm" :class="{ 'bg-indigo-500 text-white': active }">
                    Account settings
                  </button>
                </MenuItem>
                <MenuItem v-slot="{ active }">
                  <button type="button" class="block w-full px-4 py-1.5 text-left text-sm" :class="{ 'bg-indigo-500 text-white': active }">
                    Documentation
                  </button>
                </MenuItem>
                <MenuItem disabled>
                  <span class="block w-full px-4 py-1.5 text-left text-sm opacity-50 cursor-default">Invite a friend (coming soon!)</span>
                </MenuItem>
              </MenuItems>
            </FloatContent>
          </div>
        </Float>
      </Menu>
    </Block>

    <Block title="Listbox (Select)" title-class="text-amber-400">
      <Listbox v-model="selectedPerson">
        <Float :offset="4" flip>
          <ListboxButton class="relative w-56 bg-white pl-3.5 pr-10 py-2 text-left text-amber-500 text-sm leading-5 border border-gray-200 rounded-lg shadow-md">
            {{ selectedPerson.name }}
            <span class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <HeroiconsOutlineSelector class="w-5 h-5 text-gray-400" aria-hidden="true" />
            </span>
          </ListboxButton>

          <ListboxOptions class="w-56 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden focus:outline-none">
            <ListboxOption
              v-for="person in people"
              v-slot="{ active, selected }"
              :key="person.name"
              :value="person"
              :disabled="person.unavailable"
              as="template"
            >
              <li
                class="relative block w-full pl-10 pr-3 py-2 text-left text-gray-600 text-sm cursor-default"
                :class="{
                  'bg-amber-100 text-amber-700': active,
                  'text-gray-300': person.unavailable,
                }"
              >
                {{ person.name }}
                <span
                  v-if="selected"
                  class="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600"
                >
                  <HeroiconsOutlineCheck class="w-5 h-5" aria-hidden="true" />
                </span>
              </li>
            </ListboxOption>
          </ListboxOptions>
        </Float>
      </Listbox>
    </Block>

    <Block title="Combobox (Autocomplete)" title-class="text-teal-400">
      <Combobox v-model="selectedPerson">
        <Float
          placement="bottom"
          :offset="4"
          leave="transition ease-in duration-100"
          leave-from="opacity-100"
          leave-to="opacity-0"
          @hide="query = ''"
        >
          <div class="relative w-64 text-left bg-white border border-gray-200 rounded-lg shadow-md cursor-default focus:outline-none sm:text-sm overflow-hidden">
            <ComboboxInput
              class="w-64 border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:outline-none focus:ring-0"
              :display-value="(person) => person.name"
              @change="query = $event.target.value"
            />

            <ComboboxButton class="absolute inset-y-0 right-0 flex items-center pr-2">
              <HeroiconsOutlineSelector class="w-5 h-5 text-gray-400" aria-hidden="true" />
            </ComboboxButton>
          </div>

          <ComboboxOptions class="absolute w-64 py-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            <div
              v-if="filteredPeople.length === 0 && query !== ''"
              class="relative py-2 px-4 text-gray-700 cursor-default select-none"
            >
              Nothing found.
            </div>

            <ComboboxOption
              v-for="person in filteredPeople"
              v-slot="{ selected, active }"
              :key="person.id"
              :value="person"
              as="template"
            >
              <li
                class="relative py-2 pl-10 pr-4 cursor-default select-none"
                :class="active ? 'text-white bg-teal-600' : 'text-gray-900'"
              >
                <span
                  class="block truncate"
                  :class="{ 'font-medium': selected, 'font-normal': !selected }"
                >
                  {{ person.name }}
                </span>
                <span
                  v-if="selected"
                  class="absolute inset-y-0 left-0 flex items-center pl-3"
                  :class="active ? 'text-white' : 'text-teal-600'"
                >
                  <HeroiconsOutlineCheck class="w-5 h-5" aria-hidden="true" />
                </span>
              </li>
            </ComboboxOption>
          </ComboboxOptions>
        </Float>
      </Combobox>
    </Block>

    <Block title="Popover" title-class="text-rose-400">
      <Popover>
        <HighOrderFloat
          placement="bottom-start"
          :offset="15"
          arrow
          enter-from="opacity-0 -translate-y-1"
          enter-to="opacity-100 translate-y-0"
          leave-from="opacity-100 translate-y-0"
          leave-to="opacity-0 -translate-y-1"
        >
          <PopoverButton class="w-8 h-8 flex justify-center items-center bg-rose-50 hover:bg-rose-100 text-rose-500 rounded">
            <HeroiconsOutlineMenuAlt2 class="w-5 h-5" aria-hidden="true" />
          </PopoverButton>

          <PopoverPanel class="w-[240px] h-[70px] bg-white border border-gray-200 rounded-md shadow-lg focus:outline-none">
            <FloatArrow class="absolute bg-white w-5 h-5 rotate-45 border border-gray-200" />
            <div class="relative z-[1] h-full bg-white p-3 text-rose-500 rounded-md">
              Popover & arrow, content...
            </div>
          </PopoverPanel>
        </HighOrderFloat>
      </Popover>
    </Block>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  Menu, MenuButton, MenuItems, MenuItem,
  Popover, PopoverButton, PopoverPanel,
  Listbox, ListboxButton, ListboxOptions, ListboxOption,
  Combobox, ComboboxInput, ComboboxButton, ComboboxOptions, ComboboxOption,
} from '@headlessui/vue'
import { Float, FloatReference, FloatContent, FloatArrow } from 'headlessui-float-vue'
import HighOrderFloat from '@/components/HighOrderFloat.vue'
import Block from '@/components/Block.vue'
import HeroiconsOutlineMenuAlt2 from '~icons/heroicons-outline/menu-alt-2'
import HeroiconsOutlineSelector from '~icons/heroicons-outline/selector'
import HeroiconsOutlineCheck from '~icons/heroicons-outline/check'

const people = [
  { id: 1, name: 'Wade Cooper', unavailable: false },
  { id: 2, name: 'Arlene Mccoy', unavailable: false },
  { id: 3, name: 'Devon Webb', unavailable: false },
  { id: 4, name: 'Tom Cook', unavailable: false },
  { id: 5, name: 'Tanya Fox', unavailable: true },
  { id: 6, name: 'Hellen Schmidt', unavailable: false },
]
const selectedPerson = ref(people[0])
const query = ref('')

const filteredPeople = computed(() =>
  query.value === ''
    ? people
    : people.filter((person) =>
        person.name
          .toLowerCase()
          .replace(/\s+/g, '')
          .includes(query.value.toLowerCase().replace(/\s+/g, ''))
      )
)
</script>
