// Reference: https://github.com/tailwindlabs/headlessui/blob/0162c57d88cfdc74209d6bdcac94d54078f97675/packages/%40headlessui-react/src/hooks/use-server-handoff-complete.ts

import { useEffect, useState } from 'react'

const state = { serverHandoffComplete: false }

export function useServerHandoffComplete() {
  const [serverHandoffComplete, setServerHandoffComplete] = useState(state.serverHandoffComplete)

  useEffect(() => {
    if (serverHandoffComplete === true) return

    setServerHandoffComplete(true)
  }, [serverHandoffComplete])

  useEffect(() => {
    if (state.serverHandoffComplete === false) state.serverHandoffComplete = true
  }, [])

  return serverHandoffComplete
}
