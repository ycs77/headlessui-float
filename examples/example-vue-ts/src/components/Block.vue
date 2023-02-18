<template>
  <div class="relative max-w-screen-md">
    <h2 class="font-bold tracking-wider mb-4">{{ title }}</h2>
    <div :class="contentClass" :data-testid="dataTestid">
      <slot />
    </div>
    <slot name="form" />
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: String,
  contentClass: String,
  dataTestid: String,
})
</script>
