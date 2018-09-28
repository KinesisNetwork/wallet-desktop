import { filter, map, withLatestFrom } from 'rxjs/operators'
import { isActionOf } from 'typesafe-actions'

import { login, tooManyFailedAttempts, unlockWalletFailure, unlockWalletRequest } from '@actions'
import { RootEpic } from '@store'

export const unlockWallet$: RootEpic = (action$, state$, { decryptWithPassword }) =>
  action$.pipe(
    filter(isActionOf(unlockWalletRequest)),
    withLatestFrom(state$),
    map(([{ payload: now }, state]) => {
      const password = state.wallet.passwords.currentInput
      const didLogin = decryptWithPassword(state.wallet.persisted.encryptedPassphrase, password)

      return state.wallet.persisted.setAccountLocked.unlockTimestamp > now.valueOf()
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
      const failureAttemptTimestamps = state.wallet.persisted.failureAttemptTimestamps
      const numberOfFailedAttempts = failureAttemptTimestamps.length
      return numberOfFailedAttempts > action.payload.maxAttempts
    }),
    map(([_, state]) => {
      const failureAttemptTimestamps = state.wallet.persisted.failureAttemptTimestamps
      const numberOfFailedAttempts = failureAttemptTimestamps.length
      return tooManyFailedAttempts(failureAttemptTimestamps[numberOfFailedAttempts - 1])
    }),
  )
