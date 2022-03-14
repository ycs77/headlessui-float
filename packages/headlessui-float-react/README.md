# Headless UI Float React

English | [繁體中文](README-zh-TW.md)

Easy use [Headless UI](https://headlessui.dev/) for React with [Floating UI](https://floating-ui.com/) (Popper.js) to position floating elements.

This package is adapted from [headlessui#154 example](https://github.com/tailwindlabs/headlessui/issues/154).

* 💙 Easy use Headless UI & Tailwind CSS
* 💬 Floating UI (New version Popper.js) position floating elements
* 🔔 Auto-update floating elements
* ♾️ Support Transition
* 🚪 Support Portal
* ➡️ Support Arrow

[**Live demo**](https://stackblitz.com/github/ycs77/headlessui-float/tree/main/examples/example-react?file=src%2FApp.jsx)

## Installation

Remember that you need to install React, React DOM and Headless UI React first.

```bash
# npm
npm i headlessui-float-react
# yarn
yarn add headlessui-float-react
```

## Usage

Start by finding a Headless UI component that needs to position the element, such as the `<Menu>` component for this example. Import `<Float>` component:

```js
import { Float } from 'headlessui-float-react'
```

Then wrap `<Float>` around `<Menu.Button>` and `<Menu.Items>`:

```diff
<Menu>
+ <Float>
    <Menu.Button className="...">
      Options
    </Menu.Button>

    <Menu.Items className="...">
      ...
    </Menu.Items>
+ </Float>
</Menu>
```

Note that `<Float>` must contain 2 child elements, the first being a reference element, either a Headless UI component or an HTML element, and the second being a floating element.

Then remove the `"absolute"`, `"right-0"` and other positioning class from `<Menu.Items>`, and add the `placement="bottom-end"` attribute:

```jsx
<Menu>
  <Float placement="bottom-end">
    ...
  </Float>
</Menu>
```

Remove the `"mt-2"` class from `<Menu.Items>`, and add the `offset={4}` attribute:

```jsx
<Menu>
  <Float placement="bottom-end" offset={4}>
    ...
  </Float>
</Menu>
```

Then `<Menu>` can automatically position the inner `<Menu.Items>`.

In addition to `<Menu>`, the same can be used on `<Listbox>`, `<Popover>` or `<Combobox>` components, and you can use `<Float>` on any element that requires floating positioning.

## Floating UI Options

### placement

Floating positioning placement:

```jsx
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

```jsx
<Float strategy="fixed">
```

### offset

The offset of the floating element from the reference element (px)：

```jsx
<Float offset={8}>
```

> More options supported by `offset`, refer to Floating UI's `offset` documentation: https://floating-ui.com/docs/offset

### shift

Move the reference elements back into the view:

```jsx
<Float shift>
```

Set the offset (px) of the floating element from the view border:

```jsx
<Float shift={8}>
```

> More options supported by `shift`, refer to Floating UI's `shift` documentation: https://floating-ui.com/docs/shift

### flip

Change to the opposite placement to keep it in view:

> `flip` cannot be used with `autoPlacement`

```jsx
<Float flip>
```

> More options supported by `flip`, refer to Floating UI's `flip` documentation: https://floating-ui.com/docs/flip

### autoPlacement

Floating elements choose the placement with more space left:

> `autoPlacement` cannot be used with `flip`

```jsx
<Float autoPlacement>
```

> More options supported by `autoPlacement`, refer to Floating UI's `autoPlacement` documentation: https://floating-ui.com/docs/autoPlacement

<!-- ### hide

When the reference element is not visible, the floating element is hidden: -->

### autoUpdate

Automatically update floating elements when needed, the default value is `true`. Can be set to `false` to disable autoUpdate:

```jsx
<Float autoUpdate={false}>
```

> More options supported by `autoUpdate`, refer to Floating UI's `autoUpdate` documentation: https://floating-ui.com/docs/autoUpdate

### middleware

If the above basic settings do not satisfy your needs, you can add the Floating UI middleware yourself:

```jsx
import { offset } from '@floating-ui/react-dom'

const middleware = [
  offset({
    mainAxis: 10,
    crossAxis: 6,
  }),
]

<Float middleware={middleware}>
```

Or pass a function to get reference elements and floating elements in the parameters:

```js
const middleware = ({ referenceEl, floatingEl }) => [
  ...
]
```

## Transition

`<Float>` use the `<Transition>` component, just adds the classes of transition:

```jsx
<Float
  enter="transition duration-200 ease-out"
  enterFrom="scale-95 opacity-0"
  enterTo="scale-100 opacity-100"
  leave="transition duration-150 ease-in"
  leaveFrom="scale-100 opacity-100"
  leaveTo="scale-95 opacity-0"
  tailwindcssOriginClass
>
```

When `tailwindcssOriginClass` is enabled, the corresponding Tailwind CSS `origin` class will be automatically added according to the placement (e.g. `top` corresponds to `origin-bottom` class, `bottom-start` corresponds to `origin-top-left` class).

If using the `tailwindcssOriginClass`, also need to add the `origin` class to the safelist:

*tailwind.config.js*
```js
const { tailwindcssOriginSafelist } = require('headlessui-float-react')

module.exports = {
  safelist: [...tailwindcssOriginSafelist],
}
```

If need to override the `origin` class, can use `originClass`.

```html
<Float originClass="origin-top-left">
```

## Arrow

First import the `<Float.Arrow>` component, and put it inside the floating element, then add the class:

```jsx
<Popover>
  <Float>
    ...
    <Popover.Panel>
      {/* 加入箭頭 */}
      <Float.Arrow className="absolute bg-white w-5 h-5 rotate-45 border border-gray-200" />
      <div>
        Popover & arrow, content...
      </div>
    </Popover.Panel>
  </Float>
</Popover>
```

Then add the `arrow` prop in `<Float>`, and add `:offset="15"` to keep the arrow away from the reference element:

```jsx
<Float arrow offset={15}>
```

Full example of the arrow:

```jsx
import { Popover } from '@headlessui/react'
import { Float } from 'headlessui-float-react'

export default function ArrowExample() {
  return (
    <Popover>
      <Float
        placement="bottom-start"
        offset={15}
        arrow
      >
        <Popover.Button className="px-5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-500 rounded">
          Button
        </Popover.Button>

        <Popover.Panel className="w-[240px] h-[70px] bg-white border border-gray-200 rounded-md shadow-lg focus:outline-none">
          <Float.Arrow className="absolute bg-white w-5 h-5 rotate-45 border border-gray-200" />
          <div className="relative h-full bg-white p-3 text-rose-500 rounded-md">
            Popover & arrow, content...
          </div>
        </Popover.Panel>
      </Float>
    </Popover>
  )
}
```

## z-index

Set z-index CSS property for the floating element, the default value is 9999, and other numbers can be set:

```jsx
<Float zIndex={100}>
```

## Portal

Append the floating element to `<body>`:

```jsx
<Float portal>
```

Or can select other elements that already exist:

```jsx
<Float portal="#other-root-element">
```

## High-Order Component

The high-order component can be easily applied in projects after customizing the `<Float>` component:

*HighOrderFloat.jsx*
```jsx
import { Float } from 'headlessui-float-react'

export default function HighOrderFloat(props) {
  return (
    <Float
      offset={8}
      flip
      shift={6}
      portal
      enter="transition duration-200 ease-out"
      enterFrom="scale-95 opacity-0"
      enterTo="scale-100 opacity-100"
      leave="transition duration-150 ease-in"
      leaveFrom="scale-100 opacity-100"
      leaveTo="scale-95 opacity-0"
      tailwindcssOriginClass
      {...props}
    >
      {props.children}
    </Float>
  )
}
```

Used in the same way as `<Float>`. It can also override the defined prop in high-order component:

```jsx
<Menu>
  <HighOrderFloat placement="bottom-end" offset={12}>
    <Menu.Button>
      Options
    </Menu.Button>
    <Menu.Items>
      ...
    </Menu.Items>
  </HighOrderFloat>
</Menu>
```

## License
Under the [MIT LICENSE](LICENSE.md)
