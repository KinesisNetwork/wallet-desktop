import { saveAs } from 'file-saver'
import { startCase } from 'lodash'
import { merge } from 'rxjs'
import { filter, ignoreElements, map, tap, withLatestFrom } from 'rxjs/operators'

import { isActionOf } from 'typesafe-actions'

import {
  accountLoadRequest,
  addWallet,
  clearSignForms,
  deleteWallet as deleteWalletAction,
  selectWallet,
  tooManyFailedAttempts,
  unlockWalletFailure,
  unlockWalletFailureAlert,
  unlockWalletRequest,
  unlockWalletSuccess
} from '@actions'
import { RootEpic } from '@store'
import { getActivePublicKey } from '../selectors'

export const deleteWallet$: RootEpic = action$ => {
  const deleteWalletAction$ = action$.pipe(filter(isActionOf(deleteWalletAction)))

  const downloadPaperWallet$ = deleteWalletAction$.pipe(
    tap(({ payload }) => {
      const text = Object.entries(payload)
        .filter(([key]) => key !== 'encryptedPrivateKey')
        .sort((a, b) => (a[0] < b[0] ? -1 : 1))
        .map(([key, value]) => `${startCase(key)},${value}`)
        .join('\n')
      const blob = new Blob([text], { type: 'text/csv;charset=utf-8' })
      saveAs(blob, `${payload.accountName} Credentials.csv`)
    }),
    ignoreElements(),
  )

  return merge(downloadPaperWallet$)
}

export const changeWallet: RootEpic = (action$, state$) => {
  const switchWallet$ = action$.pipe(filter(isActionOf([selectWallet, addWallet])))

  const loadAccount$ = switchWallet$.pipe(
    withLatestFrom(state$),
    map(([_, state]) => accountLoadRequest(getActivePublicKey(state))),
  )

  const clearSignFields$ = switchWallet$.pipe(map(clearSignForms))

  return merge(loadAccount$, clearSignFields$)
}

export const unlockWallet$: RootEpic = (action$, state$, { decryptPrivateKey }) =>
  action$.pipe(
    filter(isActionOf(unlockWalletRequest)),
    withLatestFrom(state$),
    map(([action, state]) => {
      const now = action.payload

      const decryptedPrivateKey = decryptPrivateKey(
        state.wallets.activeWallet!.encryptedPrivateKey,
        state.passwords.currentInput,
      )

      return state.wallets.setAccountLocked.unlockTimestamp > now.valueOf()
        ? tooManyFailedAttempts(now)
        : decryptedPrivateKey !== ''
          ? unlockWalletSuccess({
            password: state.passwords.currentInput,
            decryptedPrivateKey,
            publicKey: state.wallets.activeWallet!.publicKey,
          })
          : unlockWalletFailure({
            now,
            maxAttempts: 10
          })
    }),
  )

export const walletLockFailure$: RootEpic = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(unlockWalletFailure)),
    withLatestFrom(state$),
    map(([action, state]) => {
      const failureAttemptTimestamps = state.wallets.failureAttemptTimestamps
      const numberOfFailedAttempts = failureAttemptTimestamps.length;

      return numberOfFailedAttempts > action.payload.maxAttempts
        ? tooManyFailedAttempts(failureAttemptTimestamps[numberOfFailedAttempts - 1])
        : unlockWalletFailureAlert()
    }),
  )

export const tooManyFailedAttempts$: RootEpic = (action$, _, { generalFailureAlert }) =>
  action$.pipe(
    filter(isActionOf(tooManyFailedAttempts)),
    map(() => generalFailureAlert('You have made too many failed attempts. You can try to unlock your account in 5 minutes.')),
    ignoreElements(),
  )

export const unlockWalletFailureAlert$: RootEpic = (action$, _, { generalFailureAlert }) =>
  action$.pipe(
    filter(isActionOf(unlockWalletFailureAlert)),
    map(() => generalFailureAlert('Incorrect Password')),
    ignoreElements(),
  )
