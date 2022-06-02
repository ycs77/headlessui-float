<template>
  <Block title="Nested Menu (Dropdown) with pure HTML" title-class="text-indigo-400">
    <Float
      :show="openMapping['m0']"
      placement="bottom-start"
    >
      <button
        type="button"
        class="flex justify-center items-center px-5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-500 text-sm rounded-md"
        @mouseenter="menuEnter('m0')"
        @mouseleave="menuLeave('m0')"
      >
        Options
      </button>
      <ul
        class="w-48 bg-white border border-gray-200 shadow-lg focus:outline-none"
        @mouseenter="menuEnter('m0')"
        @mouseleave="menuLeave('m0')"
      >
        <li>
          <button
            type="button"
            class="block w-full px-4 py-1.5 hover:bg-indigo-500 hover:text-white text-left text-sm"
            @click="menuLeave('m0')"
          >
            Account settings
          </button>
        </li>
        <li>
          <Float
            :show="openMapping['m1']"
            placement="right-start"
            :flip="{ fallbackPlacements: ['right', 'left', 'bottom', 'top'] }"
            shift
          >
            <button
              type="button"
              class="relative block w-full px-4 py-1.5 hover:bg-indigo-500 hover:text-white text-left text-sm"
              @mouseenter="menuEnter('m1')"
              @mouseleave="menuLeave('m1')"
            >
              Documentation
              <HeroiconsOutlineChevronRight class="absolute top-2 right-2 w-4 h-4" />
            </button>
            <ul
              class="w-48 bg-white border border-gray-200 shadow-lg focus:outline-none"
              @mouseenter="menuEnter('m1')"
              @mouseleave="menuLeave('m1')"
            >
              <li>
                <button
                  type="button"
                  class="block w-full px-4 py-1.5 hover:bg-indigo-500 hover:text-white text-left text-sm"
                  @click="menuLeave('m1')"
                >
                  Installation
                </button>
              </li>
              <li>
                <button
                  type="button"
                  class="block w-full px-4 py-1.5 hover:bg-indigo-500 hover:text-white text-left text-sm"
                  @click="menuLeave('m1')"
                >
                  Usage
                </button>
              </li>
              <li>
                <Float
                  :show="openMapping['m2']"
                  placement="right-start"
                  :flip="{ fallbackPlacements: ['right', 'left', 'bottom', 'top'] }"
                  shift
                >
                  <button
                    type="button"
                    class="relative block w-full px-4 py-1.5 hover:bg-indigo-500 hover:text-white text-left text-sm"
                    @mouseenter="menuEnter('m2')"
                    @mouseleave="menuLeave('m2')"
                  >
                    Options
                    <HeroiconsOutlineChevronRight class="absolute top-2 right-2 w-4 h-4" />
                  </button>
                  <ul
                    class="w-48 bg-white border border-gray-200 shadow-lg focus:outline-none"
                    @mouseenter="menuEnter('m2')"
                    @mouseleave="menuLeave('m2')"
                  >
                    <li>
                      <button
                        type="button"
                        class="block w-full px-4 py-1.5 hover:bg-indigo-500 hover:text-white text-left text-sm"
                        @click="menuLeave('m2')"
                      >
                        Option 1
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        class="block w-full px-4 py-1.5 hover:bg-indigo-500 hover:text-white text-left text-sm"
                        @click="menuLeave('m2')"
                      >
                        Option 2
                      </button>
                    </li>
                  </ul>
                </Float>
              </li>
            </ul>
          </Float>
        </li>
        <li>
          <button type="button" class="block w-full px-4 py-1.5 text-left text-sm opacity-50 cursor-default" disabled>
            Invite a friend (coming soon!)
          </button>
        </li>
      </ul>
    </Float>
  </Block>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Float } from '@headlessui-float/vue'
import Block from '@/components/Block.vue'
import HeroiconsOutlineChevronRight from '~icons/heroicons-outline/chevron-right'

const openMapping = ref<Record<string, boolean>>({
  m0: false,
  m1: false,
  m2: false,
})

const menuEnter = (key: string) => {
  openMapping.value[key] = true
}
const menuLeave = (key: string) => {
  openMapping.value[key] = false
}
</script>
