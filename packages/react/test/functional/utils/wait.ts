export function nextFrame() {
  return new Promise<void>(resolve =>
    setImmediate(() =>
      setImmediate(resolve)
    )
  )
}

export function wait(ms: number) {
  return new Promise<void>(resolve => setTimeout(resolve, ms))
}
