<template>
  <Float
    :offset="8"
    transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0 scale-95"
    enter-to-class="opacity-100 scale-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-95"
    :placement-class-resolver="tailwindcssPlacementClassResolver"
  >
    <slot></slot>

    <template #content>
      <slot name="content"></slot>
    </template>
  </Float>
</template>

<script>
import { Float, tailwindcssPlacementClassResolver } from 'headlessui-float-vue'

export default {
  components: { Float },
  setup() {
    return { tailwindcssPlacementClassResolver }
  },
}
</script>
