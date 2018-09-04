import { saveAs } from 'file-saver'
import { startCase } from 'lodash'
import { merge } from 'rxjs'
import { filter, ignoreElements, map, tap, withLatestFrom } from 'rxjs/operators'

import { isActionOf } from 'typesafe-actions'

import {
  accountLoadRequest,
  addWallet,
  clearSignForms,
  clearWalletFailures,
  deleteWallet as deleteWalletAction,
  selectWallet,
  tooManyFailuresMessage,
  unlockWalletFailure,
  unlockWalletRequest,
  unlockWalletSuccess,
} from '@actions'
import { RootEpic } from '@store'
import { getActivePublicKey } from '../selectors'
import { failureAttemptHandler } from './utils'

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
    map(([_, state]) => {
      const now = Date.now()
      if (failureAttemptHandler(state.wallets.failureAttemptTimestamps, now).afterLockInTime) {
        return clearWalletFailures()
      } else if (failureAttemptHandler(state.wallets.failureAttemptTimestamps, now).withinLockInTime) {
        return tooManyFailuresMessage()
      }

      const decryptedPrivateKey = decryptPrivateKey(
        state.wallets.activeWallet!.encryptedPrivateKey,
        state.passwords.currentInput,
      )

      return decryptedPrivateKey !== ''
        ? unlockWalletSuccess({
          password: state.passwords.currentInput,
          decryptedPrivateKey,
          publicKey: state.wallets.activeWallet!.publicKey,
        })
        : unlockWalletFailure(now)
    }),
  )

export const walletLockFailure$: RootEpic = (action$, _, { generalFailureAlert }) =>
  action$.pipe(
    filter(isActionOf(unlockWalletFailure)),
    map(() => generalFailureAlert('Incorrect Password')),
    ignoreElements(),
  )

export const tooManyFailuresMessage$: RootEpic = (action$, _, { generalFailureAlert }) =>
  action$.pipe(
    filter(isActionOf(tooManyFailuresMessage)),
    map(() => generalFailureAlert('Too many failed attempts')),
    ignoreElements(),
  )

