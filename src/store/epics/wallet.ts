import { sendAnalyticsEvent } from '@services/analytics'
import { push } from 'connected-react-router'
import { REHYDRATE } from 'redux-persist'
import { merge } from 'rxjs'
import { filter, map, mapTo, switchMap, withLatestFrom } from 'rxjs/operators'
import { isActionOf } from 'typesafe-actions'

import {
  addAccountToWallet,
  addNextAccountFromSeedphrase,
  createPassphrase,
  finaliseWalletCreation,
  importAccountFromSecret,
  initialiseWallet,
  login as loginAction,
  showNotification,
  startWalletCreation,
  unlockWalletNew,
} from '@actions'
import {
  GoogleAnalyticsAction,
  GoogleAnalyticsLabel,
  NotificationType,
  PersistedAccount,
  RootRoutes,
  WalletAccount,
} from '@types'
import { RehydrateAction, RootAction } from '../root-action'
import { RootEpic } from '../root-epic'

export const setupPassphrase$: RootEpic = (action$, _, { generateMnemonic }) => {
  const createWallet$ = action$.pipe(filter(isActionOf(startWalletCreation)))

  const setPassphrase$ = createWallet$.pipe(
    map(() => createPassphrase({ passphrase: generateMnemonic() })),
  )

  return setPassphrase$
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
      return loginAction({ password })
    }),
  )

  return merge(setupWallet$, loginToWallet$)
}

export const addAccountToWalletFromSeedphrase$: RootEpic = (
  action$,
  state$,
  { getKeypairFromMnemonic, encryptWithPassword },
) => {
  const addNextAccount$ = action$.pipe(
    filter(isActionOf(addNextAccountFromSeedphrase)),
    withLatestFrom(state$),
    map(([_, { login, wallet: { passphrase, persisted } }]) => ({
      password: login.input.lastSuccessfulInput,
      passphrase,
      persisted,
    })),
    map(({ password, passphrase, persisted }) => {
      const { createdAccounts } = persisted
      const createdAccountsCount = createdAccounts.filter(a => !a.imported).length
      const existingAccountNames = createdAccounts.map(a => a.name)

      const keypair = getKeypairFromMnemonic(passphrase, createdAccountsCount)
      const name = `Account ${createdAccountsCount + 1}`
      const persistedAccount: PersistedAccount = {
        name,
        encryptedSecret: encryptWithPassword(keypair.secret(), password),
        imported: false,
      }

      const walletAccount: WalletAccount = { name, keypair }

      return { existingAccountNames, name, persistedAccount, walletAccount }
    }),
    map(({ existingAccountNames, name, persistedAccount, walletAccount }) => {
      return !existingAccountNames.includes(name)
        ? addAccountToWallet({ persistedAccount, walletAccount })
        : showNotification({
            type: NotificationType.error,
            message: `Account "${name}" already exists. Please rename this account before generating new account`,
          })
    }),
  )

  return addNextAccount$
}

export const importAccountFromSecret$: RootEpic = (
  action$,
  state$,
  { getKeypairFromSecret, encryptWithPassword },
) => {
  const importAccount$ = action$.pipe(
    filter(isActionOf(importAccountFromSecret)),
    withLatestFrom(state$),
    map(([{ payload }, { login, wallet: { accounts, persisted } }]) => ({
      accounts,
      password: login.input.lastSuccessfulInput,
      payload,
      persisted,
    })),
    map(({ accounts, password, payload, persisted }) => {
      const importedAccountsCount = persisted.createdAccounts.filter(a => a.imported).length

      const keypair = getKeypairFromSecret(payload.secret)
      const name = `Imported ${importedAccountsCount + 1}`
      const encryptedSecret = encryptWithPassword(keypair.secret(), password)

      const persistedAccount: PersistedAccount = {
        name,
        encryptedSecret,
        imported: true,
      }

      const publicKey = keypair.publicKey()
      const walletAccount: WalletAccount = { name, keypair }

      const existingAccountName = persisted.createdAccounts.some(a => a.name === name)
      const existingAccount = accounts.find(({ keypair: kp }) => kp.publicKey() === publicKey)

      return { existingAccount, existingAccountName, name, persistedAccount, walletAccount }
    }),
    map(({ existingAccount, existingAccountName, name, persistedAccount, walletAccount }) => {
      return !existingAccountName
        ? !existingAccount
          ? addAccountToWallet({ persistedAccount, walletAccount })
          : showNotification({
              type: NotificationType.error,
              message: `Account "${existingAccount.name}" already exists based on this private key`,
            })
        : showNotification({
            type: NotificationType.error,
            message: `Account "${name}" already exists. Please rename this account before generating new account`,
          })
    }),
  )

  const dashboardRedirects$ = action$.pipe(
    filter(isActionOf(addAccountToWallet)),
    map(({ payload: { persistedAccount: { imported } } }) =>
      sendAnalyticsEvent({
        action: GoogleAnalyticsAction.click,
        label: imported
          ? `${GoogleAnalyticsLabel.importAccount} success`
          : `${GoogleAnalyticsLabel.addAccount} success`,
      }),
    ),
    mapTo(push(RootRoutes.dashboard) as any),
  )

  return merge(importAccount$, dashboardRedirects$)
}

// This assumes that the password has already been validated
// And that the there is a wallet unlock success
export const login$: RootEpic = (action$, state$, { decryptWithPassword, getKeypairFromSecret }) =>
  action$.pipe(
    filter(isActionOf(loginAction)),
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
    filter(action => action.payload && action.payload.login.input.currentInput !== ''),
    // Wait until both rehydrates
    switchMap(action =>
      action$.pipe(
        filter(isRehydrate('secure')),
        mapTo(action),
      ),
    ),
    map(action => loginAction({ password: action.payload.login.input.currentInput })),
  )

function isRehydrate(key: string): (action: RootAction) => action is RehydrateAction {
  return (action): action is RehydrateAction => action.type === REHYDRATE && action.key === key
}
