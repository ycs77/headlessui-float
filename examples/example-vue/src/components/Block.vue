<template>
  <div class="relative max-w-screen-md">
    <h2 class="font-bold tracking-wider mb-4">{{ title }}</h2>
    <div :class="contentClass">
      <slot />
    </div>
    <slot name="form" />
  </div>
</template>

<script setup>
defineProps({
  title: String,
  contentClass: String,
})
</script>
