<template>
  <Block title="Floating Popover" content-class="h-[160px] p-4" data-testid="block-popover">
    <Popover>
      <Float
        placement="bottom-start"
        :offset="15"
        :shift="6"
        :flip="10"
        :arrow="5"
        portal
        enter="transition duration-200 ease-out"
        enter-from="opacity-0 -translate-y-1"
        enter-to="opacity-100 translate-y-0"
        leave="transition duration-150 ease-in"
        leave-from="opacity-100 translate-y-0"
        leave-to="opacity-0 -translate-y-1"
      >
        <PopoverButton class="w-8 h-8 flex justify-center items-center bg-rose-50 hover:bg-rose-100 text-rose-500 rounded">
          <HeroiconsBars3BottomLeft20Solid class="w-5 h-5" aria-hidden="true" />
        </PopoverButton>

        <PopoverPanel class="w-[240px] h-[70px] bg-white border border-gray-200 rounded-md shadow-lg focus:outline-none">
          <FloatArrow class="absolute bg-white w-5 h-5 rotate-45 border border-gray-200" />
          <div class="relative h-full bg-white p-3 text-rose-500 rounded-md">
            Popover & arrow, content...
          </div>
        </PopoverPanel>
      </Float>
    </Popover>
  </Block>
</template>

<script setup lang="ts">
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'
import HeroiconsBars3BottomLeft20Solid from '~icons/heroicons/bars-3-bottom-left-20-solid'
</script>
