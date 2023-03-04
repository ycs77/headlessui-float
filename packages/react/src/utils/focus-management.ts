import { disposables } from './disposables'
import { match } from './match'
import { getOwnerDocument } from './owner'

// Reference: https://github.com/tailwindlabs/headlessui/blob/7794d563e181787e995db1f877cd26c460e385ee/packages/%40headlessui-react/src/utils/focus-management.ts

// Credit:
//  - https://stackoverflow.com/a/30753870
const focusableSelector = [
  '[contentEditable=true]',
  '[tabindex]',
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'iframe',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
]
  .map(
    // TODO: Remove this once JSDOM fixes the issue where an element that is
    // "hidden" can be the document.activeElement, because this is not possible
    // in real browsers.
    process.env.NODE_ENV === 'test'
      ? selector => `${selector}:not([tabindex='-1']):not([style*='display: none'])`
      : selector => `${selector}:not([tabindex='-1'])`
  )
  .join(',')

export enum Focus {
  /** Focus the first non-disabled element */
  First = 1 << 0,

  /** Focus the previous non-disabled element */
  Previous = 1 << 1,

  /** Focus the next non-disabled element */
  Next = 1 << 2,

  /** Focus the last non-disabled element */
  Last = 1 << 3,

  /** Wrap tab around */
  WrapAround = 1 << 4,

  /** Prevent scrolling the focusable elements into view */
  NoScroll = 1 << 5,
}

export enum FocusResult {
  /** Something went wrong while trying to focus. */
  Error,

  /** When `Focus.WrapAround` is enabled, going from position `N` to `N+1` where `N` is the last index in the array, then we overflow. */
  Overflow,

  /** Focus was successful. */
  Success,

  /** When `Focus.WrapAround` is enabled, going from position `N` to `N-1` where `N` is the first index in the array, then we underflow. */
  Underflow,
}

enum Direction {
  Previous = -1,
  Next = 1,
}

export function getFocusableElements(container: HTMLElement | null = document.body) {
  if (container == null) return []
  return Array.from(container.querySelectorAll<HTMLElement>(focusableSelector)).sort(
    // We want to move `tabIndex={0}` to the end of the list, this is what the browser does as well.
    (a, z) =>
      Math.sign((a.tabIndex || Number.MAX_SAFE_INTEGER) - (z.tabIndex || Number.MAX_SAFE_INTEGER))
  )
}

export enum FocusableMode {
  /** The element itself must be focusable. */
  Strict,

  /** The element should be inside of a focusable element. */
  Loose,
}

export function isFocusableElement(
  element: HTMLElement,
  mode: FocusableMode = FocusableMode.Strict
) {
  if (element === getOwnerDocument(element)?.body) return false

  return match(mode, {
    [FocusableMode.Strict]() {
      return element.matches(focusableSelector)
    },
    [FocusableMode.Loose]() {
      let next: HTMLElement | null = element

      while (next !== null) {
        if (next.matches(focusableSelector)) return true
        next = next.parentElement
      }

      return false
    },
  })
}

export function restoreFocusIfNecessary(element: HTMLElement | null) {
  const ownerDocument = getOwnerDocument(element)
  disposables().nextFrame(() => {
    if (
      ownerDocument &&
      !isFocusableElement(ownerDocument.activeElement as HTMLElement, FocusableMode.Strict)
    ) {
      focusElement(element)
    }
  })
}

export function focusElement(element: HTMLElement | null) {
  element?.focus({ preventScroll: true })
}

// https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/select
const selectableSelector = ['textarea', 'input'].join(',')
function isSelectableElement(
  element: Element | null
): element is HTMLInputElement | HTMLTextAreaElement {
  return element?.matches?.(selectableSelector) ?? false
}

export function sortByDomNode<T>(
  nodes: T[],
  resolveKey: (item: T) => HTMLElement | null = i => i as unknown as HTMLElement | null
): T[] {
  return nodes.slice().sort((aItem, zItem) => {
    const a = resolveKey(aItem)
    const z = resolveKey(zItem)

    if (a === null || z === null) return 0

    const position = a.compareDocumentPosition(z)

    if (position & Node.DOCUMENT_POSITION_FOLLOWING) return -1
    if (position & Node.DOCUMENT_POSITION_PRECEDING) return 1
    return 0
  })
}

export function focusFrom(current: HTMLElement | null, focus: Focus) {
  return focusIn(getFocusableElements(), focus, { relativeTo: current })
}

export function focusIn(
  container: HTMLElement | HTMLElement[],
  focus: Focus,
  {
    sorted = true,
    relativeTo = null,
    skipElements = [],
  }: Partial<{ sorted: boolean, relativeTo: HTMLElement | null, skipElements: HTMLElement[] }> = {}
) {
  const ownerDocument = Array.isArray(container)
    ? container.length > 0
      ? container[0].ownerDocument
      : document
    : container.ownerDocument

  let elements = Array.isArray(container)
    ? sorted
      ? sortByDomNode(container)
      : container
    : getFocusableElements(container)

  if (skipElements.length > 0 && elements.length > 1) {
    elements = elements.filter(x => !skipElements.includes(x))
  }

  relativeTo = relativeTo ?? (ownerDocument.activeElement as HTMLElement)

  const direction = (() => {
    if (focus & (Focus.First | Focus.Next)) return Direction.Next
    if (focus & (Focus.Previous | Focus.Last)) return Direction.Previous

    throw new Error('Missing Focus.First, Focus.Previous, Focus.Next or Focus.Last')
  })()

  const startIndex = (() => {
    if (focus & Focus.First) return 0
    if (focus & Focus.Previous) return Math.max(0, elements.indexOf(relativeTo)) - 1
    if (focus & Focus.Next) return Math.max(0, elements.indexOf(relativeTo)) + 1
    if (focus & Focus.Last) return elements.length - 1

    throw new Error('Missing Focus.First, Focus.Previous, Focus.Next or Focus.Last')
  })()

  const focusOptions = focus & Focus.NoScroll ? { preventScroll: true } : {}

  let offset = 0
  const total = elements.length
  let next
  do {
    // Guard against infinite loops
    if (offset >= total || offset + total <= 0) return FocusResult.Error

    let nextIdx = startIndex + offset

    if (focus & Focus.WrapAround) {
      nextIdx = (nextIdx + total) % total
    } else {
      if (nextIdx < 0) return FocusResult.Underflow
      if (nextIdx >= total) return FocusResult.Overflow
    }

    next = elements[nextIdx]

    // Try the focus the next element, might not work if it is "hidden" to the user.
    next?.focus(focusOptions)

    // Try the next one in line
    offset += direction
  } while (next !== ownerDocument.activeElement)

  // By default if you <Tab> to a text input or a textarea, the browser will
  // select all the text once the focus is inside these DOM Nodes. However,
  // since we are manually moving focus this behaviour is not happening. This
  // code will make sure that the text gets selected as-if you did it manually.
  // Note: We only do this when going forward / backward. Not for the
  // Focus.First or Focus.Last actions. This is similar to the `autoFocus`
  // behaviour on an input where the input will get focus but won't be
  // selected.
  if (focus & (Focus.Next | Focus.Previous) && isSelectableElement(next)) {
    next.select()
  }

  // This is a little weird, but let me try and explain: There are a few scenario's
  // in chrome for example where a focused `<a>` tag does not get the default focus
  // styles and sometimes they do. This highly depends on whether you started by
  // clicking or by using your keyboard. When you programmatically add focus `anchor.focus()`
  // then the active element (document.activeElement) is this anchor, which is expected.
  // However in that case the default focus styles are not applied *unless* you
  // also add this tabindex.
  if (!next.hasAttribute('tabindex')) next.setAttribute('tabindex', '0')

  return FocusResult.Success
}
