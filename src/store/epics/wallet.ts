import {
  createPassphrase,
  finaliseWalletCreation,
  initialiseWallet,
  login,
  startWalletCreation,
  unlockWalletNew,
} from '@actions'
import { PersistedAccount, WalletAccount } from '@types'
import { merge } from 'rxjs'
import { filter, map, withLatestFrom } from 'rxjs/operators'
import { isActionOf } from 'typesafe-actions'
import { RootEpic } from '../root-epic'

export const setupPassphrase$: RootEpic = (action$, _, { generateMnemonic }) => {
  const createWallet$ = action$.pipe(filter(isActionOf(startWalletCreation)))

  const setPassphrase$ = createWallet$.pipe(
    map(() => createPassphrase({ passphrase: generateMnemonic() })),
  )

  return merge(setPassphrase$)
}

export const initialiseWallet$: RootEpic = (
  action$,
  state$,
  { getKeypairFromMnemonic, encryptWithPassword },
) => {
  const finaliseWalletCreation$ = action$.pipe(filter(isActionOf(finaliseWalletCreation)))

  const setupWallet$ = finaliseWalletCreation$.pipe(
    withLatestFrom(state$),
    map(([_, state]) => {
      const {
        passphrase,
        createForm: { password },
      } = state.createWallet

      const keypair = getKeypairFromMnemonic(passphrase, 0)
      const createdAccount: PersistedAccount = {
        encryptedSecret: encryptWithPassword(keypair.secret(), password),
        name: 'Account 1',
      }

      const encryptedPassphrase = encryptWithPassword(passphrase, password)
      const walletName = state.createWallet.createForm.name

      return initialiseWallet({ createdAccount, encryptedPassphrase, walletName })
    }),
  )

  const loginToWallet$ = finaliseWalletCreation$.pipe(
    withLatestFrom(state$),
    map(([_, state]) => {
      const password = state.createWallet.createForm.password
      return login({ password })
    }),
  )

  return merge(setupWallet$, loginToWallet$)
}

// This assumes that the password has already been validated
// And that the there is a wallet unlock success
export const login$: RootEpic = (action$, state$, { decryptWithPassword, getKeypairFromSecret }) =>
  action$.pipe(
    filter(isActionOf(login)),
    withLatestFrom(state$),
    map(([action, state]) => {
      const {
        persisted: { createdAccounts, encryptedPassphrase },
      } = state.wallet
      const password = action.payload.password

      const unlockedAccounts = createdAccounts.map<WalletAccount>(account => ({
        name: account.name,
        keypair: getKeypairFromSecret(decryptWithPassword(account.encryptedSecret, password)),
      }))

      const passphrase = decryptWithPassword(encryptedPassphrase, password)

      return unlockWalletNew({ accounts: unlockedAccounts, passphrase })
    }),
  )
