// Reference: https://github.com/tailwindlabs/headlessui/blob/7794d563e181787e995db1f877cd26c460e385ee/packages/%40headlessui-react/src/hooks/use-id.ts

import React from 'react'
import { env } from '../utils/env'
import { useIsoMorphicEffect } from './use-iso-morphic-effect'
import { useServerHandoffComplete } from './use-server-handoff-complete'

// We used a "simple" approach first which worked for SSR and rehydration on the client. However we
// didn't take care of the Suspense case. To fix this we used the approach the @reach-ui/auto-id
// uses.
//
// Credits: https://github.com/reach/reach-ui/blob/develop/packages/auto-id/src/index.tsx

// let id = 0
// function generateId() {
//   return ++id
// }

export const useId =
  // Prefer React's `useId` if it's available.
  React.useId ??
  function useId() {
    const ready = useServerHandoffComplete()
    const [id, setId] = React.useState(ready ? () => env.nextId() : null)

    useIsoMorphicEffect(() => {
      if (id === null) setId(env.nextId())
    }, [id])

    return id != null ? `${id}` : undefined
  }
