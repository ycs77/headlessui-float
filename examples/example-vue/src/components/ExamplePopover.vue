<template>
  <Block title="Popover" title-class="text-rose-400">
    <Popover>
      <HighOrderFloat
        placement="bottom-start"
        :offset="15"
        arrow
        enter-from="opacity-0 -translate-y-1"
        enter-to="opacity-100 translate-y-0"
        leave-from="opacity-100 translate-y-0"
        leave-to="opacity-0 -translate-y-1"
      >
        <PopoverButton class="w-8 h-8 flex justify-center items-center bg-rose-50 hover:bg-rose-100 text-rose-500 rounded">
          <HeroiconsOutlineMenuAlt2 class="w-5 h-5" aria-hidden="true" />
        </PopoverButton>

        <PopoverPanel class="w-[240px] h-[70px] bg-white border border-gray-200 rounded-md shadow-lg focus:outline-none">
          <FloatArrow class="absolute bg-white w-5 h-5 rotate-45 border border-gray-200" />
          <div class="relative z-[1] h-full bg-white p-3 text-rose-500 rounded-md">
            Popover & arrow, content...
          </div>
        </PopoverPanel>
      </HighOrderFloat>
    </Popover>
  </Block>
</template>

<script setup>
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'
import { FloatArrow } from 'headlessui-float-vue'
import HighOrderFloat from '@/components/HighOrderFloat.vue'
import Block from '@/components/Block.vue'
import HeroiconsOutlineMenuAlt2 from '~icons/heroicons-outline/menu-alt-2'
</script>
