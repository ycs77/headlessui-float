<template>
  <Float
    v-slot="slotProps"
    :offset="8"
    flip
    :shift="6"
    portal
    enter="transition duration-200 ease-out"
    enter-from="scale-95 opacity-0"
    enter-to="scale-100 opacity-100"
    leave="transition duration-150 ease-in"
    leave-from="scale-100 opacity-100"
    leave-to="scale-95 opacity-0"
    tailwindcss-origin-class
  >
    <slot v-bind="slotProps" />
  </Float>
</template>

<script setup>
import { Float } from '@headlessui-float/vue'
</script>
