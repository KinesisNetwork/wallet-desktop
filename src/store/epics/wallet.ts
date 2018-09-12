import { setPassphrase, startWalletCreation } from '@actions'
import { merge } from 'rxjs'
import { filter, map } from 'rxjs/operators'
import { isActionOf } from 'typesafe-actions'
import { RootEpic } from '../root-epic'

export const setupPassphrase$: RootEpic = (action$, _, { generateMnemonic }) => {
  const createWallet$ = action$.pipe(filter(isActionOf(startWalletCreation)))

  const setPassphrase$ = createWallet$.pipe(
    map(() => setPassphrase({ passphrase: generateMnemonic() })),
  )

  return merge(setPassphrase$)
}
