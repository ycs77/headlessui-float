# Headless UI Float Vue

The [Floating UI](https://floating-ui.com/) (Popper.js) integration for [Headless UI](https://headlessui.dev/) Vue.

## Usage

Installation package:

```bash
# via npm
npm i headlessui-float-vue
# via yarn
yarn add headlessui-float-vue
```

Basic example using Headless UI &lt;Menu&gt;:

```vue
<template>
  <Menu>
    <Float placement="bottom-end">
      <MenuButton class="flex justify-center items-center px-4 py-1.5 text-indigo-500 bg-indigo-50 hover:bg-indigo-100 rounded-md">
        Options
      </MenuButton>

      <MenuItems class="w-48 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden">
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
    </Float>
  </Menu>
</template>

<script>
import { Float } from 'headlessui-float-vue'

export default {
  components: { Float },
}
</script>
```
