<h2 align="center">Headless UI Float React</h2>

<p align="center">
  輕鬆在 React 和 <a href="https://headlessui.dev/">Headless UI</a> 中使用 <a href="https://floating-ui.com/">Floating UI</a> (新版 Popper.js) 來定位浮動元素。
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/headlessui-float-react"><img src="https://img.shields.io/npm/v/headlessui-float-react?style=flat-square" alt="NPM Version"></a>
  <a href="https://github.com/ycs77/headlessui-float/blob/main/packages/headlessui-float-react/LICENSE.md"><img src="https://img.shields.io/badge/license-MIT-brightgreen?style=flat-square" alt="Software License"></a>
  <a href="https://www.npmjs.com/package/headlessui-float-react"><img src="https://img.shields.io/npm/dt/headlessui-float-react?style=flat-square" alt="NPM Downloads"></a>
</p>

<hr>

[English](README.md) | 繁體中文

* 💙 輕鬆整合 Headless UI & Tailwind CSS
* 💬 Floating UI (新版 Popper.js) 定位浮動元素
* 🔔 自動更新浮動元素
* ♾️ 支援 Transition
* 🚪 支援 Portal
* ➡️ 支援箭頭 (Arrow)

[**線上 Demo**](https://stackblitz.com/github/ycs77/headlessui-float/tree/main/examples/example-react?file=src%2FApp.jsx)

## 安裝

套件相依於 **React**、**React DOM** 和 **Headless UI React**，記得需要先安裝。

```bash
# npm
npm i headlessui-float-react
# yarn
yarn add headlessui-float-react
```

## 開始使用

先去找一個需要自動定位元素位置的 Headless UI 元件，比如這裡用 `<Menu>` 元件來示範。引入 `<Float>` 元件：

```js
import { Float } from 'headlessui-float-react'
```

然後在 `<Menu.Button>` 和 `<Menu.Items>` 外包一層 `<Float>`：

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

需要注意，`<Float>` 必須包含2個子元素，第1個是參考元素，第2個是浮動元素。可以使用 Headless UI 元件或 HTML 元素。

然後刪除掉 `<Menu.Items>` 的 `absolute`、`right-0` 等定位 class，並加上 `placement="bottom-end"` 屬性：

```jsx
<Menu>
  <Float placement="bottom-end">
    ...
  </Float>
</Menu>
```

刪除掉 `<Menu.Items>` 的 `mt-2` class，並加上 `offset={4}` 屬性：

```jsx
<Menu>
  <Float placement="bottom-end" offset={4}>
    ...
  </Float>
</Menu>
```

然後 `<Menu>` 就可以自動定位內部的 `<Menu.Items>` 元件了。

除了 `<Menu>` 之外，同樣也可以用在 `<Listbox>`、`<Popover>` 或 `<Combobox>` 元件上，你可以使用 `<Float>` 在任何需要浮動定位的元素上。

## 顯示/隱藏

如果浮動元素是 Headless UI 元件，因為顯示的控制權在 Headless UI 元件中，可以直接使用。

但如果需要手動控制浮動元素的顯示與否，就需要設定 `show` 了：

```jsx
const [show, setShow] = useState(false)

<Float show={show}>
```

> 如果浮動元素使用 HTML 元素，而不是 Headless UI 元件的話，就需要設定 `show`。

## Floating UI 選項

### placement

浮動定位方向：

```jsx
<Float placement="left-start">
```

Floating UI 裡 placement 的 12 個值都可以使用：

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

CSS `position` 屬性，`absolute` 或 `fixed`：

```jsx
<Float strategy="fixed">
```

### offset

浮動元素離參考元素的偏移量 (px)：

```jsx
<Float offset={8}>
```

> 更多 `offset` 支援的輸入選項，請參考 Floating UI 的 `offset` 說明：https://floating-ui.com/docs/offset

### shift

將超出界線的參考元素，偏移回至視圖內：

```jsx
<Float shift>
```

設定浮動元素離視圖邊界的偏移量 (px)：

```jsx
<Float shift={8}>
```

> 更多 `shift` 支援的輸入選項，請參考 Floating UI 的 `shift` 說明：https://floating-ui.com/docs/shift

### flip

浮動元素超出邊界時，翻轉至不同的方向，預設為對面，確保可以在視圖中看到：

> `flip` 不能和 `autoPlacement` 同時設定

```jsx
<Float flip>
```

設定翻轉時浮動元素最少離視圖邊界的距離 (px)：

```jsx
<Float flip={10}>
```

> 更多 `flip` 支援的輸入選項，請參考 Floating UI 的 `flip` 說明：https://floating-ui.com/docs/flip

### autoPlacement

浮動元素自動選擇剩餘空間最多的方向：

> `autoPlacement` 不能和 `flip` 同時設定

```jsx
<Float autoPlacement>
```

> 更多 `autoPlacement` 支援的輸入選項，請參考 Floating UI 的 `autoPlacement` 說明：https://floating-ui.com/docs/autoPlacement

<!-- ### hide

當無法看到參考元素時，就會隱藏浮動元素： -->

### autoUpdate

自動在需要的時候更新浮動元素，預設值為 `true`。可以設為 `false` 把它關閉：

```jsx
<Float autoUpdate={false}>
```

> 更多 `autoUpdate` 支援的輸入選項，請參考 Floating UI 的 `autoUpdate` 說明：https://floating-ui.com/docs/autoUpdate

### middleware

如果上述基本的設定無法滿足需求，可以自行增加 Floating UI 的 middleware：

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

或是可以傳入函數，可以在參數中取得參考元素和浮動元素：

```js
const middleware = ({ referenceEl, floatingEl }) => [
  ...
]
```

## Transition

`<Float>` 自帶 `<Transition>` 元件，只需要加上過場中需要的 class：

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

開啟 `tailwindcssOriginClass` 後，會需要根據 placement 自動加上對應的 Tailwind CSS `origin` class (例：`top` 對應 `origin-bottom` class、`bottom-start` 對應 `origin-top-left` class)。

如果使用了 `tailwindcssOriginClass`，也需要在 safelist 中增加 `origin` class：

*tailwind.config.js*
```js
const { tailwindcssOriginSafelist } = require('headlessui-float-react')

module.exports = {
  safelist: [...tailwindcssOriginSafelist],
}
```

如果需要指定或覆蓋 `origin` class，可以用 `originClass`：

```jsx
<Float originClass="origin-top-left">
```

## Arrow (箭頭)

首先先引入 `<Float.Arrow>` 元件，並放置在浮動元素內部，然後加上 class：

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

然後在 `<Float>` 中啟用 `arrow` 功能，和增加 `offset={15}` 讓箭頭離參考元素遠點：

```jsx
<Float arrow offset={15}>
```

但這時候會發現箭頭疊在浮動元素的上面，並不是我們要的效果，所以要把下面的內容包裝起來，並設定 position 為 `relative`，就會移到箭頭的上面。當然還要設定背景顏色，否則還是會看到下方的箭頭：

```html
<Popover.Panel className="w-[240px] h-[70px] bg-white border border-gray-200 rounded-md shadow-lg focus:outline-none">
  <Float.Arrow className="absolute bg-white w-5 h-5 rotate-45 border border-gray-200" />

  <div className="relative h-full bg-white p-3 text-rose-500 rounded-md">
    Popover & arrow, content...
  </div>
</Popover.Panel>
```

箭頭完整範例：

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

為浮動元素設定 z-index，預設值是 9999，也可以設定其他數值：

```jsx
<Float zIndex={100}>
```

## Portal

將浮動元素傳送到 `<body>` 的底部：

```jsx
<Float portal>
```

或是可以指定其他已經存在的元素：

```jsx
<Float portal="#other-root-element">
```

## Transform / Position Absolute (top / left)

預設會使用 CSS 的 transform 來定位浮動元素，如果會造成 transform 屬性的衝突的話，可以設為 `false` 來使用 `top` / `left` 做定位：

```jsx
<Float transform={false}>
```

## High-Order Component

高階元件，可以將 `<Float>` 元件客製好包裝之後，輕鬆在專案中套用：

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

使用方式跟 `<Float>` 的用法一樣，也可以覆蓋在高階元件中已經定義的 prop：

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

如果你有使用 TypeScript，可以增加 `FloatProps` type 到 props 上：

*HighOrderFloat.tsx*
```jsx
import { Float, FloatProps } from 'headlessui-float-react'

export default function HighOrderFloat(props: FloatProps) {
  // ...
}
```

## Component API

### Float

| Prop                     | Type                                              | Default        | Description                               |
| ------------------------ | ------------------------------------------------- | -------------- | ----------------------------------------- |
| `as`                     | <code>String &#124; Component</code>              | `div`          | 包裹了浮動元素的元素或元件                |
| `show`                   | <code>Boolean</code>                              | —              | 控制是否顯示浮動元素                      |
| `placement`              | <code>Placement</code>                            | `bottom-start` | 浮動定位方向位置                          |
| `strategy`               | <code>Strategy</code>                             | `absolute`     | 浮動元素的 CSS `position` 屬性            |
| `offset`                 | <code>Number &#124; Object &#124; Function</code> | —              | 浮動元素離參考元素的偏移量                |
| `shift`                  | <code>Boolean &#124; Number &#124; Object</code>  | `false`        | 將超出界線的參考元素，偏移回至視圖內      |
| `flip`                   | <code>Boolean &#124; Number &#124; Object</code>  | `false`        | 浮動元素超出邊界時，翻轉至不同的方向      |
| `arrow`                  | <code>Boolean &#124; Number</code>                | `false`        | 啟用箭頭定位                              |
| `autoPlacement`          | <code>Boolean &#124; Object</code>                | `false`        | 浮動元素自動選擇剩餘空間最多的方向        |
| `autoUpdate`             | <code>Boolean &#124; Object</code>                | `true`         | 自動在需要的時候更新浮動元素              |
| `zIndex`                 | <code>Number</code>                               | `9999`         | 浮動元素的 CSS `z-index` 屬性             |
| `enter`                  | <code>String</code>                               | —              | `<Transition>` 過場進入時增加的 class     |
| `enterFrom`              | <code>String</code>                               | —              | `<Transition>` 過場進入開始時增加的 class |
| `enterTo`                | <code>String</code>                               | —              | `<Transition>` 過場進入結束時增加的 class |
| `leave`                  | <code>String</code>                               | —              | `<Transition>` 過場離開時增加的 class     |
| `leaveFrom`              | <code>String</code>                               | —              | `<Transition>` 過場離開開始時增加的 class |
| `leaveTo`                | <code>String</code>                               | —              | `<Transition>` 過場離開結束時增加的 class |
| `originClass`            | <code>String &#124; Function</code>               | —              | 設定 transform 的 origin class            |
| `tailwindcssOriginClass` | <code>Boolean</code>                              | `false`        | 啟用自動設定 Tailwind CSS origin class    |
| `portal`                 | <code>Boolean &#124; String</code>                | `false`        | 傳送浮動元素到頁面的其他元素之中          |
| `transform`              | <code>Boolean</code>                              | `true`         | 是否啟用 CSS transform 來定位參考元素     |
| `middleware`             | <code>Array &#124; () => []</code>                | `() => []`     | Floating UI middleware                    |
| `onShow`                 | <code>() => void</code>                           | —              | 在開啟浮動元素時觸發                      |
| `onHide`                 | <code>() => void</code>                           | —              | 在關閉浮動元素時觸發                      |
| `onUpdate`               | <code>() => void</code>                           | —              | 在更新浮動元素定位時觸發                  |

### Float.Arrow

| Prop     | Type                                 | Default | Description                        |
| -------- | ------------------------------------ | ------- | ---------------------------------- |
| `as`     | <code>String &#124; Component</code> | `div`   | 顯示箭頭的元素或元件               |
| `offset` | <code>Number</code>                  | `4`     | 箭頭元素往浮動元素外面偏移的偏移量 |

| Render Prop | Description                |
| ----------- | -------------------------- |
| `placement` | 目前浮動元素顯示的方向位置 |

## Credits

* [Headless UI](https://headlessui.dev/)
* [Floating UI](https://floating-ui.com/)
* 此套件的靈感來自 [headlessui#154 範例](https://github.com/tailwindlabs/headlessui/issues/154)

## License
Under the [MIT LICENSE](LICENSE.md)
