export function roundByDPR(value: number) {
  const dpr = typeof window !== 'undefined' ? window.devicePixelRatio : 1
  return Math.round(value * dpr) / dpr
}
