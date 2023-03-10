<template>
  <Block title="Context Menu" content-class="h-[200px] p-4" data-testid="block-context-menu">
    <div class="h-full flex justify-center items-center text-gray-500 text-center font-medium italic">
      Click right mouse button to show the Context Menu
    </div>

    <FloatContextMenu
      v-slot="{ close }"
      enter="transition-opacity duration-200 ease-out"
      enter-from="opacity-0"
      enter-to="opacity-100"
    >
      <Menu>
        <MenuItems static class="w-48 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden focus:outline-none">
          <MenuItem v-slot="{ active }">
            <button type="button" class="block w-full px-4 py-1.5 text-left text-sm" :class="{ 'bg-indigo-500 text-white': active }" @click="close">
              Account settings
            </button>
          </MenuItem>
          <MenuItem v-slot="{ active }">
            <button type="button" class="block w-full px-4 py-1.5 text-left text-sm" :class="{ 'bg-indigo-500 text-white': active }" @click="close">
              Documentation
            </button>
          </MenuItem>
          <MenuItem disabled>
            <span class="block w-full px-4 py-1.5 text-left text-sm opacity-50 cursor-default">
              Invite a friend (coming soon!)
            </span>
          </MenuItem>
        </MenuItems>
      </Menu>
    </FloatContextMenu>
  </Block>

  <Block title="Custom Cursor" content-class="h-[120px] p-4" data-testid="block-cursor">
    <div class="h-full flex justify-center items-center text-gray-500 font-medium italic">
      Move cursor on screen
    </div>

    <FloatCursor as="div">
      <div class="w-5 h-5 bg-emerald-500 rounded-full -translate-x-1/2 -translate-y-1/2" />
    </FloatCursor>
  </Block>
</template>

<script setup>
import { Menu, MenuItem, MenuItems } from '@headlessui/vue'
import { FloatContextMenu, FloatCursor } from '@headlessui-float/vue'
import Block from '@/components/Block.vue'
</script>
