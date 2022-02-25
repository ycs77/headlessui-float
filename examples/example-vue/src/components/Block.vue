<template>
  <div class="relative h-[240px] flex justify-center items-center border-2 border-dashed border-indigo-100 rounded-lg">
    <h2 class="absolute top-3 left-4 font-bold tracking-wider" :class="titleClass">
      {{ title }}
    </h2>
    <slot></slot>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  titleClass: String,
})
</script>
