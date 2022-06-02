<template>
  <Block title="Combobox (Autocomplete)" title-class="text-teal-400">
    <Combobox v-model="selected">
      <Float
        placement="bottom-start"
        :offset="4"
        leave="transition ease-in duration-100"
        leave-from="opacity-100"
        leave-to="opacity-0"
        @hide="query = ''"
      >
        <div class="relative w-64 text-left bg-white border border-gray-200 rounded-lg shadow-md cursor-default focus:outline-none sm:text-sm overflow-hidden">
          <ComboboxInput
            class="w-64 border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:outline-none focus:ring-0"
            :display-value="(person: any) => person.name"
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
              <span class="block truncate" :class="selected ? 'font-medium' : 'font-normal'">
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
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Combobox, ComboboxInput, ComboboxButton, ComboboxOptions, ComboboxOption } from '@headlessui/vue'
import { Float } from '@headlessui-float/vue'
import Block from '@/components/Block.vue'
import HeroiconsOutlineCheck from '~icons/heroicons-outline/check'
import HeroiconsOutlineSelector from '~icons/heroicons-outline/selector'

const people = [
  { id: 1, name: 'Wade Cooper', unavailable: false },
  { id: 2, name: 'Arlene Mccoy', unavailable: false },
  { id: 3, name: 'Devon Webb', unavailable: false },
  { id: 4, name: 'Tom Cook', unavailable: false },
  { id: 5, name: 'Tanya Fox', unavailable: true },
  { id: 6, name: 'Hellen Schmidt', unavailable: false },
]
const selected = ref(people[0])
const query = ref('')

const filteredPeople = computed(() =>
  query.value === ''
    ? people
    : people.filter(person =>
        person.name
          .toLowerCase()
          .replace(/\s+/g, '')
          .includes(query.value.toLowerCase().replace(/\s+/g, ''))
      )
)
</script>
