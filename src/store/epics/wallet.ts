import {
  addAccountToWallet,
  addNextAccountFromSeedphrase,
  createPassphrase,
  finaliseWalletCreation,
  importAccountFromSecret,
  initialiseWallet,
  login,
  startWalletCreation,
  unlockWalletNew,
} from '@actions'
import { PersistedAccount, WalletAccount } from '@types'
import { REHYDRATE } from 'redux-persist'
import { merge } from 'rxjs'
import { filter, map, mapTo, switchMap, withLatestFrom } from 'rxjs/operators'
import { isActionOf } from 'typesafe-actions'
import { RehydrateAction, RootAction } from '../root-action'
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
        imported: false,
      }

      const encryptedPassphrase = encryptWithPassword(passphrase, password)
      const walletName = state.createWallet.createForm.name

      return initialiseWallet({ createdAccount, encryptedPassphrase, walletName, password })
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

export const addAccountToWalletFromSeedphrase$: RootEpic = (
  action$,
  state$,
  { getKeypairFromMnemonic, encryptWithPassword },
) =>
  action$.pipe(
    filter(isActionOf(addNextAccountFromSeedphrase)),
    withLatestFrom(state$),
    map(([_, state]) => {
      const password = state.passwords.lastSuccessfulInput
      const {
        persisted,
        passphrase,
      } = state.wallet

      const existingAccountsCount = persisted.createdAccounts.filter(a => a.imported === false).length

      const keypair = getKeypairFromMnemonic(passphrase, existingAccountsCount)
      const name = `Account ${persisted.createdAccounts.length + 1}`
      const persistedAccount: PersistedAccount = {
        name,
        encryptedSecret: encryptWithPassword(keypair.secret(), password),
        imported: false,
      }

      const walletAccount: WalletAccount = { name, keypair }

      return addAccountToWallet({persistedAccount, walletAccount})
    }),
  )

export const importAccountFromSecret$: RootEpic = (
  action$,
  state$,
  { getKeypairFromSecret, encryptWithPassword },
) =>
  action$.pipe(
    filter(isActionOf(importAccountFromSecret)),
    withLatestFrom(state$),
    map(([{payload}, state]) => {
      const password = state.passwords.lastSuccessfulInput
      const { persisted } = state.wallet

      const keypair = getKeypairFromSecret(payload.secret)
      const name = `Account ${persisted.createdAccounts.length + 1}`
      const persistedAccount: PersistedAccount = {
        name,
        encryptedSecret: encryptWithPassword(keypair.secret(), password),
        imported: true,
      }

      const walletAccount: WalletAccount = { name, keypair }

      return addAccountToWallet({persistedAccount, walletAccount})
    }),
  )

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

// Is run as a helper when developing
export const devHelper$: RootEpic = action$ =>
  action$.pipe(
    filter(isRehydrate('dev')),
    filter(action => action.payload && action.payload.passwords.currentInput !== ''),
    // Wait until both rehydrates
    switchMap(action =>
      action$.pipe(
        filter(isRehydrate('secure')),
        mapTo(action),
      ),
    ),
    map(action => login({ password: action.payload.passwords.currentInput })),
  )

function isRehydrate(key: string): (action: RootAction) => action is RehydrateAction {
  return (action): action is RehydrateAction => action.type === REHYDRATE && action.key === key
}
