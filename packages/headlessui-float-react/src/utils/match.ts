/** @see https://github.com/tailwindlabs/headlessui/blob/fdd26297953080d5ec905dda0bf5ec9607897d86/packages/%40headlessui-react/src/utils/match.ts */
export function match<TValue extends string | number = string, TReturnValue = unknown>(
  value: TValue,
  lookup: Record<TValue, TReturnValue | ((...args: any[]) => TReturnValue)>,
  ...args: any[]
): TReturnValue {
  if (value in lookup) {
    let returnValue = lookup[value]
    return typeof returnValue === 'function' ? returnValue(...args) : returnValue
  }

  let error = new Error(
    `Tried to handle "${value}" but there is no handler defined. Only defined handlers are: ${Object.keys(
      lookup
    )
      .map((key) => `"${key}"`)
      .join(', ')}.`
  )
  // @ts-ignore
  if (Error.captureStackTrace) Error.captureStackTrace(error, match)
  throw error
}
