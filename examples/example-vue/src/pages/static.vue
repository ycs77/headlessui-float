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
      :show="nestedStatus['0'].open"
      placement="bottom-start"
    >
      <button
        type="button"
        class="flex justify-center items-center px-5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-500 text-sm rounded-md"
        @mouseenter="menuEnter('0')"
        @mouseleave="menuLeave('0')"
      >
        Options
      </button>
      <ul
        class="w-48 bg-white border border-gray-200 shadow-lg focus:outline-none"
        @mouseenter="menuEnter('0')"
        @mouseleave="menuLeave('0')"
      >
        <li>
          <button
            type="button"
            class="block w-full px-4 py-1.5 hover:bg-indigo-500 hover:text-white text-left text-sm"
            @click="menuClick('0')"
          >
            Account settings
          </button>
        </li>
        <li>
          <Float
            :show="nestedStatus['1'].open"
            placement="right-start"
            :flip="{ fallbackPlacements: ['right', 'left', 'bottom', 'top'] }"
            shift
          >
            <button
              type="button"
              class="relative block w-full px-4 py-1.5 hover:bg-indigo-500 hover:text-white text-left text-sm"
              @mouseenter="menuEnter('1')"
              @mouseleave="menuLeave('1')"
            >
              Documentation
              <HeroiconsChevronRight20Solid class="absolute top-2 right-2 w-4 h-4" />
            </button>
            <ul
              class="w-32 bg-white border border-gray-200 shadow-lg focus:outline-none"
              @mouseenter="menuEnter('1')"
              @mouseleave="menuLeave('1')"
            >
              <li>
                <button
                  type="button"
                  class="block w-full px-4 py-1.5 hover:bg-indigo-500 hover:text-white text-left text-sm"
                  @click="menuClick('1')"
                >
                  Installation
                </button>
              </li>
              <li>
                <button
                  type="button"
                  class="block w-full px-4 py-1.5 hover:bg-indigo-500 hover:text-white text-left text-sm"
                  @click="menuClick('1')"
                >
                  Usage
                </button>
              </li>
              <li>
                <Float
                  :show="nestedStatus['2'].open"
                  placement="right-start"
                  :flip="{ fallbackPlacements: ['right', 'left', 'bottom', 'top'] }"
                  shift
                >
                  <button
                    type="button"
                    class="relative block w-full px-4 py-1.5 hover:bg-indigo-500 hover:text-white text-left text-sm"
                    @mouseenter="menuEnter('2')"
                    @mouseleave="menuLeave('2')"
                  >
                    Options
                    <HeroiconsChevronRight20Solid class="absolute top-2 right-2 w-4 h-4" />
                  </button>
                  <ul
                    class="w-32 bg-white border border-gray-200 shadow-lg focus:outline-none"
                    @mouseenter="menuEnter('2')"
                    @mouseleave="menuLeave('2')"
                  >
                    <li>
                      <button
                        type="button"
                        class="block w-full px-4 py-1.5 hover:bg-indigo-500 hover:text-white text-left text-sm"
                        @click="menuClick('2')"
                      >
                        Option 1
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        class="block w-full px-4 py-1.5 hover:bg-indigo-500 hover:text-white text-left text-sm"
                        @click="menuClick('2')"
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

<script setup>
import { computed, ref, watch } from 'vue'
import { Float, FloatArrow } from '@headlessui-float/vue'
import Block from '@/components/Block.vue'
import HeroiconsChevronRight20Solid from '~icons/heroicons/chevron-right-20-solid'

function useHoverMenu(delay = 150) {
  const show = ref(false)
  const timer = ref(null)

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

function useNestedMenu(nodes) {
  const defaultNestedStatus = {}
  for (const node of nodes) {
    defaultNestedStatus[node.id] = {
      open: false,
      ...node,
    }
  }
  const nestedStatus = ref(defaultNestedStatus)

  function closeParent(node) {
    if (node.parentId) {
      const parent = nestedStatus.value[node.parentId]
      if (parent.open) {
        parent.open = false
      }
      closeParent(parent)
    }
  }

  const menuEnter = id => {
    nestedStatus.value[id].open = true
  }
  const menuLeave = id => {
    nestedStatus.value[id].open = false
  }
  const menuClick = id => {
    nestedStatus.value[id].open = false
    closeParent(nestedStatus.value[id])
  }

  return { nestedStatus, menuEnter, menuLeave, menuClick }
}

const {
  show: showHoverMenu,
  open: openHoverMenu,
  close: closeHoverMenu,
  delayClose: delayCloseHoverMenu,
} = useHoverMenu(150)

const {
  nestedStatus,
  menuEnter,
  menuLeave,
  menuClick,
} = useNestedMenu([
  { id: '0' },
  { id: '1', parentId: '0' },
  { id: '2', parentId: '1' },
])
</script>
