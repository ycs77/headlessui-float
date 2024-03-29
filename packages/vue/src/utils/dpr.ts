export function getDPR(element: Element) {
  if (typeof window === 'undefined') {
    return 1
  }
  const win = element.ownerDocument.defaultView || window
  return win.devicePixelRatio || 1
}

export function roundByDPR(element: Element, value: number) {
  const dpr = getDPR(element)
  return Math.round(value * dpr) / dpr
}
