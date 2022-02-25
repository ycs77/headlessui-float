<template>
  <h1 class="mt-4 text-center text-gray-700 text-2xl tracking-wide">Headless UI Float - Vue Example</h1>

  <div class="p-6 grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">

    <Block title="Menu (Dropdown) with original Float" title-class="text-indigo-400">
      <Menu>
        <Float placement="bottom-end">
          <MenuButton class="flex justify-center items-center px-4 py-1.5 text-indigo-500 bg-indigo-50 hover:bg-indigo-100 rounded-md">
            Options
          </MenuButton>

          <MenuItems class="w-48 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden focus:outline-none">
            <MenuItem v-slot="{ active }">
              <button type="button" class="block w-full px-4 py-1.5 text-left" :class="{ 'bg-indigo-500 text-white': active }">
                Account settings
              </button>
            </MenuItem>
            <MenuItem v-slot="{ active }">
              <button type="button" class="block w-full px-4 py-1.5 text-left" :class="{ 'bg-indigo-500 text-white': active }">
                Documentation
              </button>
            </MenuItem>
            <MenuItem disabled>
              <span class="block w-full px-4 py-1.5 text-left opacity-50 cursor-default">Invite a friend (coming soon!)</span>
            </MenuItem>
          </MenuItems>
        </Float>
      </Menu>
    </Block>

    <Block title="Menu (Dropdown) with high-order Float" title-class="text-indigo-400">
      <Menu>
        <HighOrderFloat placement="bottom-end">
          <MenuButton class="flex justify-center items-center px-4 py-1.5 text-indigo-500 bg-indigo-50 hover:bg-indigo-100 rounded-md">
            Options
          </MenuButton>

          <MenuItems class="w-48 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden focus:outline-none">
            <MenuItem v-slot="{ active }">
              <button type="button" class="block w-full px-4 py-1.5 text-left" :class="{ 'bg-indigo-500 text-white': active }">
                Account settings
              </button>
            </MenuItem>
            <MenuItem v-slot="{ active }">
              <button type="button" class="block w-full px-4 py-1.5 text-left" :class="{ 'bg-indigo-500 text-white': active }">
                Documentation
              </button>
            </MenuItem>
            <MenuItem disabled>
              <span class="block w-full px-4 py-1.5 text-left opacity-50 cursor-default">Invite a friend (coming soon!)</span>
            </MenuItem>
          </MenuItems>
        </HighOrderFloat>
      </Menu>
    </Block>

    <Block title="Menu (Dropdown) override transition class" title-class="text-indigo-400">
      <Menu>
        <HighOrderFloat
          placement="bottom-end"
          enter-active-class="transition duration-100 ease-out"
          enter-from-class="scale-50 opacity-0"
          enter-to-class="scale-100 opacity-100"
          leave-active-class="transition duration-75 ease-in"
          leave-from-class="scale-100 opacity-100"
          leave-to-class="scale-50 opacity-0"
        >
          <MenuButton class="flex justify-center items-center px-4 py-1.5 text-indigo-500 bg-indigo-50 hover:bg-indigo-100 rounded-md">
            Options
          </MenuButton>

          <MenuItems class="w-48 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden focus:outline-none">
            <MenuItem v-slot="{ active }">
              <button type="button" class="block w-full px-4 py-1.5 text-left" :class="{ 'bg-indigo-500 text-white': active }">
                Account settings
              </button>
            </MenuItem>
            <MenuItem v-slot="{ active }">
              <button type="button" class="block w-full px-4 py-1.5 text-left" :class="{ 'bg-indigo-500 text-white': active }">
                Documentation
              </button>
            </MenuItem>
            <MenuItem disabled>
              <span class="block w-full px-4 py-1.5 text-left opacity-50 cursor-default">Invite a friend (coming soon!)</span>
            </MenuItem>
          </MenuItems>
        </HighOrderFloat>
      </Menu>
    </Block>

    <Block title="Menu (Dropdown) has Arrow" title-class="text-indigo-400">
      <Menu>
        <Float placement="bottom-end" :offset="12" flip>
          <MenuButton class="flex justify-center items-center px-4 py-1.5 text-indigo-500 bg-indigo-50 hover:bg-indigo-100 rounded-md">
            Options
          </MenuButton>

          <MenuItems class="w-48 bg-white border border-gray-200 rounded-md shadow-lg focus:outline-none">
            <FloatArrow class="absolute bg-white w-5 h-5 rotate-45 border border-gray-200" />
            <div class="relative z-[1] bg-white rounded-md overflow-hidden">
              <MenuItem v-slot="{ active }">
                <button
                  type="button"
                  class="block w-full px-4 py-1.5 text-left"
                  :class="{ 'bg-indigo-500 text-white': active }"
                >
                  Account settings
                </button>
              </MenuItem>
              <MenuItem v-slot="{ active }">
                <button
                  type="button"
                  class="block w-full px-4 py-1.5 text-left"
                  :class="{ 'bg-indigo-500 text-white': active }"
                >
                  Documentation
                </button>
              </MenuItem>
              <MenuItem disabled>
                <span class="block w-full px-4 py-1.5 text-left opacity-50 cursor-default">Invite a friend (coming soon!)</span>
              </MenuItem>
            </div>
          </MenuItems>
        </Float>
      </Menu>
    </Block>

    <Block title="FloatButton & FloatContent" title-class="text-indigo-400">
      <Menu>
        <Float placement="bottom-end">
          <div class="p-8 bg-purple-50">
            <FloatButton>
              <MenuButton class="flex justify-center items-center px-4 py-1.5 text-indigo-500 bg-indigo-50 hover:bg-indigo-100 rounded-md">
                Options
              </MenuButton>
            </FloatButton>
          </div>

          <div>
            <FloatContent>
              <MenuItems class="w-48 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden focus:outline-none">
                <MenuItem v-slot="{ active }">
                  <button type="button" class="block w-full px-4 py-1.5 text-left" :class="{ 'bg-indigo-500 text-white': active }">
                    Account settings
                  </button>
                </MenuItem>
                <MenuItem v-slot="{ active }">
                  <button type="button" class="block w-full px-4 py-1.5 text-left" :class="{ 'bg-indigo-500 text-white': active }">
                    Documentation
                  </button>
                </MenuItem>
                <MenuItem disabled>
                  <span class="block w-full px-4 py-1.5 text-left opacity-50 cursor-default">Invite a friend (coming soon!)</span>
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

    <Block title="Popover" title-class="text-rose-400">
      <Popover>
        <HighOrderFloat
          placement="bottom-start"
          :offset="15"
          enter-from-class="opacity-0 -translate-y-1"
          enter-to-class="opacity-100 translate-y-0"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-1"
        >
          <PopoverButton class="w-8 h-8 flex justify-center items-center bg-rose-50 hover:bg-rose-100 text-rose-500 rounded">
            <HeroiconsOutlineMenuAlt2 class="w-5 h-5" aria-hidden="true" />
          </PopoverButton>

          <PopoverPanel class="w-[240px] h-[70px] bg-white border border-gray-200 rounded-md shadow-lg focus:outline-none">
            <FloatArrow class="absolute bg-white w-5 h-5 rotate-45 border border-gray-200" />
            <div class="relative z-[1] h-full bg-white p-3 text-rose-500">
              Popover & arrow, content...
            </div>
          </PopoverPanel>
        </HighOrderFloat>
      </Popover>
    </Block>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import {
  Menu, MenuButton, MenuItems, MenuItem,
  Popover, PopoverButton, PopoverPanel,
  Listbox, ListboxButton, ListboxOptions, ListboxOption,
} from '@headlessui/vue'
import { Float, FloatButton, FloatContent, FloatArrow } from 'headlessui-float-vue'
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
</script>
