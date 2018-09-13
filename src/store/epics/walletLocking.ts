import { merge } from 'rxjs'
import { filter, map, withLatestFrom } from 'rxjs/operators'

import { isActionOf } from 'typesafe-actions'

import {
  accountLoadRequest,
  addWallet,
  clearSignForms,
  login,
  selectWallet,
  tooManyFailedAttempts,
  unlockWalletFailure,
  unlockWalletRequest,
} from '@actions'
import { getActiveAccount } from '@selectors'
import { RootEpic } from '@store'

// export const deleteWallet$: RootEpic = action$ => {
//   const deleteWalletAction$ = action$.pipe(filter(isActionOf(deleteWalletAction)))

//   const downloadPaperWallet$ = deleteWalletAction$.pipe(
//     tap(({ payload }) => {
//       const text = Object.entries(payload)
//         .filter(([key]) => key !== 'encryptedPrivateKey')
//         .sort((a, b) => (a[0] < b[0] ? -1 : 1))
//         .map(([key, value]) => `${startCase(key)},${value}`)
//         .join('\n')
//       const blob = new Blob([text], { type: 'text/csv;charset=utf-8' })
//       saveAs(blob, `${payload.accountName} Credentials.csv`)
//     }),
//     ignoreElements(),
//   )

//   return merge(downloadPaperWallet$)
// }

export const changeWallet: RootEpic = (action$, state$) => {
  const switchWallet$ = action$.pipe(filter(isActionOf([selectWallet, addWallet])))

  const loadAccount$ = switchWallet$.pipe(
    withLatestFrom(state$),
    map(([_, state]) => accountLoadRequest(getActiveAccount(state.wallet).keypair.publicKey())),
  )

  const clearSignFields$ = switchWallet$.pipe(map(clearSignForms))

  return merge(loadAccount$, clearSignFields$)
}

export const unlockWallet$: RootEpic = (action$, state$, { decryptWithPassword }) =>
  action$.pipe(
    filter(isActionOf(unlockWalletRequest)),
    withLatestFrom(state$),
    map(([{ payload: now }, state]) => {
      const password = state.passwords.currentInput
      const didLogin = decryptWithPassword(state.wallet.persisted.encryptedPassphrase, password)

      return state.wallets.setAccountLocked.unlockTimestamp > now.valueOf()
        ? tooManyFailedAttempts(now)
        : didLogin !== ''
          ? login({ password })
          : unlockWalletFailure({
              now,
              maxAttempts: 10,
            })
    }),
  )

export const walletLockFailure$: RootEpic = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(unlockWalletFailure)),
    withLatestFrom(state$),
    filter(([action, state]) => {
      const failureAttemptTimestamps = state.wallets.failureAttemptTimestamps
      const numberOfFailedAttempts = failureAttemptTimestamps.length
      return numberOfFailedAttempts > action.payload.maxAttempts
    }),
    map(([_, state]) => {
      const failureAttemptTimestamps = state.wallets.failureAttemptTimestamps
      const numberOfFailedAttempts = failureAttemptTimestamps.length
      return tooManyFailedAttempts(failureAttemptTimestamps[numberOfFailedAttempts - 1])
    }),
  )
