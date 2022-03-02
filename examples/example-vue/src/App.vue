<template>
  <h1 class="mt-4 text-center text-gray-800 text-2xl font-bold">
    Headless UI Float - Vue Example
  </h1>

  <div class="p-6 grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
    <ExampleMenuOriginalFloat />
    <ExampleMenuHighOrderComponent />
    <ExampleMenuOverrideTransition />
    <ExampleMenuHasArrow />
    <ExampleNestedMenu />
    <ExampleListbox />
    <ExampleCombobox />
    <ExamplePopover />
  </div>
</template>

<script setup>
import ExampleMenuOriginalFloat from '@/components/ExampleMenuOriginalFloat.vue'
import ExampleMenuHighOrderComponent from '@/components/ExampleMenuHighOrderComponent.vue'
import ExampleMenuOverrideTransition from '@/components/ExampleMenuOverrideTransition.vue'
import ExampleMenuHasArrow from '@/components/ExampleMenuHasArrow.vue'
import ExampleNestedMenu from '@/components/ExampleNestedMenu.vue'
import ExampleListbox from '@/components/ExampleListbox.vue'
import ExampleCombobox from '@/components/ExampleCombobox.vue'
import ExamplePopover from '@/components/ExamplePopover.vue'
</script>
