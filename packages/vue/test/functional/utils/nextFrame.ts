export function nextFrame() {
  return new Promise<void>(resolve =>
    setImmediate(() =>
      setImmediate(resolve)
    )
  )
}
