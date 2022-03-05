# Headless UI Float Vue

Eazy use [Headless UI](https://headlessui.dev/) for Vue 3 with [Floating UI](https://floating-ui.com/) (Popper.js).

## Usage

Installation package:

```bash
# via npm
npm i headlessui-float-vue
# via yarn
yarn add headlessui-float-vue
```

Basic example using `<Menu>` of Headless UI:

```vue
<template>
  <Menu>
    <Float placement="bottom-start" :offset="4">
      <MenuButton class="flex justify-center items-center px-5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-500 text-sm rounded-md">
        Options
      </MenuButton>

      <MenuItems class="w-48 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden focus:outline-none">
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
</template>

<script>
import { Float } from 'headlessui-float-vue'

export default {
  components: { Float },
}
</script>
```

Anyway you can use for `<Menu>`, `<Listbox>`, `<Popover>` and `<Combobox>`, you can use `<Float>` whenever you need to floating elements.

## Origin Class

* Origin Class Resolver
* Origin Safelist

## z-index

## Floating UI Options

* placement
* strategy
* offset
* shift
* flip
* autoPlacement
* hide
* autoUpdate

## Floating UI Middleware

## Transition

## Portal (Teleport)

## Placement Origin Class

## Arrow

## Event

* show
* hide

## High-Order Component
