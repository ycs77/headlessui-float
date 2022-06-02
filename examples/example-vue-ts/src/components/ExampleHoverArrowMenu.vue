<template>
  <Block title="Hover Menu (Dropdown) with Arrow" title-class="text-indigo-400">
    <Float
      :show="show"
      placement="bottom-start"
      :offset="12"
      arrow
    >
      <button
        type="button"
        class="flex justify-center items-center px-5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-500 text-sm rounded-md"
        @mouseenter="open"
        @mouseleave="delayClose"
      >
        Options
      </button>

      <div
        class="w-48 bg-white border border-gray-200 rounded-md shadow-lg"
        @mouseenter="open"
        @mouseleave="delayClose"
      >
        <FloatArrow class="absolute bg-white w-5 h-5 rotate-45 border border-gray-200" />

        <ul class="relative bg-white rounded-md overflow-hidden">
          <li>
            <button
              type="button"
              class="block w-full px-4 py-2 hover:bg-indigo-500 hover:text-white text-left text-sm"
              @click="close"
            >
              Profile
            </button>
          </li>
          <li>
            <button
              type="button"
              class="block w-full px-4 py-2 hover:bg-indigo-500 hover:text-white text-left text-sm"
              @click="close"
            >
              Account settings
            </button>
          </li>
        </ul>
      </div>
    </Float>
  </Block>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Float, FloatArrow } from '@headlessui-float/vue'
import Block from '@/components/Block.vue'

const show = ref(false)
const timer = ref<ReturnType<typeof setTimeout> | null>(null)

const open = () => {
  if (timer.value !== null) {
    clearTimeout(timer.value)
    timer.value = null
  }
  show.value = true
}

const close = () => {
  show.value = false
}

const delayClose = () => {
  timer.value = setTimeout(() => {
    show.value = false
  }, 150)
}
</script>
