<template>
  <Block title="Adaptive width using CSS" content-class="h-[300px] p-4" data-testid="block-adaptive-width-css">
    <Listbox v-model="selected">
      <Float
        as="div"
        class="relative"
        placement="bottom"
        :offset="4"
        floating-as="template"
      >
        <ListboxButton class="relative w-full bg-white pl-3.5 pr-10 py-2 text-left text-amber-500 text-sm leading-5 border border-gray-200 rounded-lg shadow-md">
          {{ selected.name }}
          <span class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <HeroiconsChevronUpDown20Solid class="w-5 h-5 text-gray-400" aria-hidden="true" />
          </span>
        </ListboxButton>

        <ListboxOptions class="w-full bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden focus:outline-none">
          <ListboxOption
            v-for="person in people"
            v-slot="{ active, selected }"
            :key="person.name"
            :value="person"
            as="template"
          >
            <li
              class="relative block w-full pl-10 pr-3 py-2 text-left text-sm cursor-default"
              :class="active ? 'bg-amber-100 text-amber-700' : 'text-gray-600'"
            >
              <span class="block truncate" :class="selected ? 'font-medium' : 'font-normal'">
                {{ person.name }}
              </span>
              <span
                v-if="selected"
                class="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600"
              >
                <HeroiconsCheck20Solid class="w-5 h-5" aria-hidden="true" />
              </span>
            </li>
          </ListboxOption>
        </ListboxOptions>
      </Float>
    </Listbox>
  </Block>

  <Block title="Adaptive width using JS" content-class="h-[300px] p-4" data-testid="block-adaptive-width-js">
    <Listbox v-model="selected">
      <Float
        as="div"
        placement="bottom"
        :offset="4"
        floating-as="template"
        adaptive-width
        portal
      >
        <ListboxButton class="relative w-full bg-white pl-3.5 pr-10 py-2 text-left text-amber-500 text-sm leading-5 border border-gray-200 rounded-lg shadow-md">
          {{ selected.name }}
          <span class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <HeroiconsChevronUpDown20Solid class="w-5 h-5 text-gray-400" aria-hidden="true" />
          </span>
        </ListboxButton>

        <ListboxOptions class="bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden focus:outline-none">
          <ListboxOption
            v-for="person in people"
            v-slot="{ active, selected }"
            :key="person.name"
            :value="person"
            as="template"
          >
            <li
              class="relative block w-full pl-10 pr-3 py-2 text-left text-sm cursor-default"
              :class="active ? 'bg-amber-100 text-amber-700' : 'text-gray-600'"
            >
              <span class="block truncate" :class="selected ? 'font-medium' : 'font-normal'">
                {{ person.name }}
              </span>
              <span
                v-if="selected"
                class="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600"
              >
                <HeroiconsCheck20Solid class="w-5 h-5" aria-hidden="true" />
              </span>
            </li>
          </ListboxOption>
        </ListboxOptions>
      </Float>
    </Listbox>
  </Block>
</template>

<script setup>
import { ref } from 'vue'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue'
import { Float } from '@headlessui-float/vue'
import Block from '@/components/Block.vue'
import HeroiconsCheck20Solid from '~icons/heroicons/check-20-solid'
import HeroiconsChevronUpDown20Solid from '~icons/heroicons/chevron-up-down-20-solid'

const people = [
  { id: 1, name: 'Durward Reynolds' },
  { id: 2, name: 'Kenton Towne' },
  { id: 3, name: 'Therese Wunsch' },
  { id: 4, name: 'Benedict Kessler' },
  { id: 5, name: 'Katelyn Rohan' },
]
const selected = ref(people[0])
</script>
