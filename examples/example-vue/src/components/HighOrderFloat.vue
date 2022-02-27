<template>
  <Float
    :offset="8"
    flip
    teleport
    transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="scale-95 opacity-0"
    enter-to-class="scale-100 opacity-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="scale-100 opacity-100"
    leave-to-class="scale-95 opacity-0"
    :placement-class-resolver="tailwindcssPlacementClassResolver"
  >
    <slot></slot>
  </Float>
</template>

<script>
import { Float, useArrow, tailwindcssPlacementClassResolver } from 'headlessui-float-vue'

export default {
  components: { Float },
  setup() {
    useArrow()

    return { tailwindcssPlacementClassResolver }
  },
}
</script>
