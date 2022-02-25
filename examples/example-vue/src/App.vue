<template>
  <div class="p-6 grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">

    <Block title="Menu (Dropdown) with original Float">
      <Menu v-slot="{ open }">
        <Float placement="bottom-end">
          <MenuButton class="flex justify-center items-center px-4 py-1.5 text-indigo-500 bg-indigo-50 hover:bg-indigo-100 rounded-md">
            Options
          </MenuButton>

          <template #content>
            <MenuItems v-if="open" static class="w-48 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden">
              <MenuItem v-slot="{ active }">
                <button type="button" class="block w-full px-4 py-1.5 text-left" :class="{ 'bg-indigo-500 text-white': active }">
                  Account settings
                </button>
              </MenuItem>
              <MenuItem v-slot="{ active }">
                <button type="button" class="block w-full px-4 py-1.5 text-left" :class="{ 'bg-indigo-500 text-white': active }">
                  Documentation
                </button>
              </MenuItem>
              <MenuItem disabled>
                <span class="block w-full px-4 py-1.5 text-left opacity-50 cursor-default">Invite a friend (coming soon!)</span>
              </MenuItem>
            </MenuItems>
          </template>
        </Float>
      </Menu>
    </Block>

    <Block title="Menu (Dropdown) with high-order Float">
      <Menu v-slot="{ open }">
        <HighOrderFloat placement="bottom-end">
          <MenuButton class="flex justify-center items-center px-4 py-1.5 text-indigo-500 bg-indigo-50 hover:bg-indigo-100 rounded-md">
            Options
          </MenuButton>

          <template #content>
            <MenuItems v-if="open" static class="w-48 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden">
              <MenuItem v-slot="{ active }">
                <button type="button" class="block w-full px-4 py-1.5 text-left" :class="{ 'bg-indigo-500 text-white': active }">
                  Account settings
                </button>
              </MenuItem>
              <MenuItem v-slot="{ active }">
                <button type="button" class="block w-full px-4 py-1.5 text-left" :class="{ 'bg-indigo-500 text-white': active }">
                  Documentation
                </button>
              </MenuItem>
              <MenuItem disabled>
                <span class="block w-full px-4 py-1.5 text-left opacity-50 cursor-default">Invite a friend (coming soon!)</span>
              </MenuItem>
            </MenuItems>
          </template>
        </HighOrderFloat>
      </Menu>
    </Block>

    <Block title="Menu (Dropdown) override transition class">
      <Menu v-slot="{ open }">
        <HighOrderFloat
          placement="bottom-end"
          enter-active-class="transition duration-100 ease-out"
          enter-from-class="scale-50 opacity-0"
          enter-to-class="scale-100 opacity-100"
          leave-active-class="transition duration-75 ease-in"
          leave-from-class="scale-100 opacity-100"
          leave-to-class="scale-50 opacity-0"
        >
          <MenuButton class="flex justify-center items-center px-4 py-1.5 text-indigo-500 bg-indigo-50 hover:bg-indigo-100 rounded-md">
            Options
          </MenuButton>

          <template #content>
            <MenuItems v-if="open" static class="w-48 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden">
              <MenuItem v-slot="{ active }">
                <button type="button" class="block w-full px-4 py-1.5 text-left" :class="{ 'bg-indigo-500 text-white': active }">
                  Account settings
                </button>
              </MenuItem>
              <MenuItem v-slot="{ active }">
                <button type="button" class="block w-full px-4 py-1.5 text-left" :class="{ 'bg-indigo-500 text-white': active }">
                  Documentation
                </button>
              </MenuItem>
              <MenuItem disabled>
                <span class="block w-full px-4 py-1.5 text-left opacity-50 cursor-default">Invite a friend (coming soon!)</span>
              </MenuItem>
            </MenuItems>
          </template>
        </HighOrderFloat>
      </Menu>
    </Block>

    <Block title="Listbox (Select)">
    </Block>

    <Block title="Combobox (Autocomplete)">
    </Block>

    <Block title="Popover">
      <Popover v-slot="{ open }">
        <HighOrderFloat
          placement="bottom-start"
          enter-from-class="opacity-0 -translate-y-1"
          enter-to-class="opacity-100 translate-y-0"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-1"
        >
          <PopoverButton class="w-8 h-8 flex justify-center items-center text-gray-600 hover:text-indigo-500 bg-gray-100 hover:bg-indigo-100 rounded">
            <HeroiconsOutlineMenuAlt2 class="w-5 h-5" aria-hidden="true" />
          </PopoverButton>

          <template #content>
            <PopoverPanel v-if="open" static class="w-[240px] h-[70px] p-3 bg-white border border-gray-200 rounded-md shadow-lg">
              <div>
                content...
              </div>
            </PopoverPanel>
          </template>
        </HighOrderFloat>
      </Popover>
    </Block>

  </div>
</template>

<script setup>
import { Menu, MenuButton, MenuItems, MenuItem, Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'
import { Float } from 'headlessui-float-vue'
import HighOrderFloat from '@/components/HighOrderFloat.vue'
import Block from '@/components/Block.vue'
import HeroiconsOutlineMenuAlt2 from '~icons/heroicons-outline/menu-alt-2'
</script>
