<h2 align="center">Headless UI Float React</h2>

<p align="center">
  Easy use <a href="https://headlessui.dev/">Headless UI</a> for React with <a href="https://floating-ui.com/">Floating UI</a> (New version Popper.js) to position floating elements.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/headlessui-float-react"><img src="https://img.shields.io/npm/v/headlessui-float-react?style=flat-square" alt="NPM Version"></a>
  <a href="https://github.com/ycs77/headlessui-float/blob/main/packages/headlessui-float-react/LICENSE.md"><img src="https://img.shields.io/badge/license-MIT-brightgreen?style=flat-square" alt="Software License"></a>
  <a href="https://www.npmjs.com/package/headlessui-float-react"><img src="https://img.shields.io/npm/dt/headlessui-float-react?style=flat-square" alt="NPM Downloads"></a>
</p>

<hr>

English | [繁體中文](README-zh-TW.md)

* 💙 Easy use Headless UI & Tailwind CSS
* 💬 Floating UI (New version Popper.js) position floating elements
* 🔔 Auto-update floating elements
* ♾️ Support Transition
* 🚪 Support Portal
* ➡️ Support Arrow

[**Live demo**](https://stackblitz.com/github/ycs77/headlessui-float/tree/main/examples/example-react?file=src%2FApp.jsx)

## Installation

This package is require **React**, **React DOM** and **Headless UI React**, you must be installed them first.

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

Note that `<Float>` must contain 2 child elements, the first is the reference element, and the second is the floating element. It can be a Headless UI component or an HTML element.

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

## Show/Hide

If the floating element is Headless UI component, since the control of display is in the Headless UI component, it can be used directly.

However, if you want to manually control the display of the floating element, need to set `show`:

```jsx
const [show, setShow] = useState(false)

<Float show={show}>
```

> If the floating element uses an HTML element instead of the Headless UI component, need to set `show`.

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

The type of CSS position property, `absolute` or `fixed`:

```jsx
<Float strategy="fixed">
```

### offset

The offset (px) of the floating element from the reference element:

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

CSS `z-index` property for the floating element, the default value is 9999, and other numbers can be set:

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

## Transform / Position Absolute (top / left)

The default is to use CSS transform to position floating elements. If this causes a conflict in transform properties, can set `false` to use `top` / `left` for positioning:

```jsx
<Float transform={false}>
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

## Component API

### Float

| Prop                     | Type                                              | Default        | Description                                                                           |
| ------------------------ | ------------------------------------------------- | -------------- | ------------------------------------------------------------------------------------- |
| `show`                   | <code>Boolean</code>                              | —              | Control the floating element is show or not.                                          |
| `placement`              | <code>Placement</code>                            | `bottom-start` | Floating placement.                                                                   |
| `strategy`               | <code>Strategy</code>                             | `absolute`     | CSS `position` property of the floating element.                                      |
| `offset`                 | <code>Number &#124; Object &#124; Function</code> | —              | The offset (px) of the floating element from the reference element.                   |
| `shift`                  | <code>Boolean &#124; Number &#124; Object</code>  | `false`        | Move the reference elements back into the view.                                       |
| `flip`                   | <code>Boolean &#124; Object</code>                | `false`        | Change to the opposite placement to keep it in view.                                  |
| `arrow`                  | <code>Boolean &#124; Number</code>                | `false`        | Enable arrow positioning.                                                             |
| `autoPlacement`          | <code>Boolean &#124; Object</code>                | `false`        | Floating elements choose the placement with more space left.                          |
| `autoUpdate`             | <code>Boolean &#124; Object</code>                | `true`         | Automatically update floating elements when needed.                                   |
| `zIndex`                 | <code>Number</code>                               | `9999`         | CSS `z-index` property for the floating element.                                      |
| `enter`                  | <code>String</code>                               | —              | Classes to add to the transitioning element during the entire enter phase.            |
| `enterFrom`              | <code>String</code>                               | —              | Classes to add to the transitioning element before the enter phase starts.            |
| `enterTo`                | <code>String</code>                               | —              | Classes to add to the transitioning element immediately after the enter phase starts. |
| `leave`                  | <code>String</code>                               | —              | Classes to add to the transitioning element during the entire leave phase.            |
| `leaveFrom`              | <code>String</code>                               | —              | Classes to add to the transitioning element before the leave phase starts.            |
| `leaveTo`                | <code>String</code>                               | —              | Classes to add to the transitioning element immediately after the leave phase starts. |
| `originClass`            | <code>String &#124; Function</code>               | —              | The origin class of transform.                                                        |
| `tailwindcssOriginClass` | <code>Boolean</code>                              | `false`        | Enable automatically setting Tailwind CSS origin class.                               |
| `portal`                 | <code>Boolean &#124; String</code>                | `false`        | Render floating element in the other exists element.                                  |
| `transform`              | <code>Boolean</code>                              | `true`         | Use CSS transform to positioning floating element.                                    |
| `middleware`             | <code>Array &#124; () => []</code>                | `() => []`     | Floating UI middleware                                                                |
| `onShow`                 | <code>() => void</code>                           | —              | Triggered when the floating element is show.                                          |
| `onHide`                 | <code>() => void</code>                           | —              | Triggered when the floating element is hide.                                          |
| `onUpdate`               | <code>() => void</code>                           | —              | Triggered when the floating element position is update.                               |

### Float.Arrow

| Prop     | Type                                 | Default | Description                                                 |
| -------- | ------------------------------------ | ------- | ----------------------------------------------------------- |
| `as`     | <code>String &#124; Component</code> | `div`   | The element or component the arrow should render as.        |
| `offset` | <code>Number</code>                  | `4`     | Offset of the arrow to the outside of the floating element. |

| Render Prop | Description                         |
| ----------- | ----------------------------------- |
| `placement` | Current floating element placement. |

## Credits

* [Headless UI](https://headlessui.dev/)
* [Floating UI](https://floating-ui.com/)
* This package is inspired from the [headlessui#154 example](https://github.com/tailwindlabs/headlessui/issues/154)

## License
Under the [MIT LICENSE](LICENSE.md)
