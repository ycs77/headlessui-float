<template>
  <div class="relative h-[240px] flex justify-center items-center border-2 border-dashed border-indigo-100 rounded-lg">
    <h2 class="absolute top-3 left-4 text-indigo-400 font-bold tracking-wider">
      {{ title }}
    </h2>
    <slot></slot>
  </div>
</template>

<script setup>
defineProps({
  title: String,
})
</script>
