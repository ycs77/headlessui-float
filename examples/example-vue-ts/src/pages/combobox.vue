<template>
  <Block title="Floating Combobox" content-class="h-[320px] p-4" data-testid="block-combobox">
    <Combobox v-model="selected">
      <Float
        as="div"
        class="relative w-64"
        placement="bottom-start"
        :offset="4"
        leave="transition ease-in duration-100"
        leave-from="opacity-100"
        leave-to="opacity-0"
        floating-as="template"
        @hide="query = ''"
      >
        <div class="relative w-full text-left bg-white border border-gray-200 rounded-lg shadow-md cursor-default focus:outline-none sm:text-sm overflow-hidden">
          <ComboboxInput
            class="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:outline-none focus:ring-0"
            :display-value="(person: any) => person?.name"
            @change="query = $event.target.value"
          />

          <ComboboxButton class="absolute inset-y-0 right-0 flex items-center pr-2">
            <HeroiconsChevronUpDown20Solid class="w-5 h-5 text-gray-400" aria-hidden="true" />
          </ComboboxButton>
        </div>

        <ComboboxOptions class="absolute w-full py-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
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
                <HeroiconsCheck20Solid class="w-5 h-5" aria-hidden="true" />
              </span>
            </li>
          </ComboboxOption>
        </ComboboxOptions>
      </Float>
    </Combobox>
  </Block>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/vue'
import { Float } from '@headlessui-float/vue'
import Block from '@/components/Block.vue'
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
