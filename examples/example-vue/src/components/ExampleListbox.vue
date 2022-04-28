<template>
  <Block title="Listbox (Select)" title-class="text-amber-400">
    <Listbox v-model="selected">
      <Float placement="bottom" :offset="4" :flip="10">
        <ListboxButton class="relative w-56 bg-white pl-3.5 pr-10 py-2 text-left text-amber-500 text-sm leading-5 border border-gray-200 rounded-lg shadow-md">
          {{ selected.name }}
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
              <span class="block truncate" :class="selected ? 'font-medium' : 'font-normal'">
                {{ person.name }}
              </span>
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
</template>

<script setup>
import { ref } from 'vue'
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue'
import { Float } from 'headlessui-float-vue'
import Block from '@/components/Block.vue'
import HeroiconsOutlineCheck from '~icons/heroicons-outline/check'
import HeroiconsOutlineSelector from '~icons/heroicons-outline/selector'

const people = [
  { id: 1, name: 'Durward Reynolds', unavailable: false },
  { id: 2, name: 'Kenton Towne', unavailable: false },
  { id: 3, name: 'Therese Wunsch', unavailable: false },
  { id: 4, name: 'Benedict Kessler', unavailable: true },
  { id: 5, name: 'Katelyn Rohan', unavailable: false },
]
const selected = ref(people[0])
</script>
