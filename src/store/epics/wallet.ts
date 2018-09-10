import { createWallet, setPassphrase } from '@actions'
import { merge } from 'rxjs'
import { filter, mapTo } from 'rxjs/operators'
import { isActionOf } from 'typesafe-actions'
import { RootEpic } from '../root-epic'

export const setupPassphrase$: RootEpic = (action$, _, { generateMnemonic }) => {
  const createWallet$ = action$.pipe(filter(isActionOf(createWallet)))

  const setPassphrase$ = createWallet$.pipe(
    mapTo(setPassphrase({ passphrase: generateMnemonic() })),
  )

  return merge(setPassphrase$)
}
