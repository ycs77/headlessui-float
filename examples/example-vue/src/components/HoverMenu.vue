<template>
  <ul class="w-48 bg-white border border-gray-200 shadow-lg focus:outline-none">
    <li v-for="item in items" :key="item.id">
      <button
        v-if="!item.children"
        type="button"
        class="relative block w-full px-4 py-1.5 hover:bg-indigo-500 hover:text-white text-left text-sm"
        @click="item.onClick?.(() => $emit('close')) ?? $emit('close')"
      >
        {{ item.label }}
      </button>

      <Float
        v-else
        :show="status[item.id]"
        placement="right-start"
        :flip="{ fallbackPlacements: ['right', 'left', 'bottom', 'top'] }"
        shift
      >
        <button
          type="button"
          class="relative block w-full px-4 py-1.5 hover:bg-indigo-500 hover:text-white text-left text-sm"
          @mouseenter="open(item.id)"
          @mouseleave="delayClose(item.id)"
        >
          {{ item.label }}
          <HeroiconsChevronRight20Solid class="absolute top-2 right-2 w-4 h-4" />
        </button>

        <HoverMenu
          :items="item.children"
          @mouseenter="open(item.id)"
          @mouseleave="delayClose(item.id)"
          @close="$emit('close')"
        />
      </Float>
    </li>
  </ul>
</template>

<script setup>
import { ref } from 'vue'
import { Float } from '@headlessui-float/vue'
import HeroiconsChevronRight20Solid from '~icons/heroicons/chevron-right-20-solid'

const props = defineProps({
  items: Array,
})

defineEmits(['close'])

const defaultStatus = {}
for (const item of props.items) {
  defaultStatus[item.id] = false
}
const status = ref(defaultStatus)

const delay = 1200
const currentId = ref(null)
const timer = ref(null)

async function open(id) {
  if (currentId.value !== null &&
      currentId.value !== id) {
    close(currentId.value)
  }

  if (timer.value !== null) {
    clearTimeout(timer.value)
    timer.value = null
  }

  currentId.value = id
  status.value[id] = true
}

function close(id) {
  currentId.value = null
  status.value[id] = false
}

function delayClose(id) {
  timer.value = setTimeout(() => {
    close(id)
  }, delay)
}
</script>
