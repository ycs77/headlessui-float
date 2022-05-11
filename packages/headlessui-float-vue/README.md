<h2 align="center">Headless UI Float Vue</h2>

<p align="center">
  Easy use <a href="https://headlessui.dev/">Headless UI</a> for Vue 3 with <a href="https://floating-ui.com/">Floating UI</a> (New version Popper.js) to position floating elements.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/headlessui-float-vue"><img src="https://img.shields.io/npm/v/headlessui-float-vue?style=flat-square" alt="NPM Version"></a>
  <a href="https://github.com/ycs77/headlessui-float/blob/main/packages/headlessui-float-vue/LICENSE.md"><img src="https://img.shields.io/badge/license-MIT-brightgreen?style=flat-square" alt="Software License"></a>
  <a href="https://www.npmjs.com/package/headlessui-float-vue"><img src="https://img.shields.io/npm/dt/headlessui-float-vue?style=flat-square" alt="NPM Downloads"></a>
</p>

<hr>

English | [繁體中文](README-zh-TW.md)

* 💙 Easy use Headless UI & Tailwind CSS
* 💬 Floating UI (New version Popper.js) position floating elements
* 🔔 Auto-update floating elements
* ♾️ Support Transition
* 🚪 Support Portal (Teleport)
* ➡️ Support Arrow

[**Demo**](https://stackblitz.com/github/ycs77/headlessui-float/tree/main/examples/example-vue?file=src%2FApp.vue)

## Installation

This package is require **Vue 3** and **Headless UI Vue**, you must be installed them first.

```bash
# npm
npm i headlessui-float-vue
# yarn
yarn add headlessui-float-vue
```

## Usage

Start by finding a Headless UI component that needs to position the element, such as the `<Menu>` component for this example. Import `<Float>` component:

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

Note that `<Float>` must contain 2 child elements, the first is the reference element, and the second is the floating element. It can be a Headless UI component or an HTML element.

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

Then `<Menu>` can automatically position the inner `<MenuItems>`.

In addition to `<Menu>`, the same can be used on `<Listbox>`, `<Popover>` or `<Combobox>` components, and you can use `<Float>` on any element that requires floating positioning.

## Show/Hide

If the floating element is Headless UI component, since the control of display is in the Headless UI component, it can be used directly.

However, if you want to manually control the display of the floating element, need to set `show`:

```html
<template>
  <Float :show="show">
    ...
  </Float>
</template>

<script setup>
const show = ref(false)
</script>
```

> If the floating element uses an HTML element instead of the Headless UI component, need to set `show`.

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

The type of CSS position property, `absolute` or `fixed`:

```html
<Float strategy="fixed">
```

### offset

The offset (px) of the floating element from the reference element:

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

Sets the minimum padding (px) of the floating element from the view border when flip:

```html
<Float :flip="10">
```

> More options supported by `flip`, refer to Floating UI's `flip` documentation: https://floating-ui.com/docs/flip

### autoPlacement

Floating elements choose the placement with more space left:

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

If using the `tailwindcss-origin-class`, also need to add the `origin` class to the safelist:

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

First import the `<FloatArrow>` component, and put it inside the floating element, then add the class:

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

But then we will find that the arrow is stacked on top of the floating element, which is not the effect we want, so need to wrap the content below and set the position to `relative`, and it will move to the top of the arrow. Of course, we also need to set the background color, otherwise will still see the arrow below:

```html
<PopoverPanel class="w-[240px] h-[70px] bg-white border border-gray-200 rounded-md shadow-lg focus:outline-none">
  <FloatArrow class="..." />

  <div class="relative h-full bg-white p-3 text-rose-500 rounded-md">
    Popover & arrow, content...
  </div>
</PopoverPanel>
```

Full example of the arrow:

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

CSS `z-index` property for the floating element, the default value is 9999, and other numbers can be set:

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

## Transform / Position Absolute (top / left)

The default is to use CSS transform to position floating elements. If this causes a conflict in transform properties, can set `false` to use `top` / `left` for positioning:

```html
<Float :transform="false">
```

## High-Order Component

The high-order component can be easily applied in projects after customizing the `<Float>` component:

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

Used in the same way as `<Float>`, it can also override the defined prop in high-order component:

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

If you using the TypeScript, can define `FloatProps` to the props of `<HighOrderFloat>`:

*HighOrderFloat.vue*
```vue
<script setup>
import { Float, FloatProps } from 'headlessui-float-vue'

defineProps(FloatProps)
</script>
```

## Auto Importing

Use with [unplugin-vue-components](https://github.com/antfu/unplugin-vue-components) to auto-import components:

*vite.config.js*
```js
import Vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { HeadlessUiFloatResolver } from 'headlessui-float-vue'

export default {
  plugins: [
    Vue(),
    Components({
      resolvers: [
        HeadlessUiFloatResolver(),
      ],
    }),
  ],
}
```

Then you can use `<Float>` components as you want without explicit importing:

```vue
<template>
  <Float>
    ...
    <FloatArrow />
  </Float>
</template>
```

## Component API

### Float

| Prop                       | Type                                              | Default        | Description                                                                           |
| -------------------------- | ------------------------------------------------- | -------------- | ------------------------------------------------------------------------------------- |
| `as`                       | <code>String &#124; Component</code>              | `div`          | The element or component the floating element should render as.                       |
| `show`                     | <code>Boolean</code>                              | —              | Control the floating element is show or not.                                          |
| `placement`                | <code>Placement</code>                            | `bottom-start` | Floating placement.                                                                   |
| `strategy`                 | <code>Strategy</code>                             | `absolute`     | CSS `position` property of the floating element.                                      |
| `offset`                   | <code>Number &#124; Object &#124; Function</code> | —              | The offset (px) of the floating element from the reference element.                   |
| `shift`                    | <code>Boolean &#124; Number &#124; Object</code>  | `false`        | Move the reference elements back into the view.                                       |
| `flip`                     | <code>Boolean &#124; Number &#124; Object</code>  | `false`        | Change to the opposite placement to keep it in view.                                  |
| `arrow`                    | <code>Boolean &#124; Number</code>                | `false`        | Enable arrow positioning.                                                             |
| `auto-placement`           | <code>Boolean &#124; Object</code>                | `false`        | Floating elements choose the placement with more space left.                          |
| `auto-update`              | <code>Boolean &#124; Object</code>                | `true`         | Automatically update floating elements when needed.                                   |
| `z-index`                  | <code>Number</code>                               | `9999`         | CSS `z-index` property for the floating element.                                      |
| `enter`                    | <code>String</code>                               | —              | Classes to add to the transitioning element during the entire enter phase.            |
| `enter-from`               | <code>String</code>                               | —              | Classes to add to the transitioning element before the enter phase starts.            |
| `enter-to`                 | <code>String</code>                               | —              | Classes to add to the transitioning element immediately after the enter phase starts. |
| `leave`                    | <code>String</code>                               | —              | Classes to add to the transitioning element during the entire leave phase.            |
| `leave-from`               | <code>String</code>                               | —              | Classes to add to the transitioning element before the leave phase starts.            |
| `leave-to`                 | <code>String</code>                               | —              | Classes to add to the transitioning element immediately after the leave phase starts. |
| `origin-class`             | <code>String &#124; Function</code>               | —              | The origin class of transform.                                                        |
| `tailwindcss-origin-class` | <code>Boolean</code>                              | `false`        | Enable automatically setting Tailwind CSS origin class.                               |
| `portal`                   | <code>Boolean &#124; String</code>                | `false`        | Render floating element in the other exists element.                                  |
| `transform`                | <code>Boolean</code>                              | `true`         | Use CSS transform to positioning floating element.                                    |
| `middleware`               | <code>Array &#124; Function</code>                | `() => []`     | Floating UI middleware                                                                |

| Event    | Description                                             |
| -------- | ------------------------------------------------------- |
| `show`   | Triggered when the floating element is show.            |
| `hide`   | Triggered when the floating element is hide.            |
| `update` | Triggered when the floating element position is update. |

### FloatArrow

| Prop     | Type                                 | Default | Description                                                 |
| -------- | ------------------------------------ | ------- | ----------------------------------------------------------- |
| `as`     | <code>String &#124; Component</code> | `div`   | The element or component the arrow should render as.        |
| `offset` | <code>Number</code>                  | `4`     | Offset of the arrow to the outside of the floating element. |

| Slot Prop   | Description                         |
| ----------- | ----------------------------------- |
| `placement` | Current floating element placement. |

## Credits

* [Headless UI](https://headlessui.dev/)
* [Floating UI](https://floating-ui.com/)
* This package is inspired from the [headlessui#154 example](https://github.com/tailwindlabs/headlessui/issues/154)

## License
Under the [MIT LICENSE](LICENSE.md)
