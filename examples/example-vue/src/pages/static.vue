<template>
  <Block title="Hover Arrow menu" content-class="h-[200px] p-4" data-testid="block-hover-arrow-menu">
    <Float
      :show="showHoverMenu"
      placement="bottom-start"
      :offset="12"
      :arrow="5"
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
      :show="showNestedMenu"
      placement="bottom-start"
    >
      <button
        type="button"
        class="flex justify-center items-center px-5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-500 text-sm rounded-md"
        @mouseenter="openNestedMenu"
        @mouseleave="delayCloseNestedMenu"
      >
        Options
      </button>

      <HoverMenu
        :items="items"
        @close="closeNestedMenu"
        @mouseenter="openNestedMenu"
        @mouseleave="delayCloseNestedMenu"
      />
    </Float>
  </Block>
</template>

<script setup>
import { ref } from 'vue'
import { Float, FloatArrow } from '@headlessui-float/vue'
import Block from '@/components/Block.vue'
import HoverMenu from '@/components/HoverMenu.vue'

const items = [
  {
    id: '1',
    label: 'Account settings',
    children: [
      {
        id: '1-1',
        label: 'Installation',
      },
      {
        id: '1-2',
        label: 'Usage',
      },
      {
        id: '1-3',
        label: 'Options',
        children: [
          {
            id: '1-3-1',
            label: 'Option 1',
          },
          {
            id: '1-3-2',
            label: 'Option 2',
          },
        ],
      },
    ],
  },
  {
    id: '2',
    label: 'Documentation',
    children: [
      {
        id: '2-1',
        label: 'Installation',
      },
      {
        id: '2-2',
        label: 'Usage',
      },
      {
        id: '2-3',
        label: 'Options',
        children: [
          {
            id: '2-3-1',
            label: 'Option 1',
          },
          {
            id: '2-3-2',
            label: 'Option 2',
          },
        ],
      },
    ],
  },
  {
    id: '3',
    label: 'Invite a friend',
    onClick(close) {
      // eslint-disable-next-line no-console
      console.log('Click invite a friend!')
      close()
    },
  },
]

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

const {
  show: showHoverMenu,
  open: openHoverMenu,
  close: closeHoverMenu,
  delayClose: delayCloseHoverMenu,
} = useHoverMenu()

const {
  show: showNestedMenu,
  open: openNestedMenu,
  close: closeNestedMenu,
  delayClose: delayCloseNestedMenu,
} = useHoverMenu()
</script>
