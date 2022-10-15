import { Fragment, type VNode, unref } from 'vue'

export function flattenFragment(nodes: VNode[]): VNode[] {
  return nodes.reduce<VNode[]>((carry, node) => {
    if (node.type === Fragment) {
      return carry.concat(flattenFragment(node.children as VNode[]))
    }
    return carry.concat(node)
  }, [])
}

// Reference: https://github.com/tailwindlabs/headlessui/blob/d8424fe311923f6858f6e3d55083df957bca824d/packages/%40headlessui-vue/src/utils/render.ts#L139-L145
export function isValidElement(input: any): boolean {
  if (input == null) return false // No children
  if (typeof input.type === 'string') return true // 'div', 'span', ...
  if (typeof input.type === 'object') return true // Other components
  if (typeof input.type === 'function') return true // Built-ins like Transition
  return false // Comments, strings, ...
}

export function isVisibleDOMElement(input: any): boolean {
  input = unref(input)
  return input && input?.nodeType !== Node.COMMENT_NODE
}
