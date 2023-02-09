<template>
  <Block title="Placement" content-class="block-placement relative h-[320px] flex justify-center items-center border rounded">
    <template #form>
      <div class="absolute top-0 right-0">
        <div class="flex items-center">
          <div class="mr-2">placement</div>
          <select v-model="placement" class="pl-2 pr-1 py-1 border border-gray-300 rounded">
            <option>top-start</option>
            <option>top</option>
            <option>top-end</option>
            <option>right-start</option>
            <option>right</option>
            <option>right-end</option>
            <option>bottom-start</option>
            <option>bottom</option>
            <option>bottom-end</option>
            <option>left-start</option>
            <option>left</option>
            <option>left-end</option>
          </select>
        </div>
      </div>
    </template>

    <Menu>
      <Float show :placement="placement">
        <MenuButton class="flex justify-center items-center px-5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-500 text-sm rounded-md">
          Options
        </MenuButton>

        <MenuItems static class="w-48 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden focus:outline-none">
          <MenuItem v-slot="{ active }">
            <button type="button" class="block w-full px-4 py-1.5 text-left text-sm" :class="{ 'bg-indigo-500 text-white': active }">
              Account settings
            </button>
          </MenuItem>
          <MenuItem v-slot="{ active }">
            <button type="button" class="block w-full px-4 py-1.5 text-left text-sm" :class="{ 'bg-indigo-500 text-white': active }">
              Documentation
            </button>
          </MenuItem>
          <MenuItem disabled>
            <span class="block w-full px-4 py-1.5 text-left text-sm opacity-50 cursor-default">
              Invite a friend (coming soon!)
            </span>
          </MenuItem>
        </MenuItems>
      </Float>
    </Menu>
  </Block>

  <Block title="Offset" content-class="block-offset relative h-[320px] border rounded">
    <template #form>
      <div class="absolute top-0 right-0">
        <div class="flex items-center">
          <div class="mr-2">offset</div>
          <input v-model.number="offset" type="number" class="w-[100px] px-2 py-1 border border-gray-300 rounded">
        </div>
      </div>
    </template>

    <Menu>
      <Float show placement="bottom-start" :offset="offset">
        <MenuButton class="flex justify-center items-center mx-auto px-5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-500 text-sm rounded-md">
          Options
        </MenuButton>

        <MenuItems static class="w-48 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden focus:outline-none">
          <MenuItem v-slot="{ active }">
            <button type="button" class="block w-full px-4 py-1.5 text-left text-sm" :class="{ 'bg-indigo-500 text-white': active }">
              Account settings
            </button>
          </MenuItem>
          <MenuItem v-slot="{ active }">
            <button type="button" class="block w-full px-4 py-1.5 text-left text-sm" :class="{ 'bg-indigo-500 text-white': active }">
              Documentation
            </button>
          </MenuItem>
          <MenuItem disabled>
            <span class="block w-full px-4 py-1.5 text-left text-sm opacity-50 cursor-default">
              Invite a friend (coming soon!)
            </span>
          </MenuItem>
        </MenuItems>
      </Float>
    </Menu>
  </Block>

  <Block title="Shift" content-class="block-shift relative h-[320px] overflow-y-auto border rounded">
    <template #form>
      <div class="absolute top-0 right-0">
        <div class="flex items-center">
          <div class="mr-2">shift</div>
          <input v-model.number="shift" type="number" class="w-[100px] px-2 py-1 border border-gray-300 rounded">
        </div>
      </div>
    </template>

    <div class="h-[800px] pt-[382px]">
      <Menu>
        <Float show placement="right" :shift="shift">
          <MenuButton class="flex justify-center items-center mx-auto px-5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-500 text-sm rounded-md">
            Options
          </MenuButton>

          <MenuItems static class="w-48 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden focus:outline-none">
            <MenuItem v-slot="{ active }">
              <button type="button" class="block w-full px-4 py-1.5 text-left text-sm" :class="{ 'bg-indigo-500 text-white': active }">
                Account settings
              </button>
            </MenuItem>
            <MenuItem v-slot="{ active }">
              <button type="button" class="block w-full px-4 py-1.5 text-left text-sm" :class="{ 'bg-indigo-500 text-white': active }">
                Documentation
              </button>
            </MenuItem>
            <MenuItem disabled>
              <span class="block w-full px-4 py-1.5 text-left text-sm opacity-50 cursor-default">
                Invite a friend (coming soon!)
              </span>
            </MenuItem>
          </MenuItems>
        </Float>
      </Menu>
    </div>
  </Block>

  <Block title="Flip" content-class="block-flip relative h-[320px] overflow-y-auto border rounded">
    <template #form>
      <div class="absolute top-0 right-0">
        <div class="flex items-center">
          <div class="mr-2">flip</div>
          <input v-model.number="flip" type="number" class="w-[100px] px-2 py-1 border border-gray-300 rounded">
        </div>
      </div>
    </template>

    <div class="h-[800px] pt-[382px]">
      <Menu>
        <Float show placement="bottom" :flip="flip">
          <MenuButton class="flex justify-center items-center mx-auto px-5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-500 text-sm rounded-md">
            Options
          </MenuButton>

          <MenuItems static class="w-48 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden focus:outline-none">
            <MenuItem v-slot="{ active }">
              <button type="button" class="block w-full px-4 py-1.5 text-left text-sm" :class="{ 'bg-indigo-500 text-white': active }">
                Account settings
              </button>
            </MenuItem>
            <MenuItem v-slot="{ active }">
              <button type="button" class="block w-full px-4 py-1.5 text-left text-sm" :class="{ 'bg-indigo-500 text-white': active }">
                Documentation
              </button>
            </MenuItem>
            <MenuItem disabled>
              <span class="block w-full px-4 py-1.5 text-left text-sm opacity-50 cursor-default">
                Invite a friend (coming soon!)
              </span>
            </MenuItem>
          </MenuItems>
        </Float>
      </Menu>
    </div>
  </Block>
</template>

<script setup>
import { ref } from 'vue'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { Float } from '@headlessui-float/vue'
import Block from '@/components/Block.vue'

const placement = ref('bottom-start')
const offset = ref(4)
const shift = ref(4)
const flip = ref(0)
</script>
