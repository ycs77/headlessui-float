<template>
  <Block title="Hover menu" content-class="h-[200px] p-4" data-testid="block-hover-menu">
    <Float
      :show="showHoverMenu"
      placement="bottom-start"
      :offset="12"
      arrow
    >
      <button
        type="button"
        class="flex justify-center items-center px-5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-500 text-sm rounded-md"
        @mouseenter="openHoverMenu"
        @mouseleave="delayCloseHoverMenu"
      >
        Options
      </button>

      <div
        class="w-48 bg-white border border-gray-200 rounded-md shadow-lg"
        @mouseenter="openHoverMenu"
        @mouseleave="delayCloseHoverMenu"
      >
        <FloatArrow class="absolute bg-white w-5 h-5 rotate-45 border border-gray-200" />

        <ul class="relative bg-white rounded-md overflow-hidden">
          <li>
            <button
              type="button"
              class="block w-full px-4 py-2 hover:bg-indigo-500 hover:text-white text-left text-sm"
              @click="closeHoverMenu"
            >
              Profile
            </button>
          </li>
          <li>
            <button
              type="button"
              class="block w-full px-4 py-2 hover:bg-indigo-500 hover:text-white text-left text-sm"
              @click="closeHoverMenu"
            >
              Account settings
            </button>
          </li>
        </ul>
      </div>
    </Float>
  </Block>

  <Block title="Nested Menu" content-class="h-[300px] p-4" data-testid="block-nested-menu">
    <Float
      :show="openMapping.m0"
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
            :show="openMapping.m1"
            placement="right-start"
            :offset="-4"
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
              <HeroiconsChevronRight20Solid class="absolute top-2 right-2 w-4 h-4" />
            </button>
            <ul
              class="w-32 bg-white border border-gray-200 shadow-lg focus:outline-none"
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
                  :show="openMapping.m2"
                  placement="right-start"
                  :offset="-4"
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
                    <HeroiconsChevronRight20Solid class="absolute top-2 right-2 w-4 h-4" />
                  </button>
                  <ul
                    class="w-32 bg-white border border-gray-200 shadow-lg focus:outline-none"
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
import { type Ref, ref } from 'vue'
import { Float, FloatArrow } from '@headlessui-float/vue'
import Block from '@/components/Block.vue'
import HeroiconsChevronRight20Solid from '~icons/heroicons/chevron-right-20-solid'

function useHoverMenu(delay = 150) {
  const show = ref(false)
  const timer = ref(null) as Ref<ReturnType<typeof setTimeout> | null>

  const open = () => {
    if (timer.value !== null) {
      clearTimeout(timer.value)
      timer.value = null
    }
    show.value = true
  }

  const close = () => show.value = false

  const delayClose = () => {
    timer.value = setTimeout(() => {
      show.value = false
    }, delay)
  }

  return { show, timer, open, close, delayClose }
}

function useNestedMenu(keys: string[]) {
  const defaultMapping = {} as Record<string, boolean>
  for (const key of keys) {
    defaultMapping[key] = false
  }
  const openMapping = ref(defaultMapping)

  const menuEnter = (key: string) => {
    openMapping.value[key] = true
  }
  const menuLeave = (key: string) => {
    openMapping.value[key] = false
  }

  return { openMapping, menuEnter, menuLeave }
}

const {
  show: showHoverMenu,
  open: openHoverMenu,
  close: closeHoverMenu,
  delayClose: delayCloseHoverMenu,
} = useHoverMenu(150)

const {
  openMapping,
  menuEnter,
  menuLeave,
} = useNestedMenu(['m0', 'm1', 'm2'])
</script>
