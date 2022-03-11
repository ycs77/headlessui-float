# Headless UI Float Vue

English | [繁體中文](README-zh-TW.md)

Eazy use [Headless UI](https://headlessui.dev/) for Vue 3 with [Floating UI](https://floating-ui.com/) (Popper.js) to position floating elements.

This package is adapted from [headlessui#154 example](https://github.com/tailwindlabs/headlessui/issues/154).

* Eazy use Headless UI & Tailwind CSS
* Floating UI (New version Popper.js) position floating elements
* Auto-update floating elements
* Support Transition
* Support Portal (Teleport)
* Support Arrow

[**Example repository**](../../examples/example-vue)

## Installation

```bash
# npm
npm i headlessui-float-vue
# yarn
yarn add headlessui-float-vue
```

## Usage

First finding a Headless UI component that needs to positioning element, such as the `<Menu>` component here. Import `<Float>` component:

```html
<script setup>
import { Float } from 'headlessui-float-vue'
</script>
```

Then wrap `<Float>` around `<MenuButton>` and `<MenuItems>`:

```diff
<Menu>
+ <Float>
    <MenuButton class="...">
      Options
    </MenuButton>

    <MenuItems class="...">
      ...
    </MenuItems>
+ </Float>
</Menu>
```

Note that `<Float>` must contain 2 child elements, the first being a reference element, either a Headless UI component or an HTML element, and the second being a float element.

Then remove the `"absolute"`, `"right-0"` and other positioning class from `<MenuItems>`, and add the `placement="bottom-end"` attribute:

```html
<Menu>
  <Float placement="bottom-end">
    ...
  </Float>
</Menu>
```

Remove the `"mt-2"` class from `<MenuItems>`, and add the `:offset="4"` attribute:

```html
<Menu>
  <Float placement="bottom-end" :offset="4">
    ...
  </Float>
</Menu>
```

Then `<Menu>` can be automatically position the inner `<MenuItems>`.

In addition to `<Menu>`, the same can be used on `<Listbox>`, `<Popover>` or `<Combobox>` components, and you can use `<Float>` on any element that requires floating positioning.

## Floating UI Options

### placement

Floating positioning placement:

```html
<Float placement="left-start">
```

All 12 placement in the Floating UI can be used:

* top
* top-start
* top-end
* right
* right-start
* right-end
* bottom
* bottom-start
* bottom-end
* left
* left-start
* left-end

### strategy

The type of CSS position property, `absolute` or `fixed`：

```html
<Float strategy="fixed">
```

### offset

Offset of the floating element from the reference element (px)：

```html
<Float :offset="8">
```

> More options supported by `offset`, refer to Floating UI's `offset` documentation: https://floating-ui.com/docs/offset

### shift

Move the reference elements back into the view:

```html
<Float shift>
```

Set the offset (px) of the floating element from the view border:

```html
<Float :shift="8">
```

> More options supported by `shift`, refer to Floating UI's `shift` documentation: https://floating-ui.com/docs/shift

### flip

Change to the opposite placement to keep it in view:

> `flip` cannot be used with `autoPlacement`

```html
<Float flip>
```

> More options supported by `flip`, refer to Floating UI's `flip` documentation: https://floating-ui.com/docs/flip

### autoPlacement

Floating elements chooses the placement with more space left:

> `autoPlacement` cannot be used with `flip`

```html
<Float auto-placement>
```

> More options supported by `autoPlacement`, refer to Floating UI's `autoPlacement` documentation: https://floating-ui.com/docs/autoPlacement

<!-- ### hide

When the reference element is not visible, the floating element is hidden: -->

### autoUpdate

Automatically update floating elements when needed, the default value is `true`. Can be set to `false` to disable autoUpdate:

```html
<Float :auto-update="false">
```

> More options supported by `autoUpdate`, refer to Floating UI's `autoUpdate` documentation: https://floating-ui.com/docs/autoUpdate

### middleware

If the above basic settings do not satisfy your needs, you can add the Floating UI middleware yourself:

```html
<Float :middleware="middleware">

<script setup>
import { offset } from '@floating-ui/dom'

const middleware = [
  offset({
    mainAxis: 10,
    crossAxis: 6,
  }),
]
</script>
```

Or pass a function to get reference elements and floating elements in the parameters:

```js
const middleware = ({ referenceEl, floatingEl }) => [
  ...
]
```

## Transition

`<Float>` use the `<transition>` component, just adds the classes of transition:

```html
<Float
  enter="transition duration-200 ease-out"
  enter-from="scale-95 opacity-0"
  enter-to="scale-100 opacity-100"
  leave="transition duration-150 ease-in"
  leave-from="scale-100 opacity-100"
  leave-to="scale-95 opacity-0"
  tailwindcss-origin-class
>
```

When `tailwindcss-origin-class` is enabled, the corresponding Tailwind CSS `origin` class will be automatically added according to the placement (e.g. `top` corresponds to `origin-bottom` class, `bottom-start` corresponds to `origin-top-left` class).

If use the `tailwindcss-origin-class`, also need to add the `origin` class to the safelist:

*tailwind.config.js*
```js
const { tailwindcssOriginSafelist } = require('headlessui-float-vue')

module.exports = {
  safelist: [...tailwindcssOriginSafelist],
}
```

If need to override the `origin` class, can use `origin-class`.

```html
<Float origin-class="origin-top-left">
```

## Arrow

First import the `<FloatArrow>` component, and palce it inside the floating element, then add the class:

```html
<Popover>
  <Float>
    ...
    <PopoverPanel>
      <!-- add arrow -->
      <FloatArrow class="absolute bg-white w-5 h-5 rotate-45 border border-gray-200" />
      <div>
        Popover & arrow, content...
      </div>
    </PopoverPanel>
  </Float>
</Popover>

<script setup>
...
import { Float, FloatArrow } from 'headlessui-float-vue'
</script>
```

Then add the `arrow` prop in `<Float>`, and add `:offset="15"` to keep the arrow away from the reference element:

```html
<Float arrow :offset="15">
```

Full example of arrow:

```vue
<template>
  <Popover>
    <Float
      placement="bottom-start"
      :offset="15"
      arrow
    >
      <PopoverButton class="px-5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-500 rounded">
        Button
      </PopoverButton>

      <PopoverPanel class="w-[240px] h-[70px] bg-white border border-gray-200 rounded-md shadow-lg focus:outline-none">
        <FloatArrow class="absolute bg-white w-5 h-5 rotate-45 border border-gray-200" />
        <div class="relative h-full bg-white p-3 text-rose-500 rounded-md">
          Popover & arrow, content...
        </div>
      </PopoverPanel>
    </Float>
  </Popover>
</template>

<script setup>
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'
import { Float, FloatArrow } from 'headlessui-float-vue'
</script>
```

## z-index

Set `z-index` CSS property for the floating element, the default value is 9999, and other numbers can be set:

```html
<Float :z-index="100">
```

## Portal (Teleport)

Append the floating element to `<body>`:

```html
<Float portal>
```

Or can select other elements that already exist:

```html
<Float portal="#other-root-element">
```

## High-Order Component

The high-order component, can be easily applied in projects after custom of `<Float>` component:

*HighOrderFloat.vue*
```vue
<template>
  <Float
    :offset="8"
    flip
    :shift="6"
    portal
    enter="transition duration-200 ease-out"
    enter-from="scale-95 opacity-0"
    enter-to="scale-100 opacity-100"
    leave="transition duration-150 ease-in"
    leave-from="scale-100 opacity-100"
    leave-to="scale-95 opacity-0"
    tailwindcss-origin-class
  >
    <slot></slot>
  </Float>
</template>

<script setup>
import { Float } from 'headlessui-float-vue'
</script>
```

Used in the same way as `<Float>`. It can also override the defined prop in high-order component:

```html
<Menu>
  <HighOrderFloat placement="bottom-end" :offset="12">
    <MenuButton>
      Options
    </MenuButton>
    <MenuItems>
      ...
    </MenuItems>
  </HighOrderFloat>
</Menu>
```

## License
Under the [MIT LICENSE](LICENSE.md)
