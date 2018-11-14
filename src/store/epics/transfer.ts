import { from, merge, of } from 'rxjs'
import { catchError, exhaustMap, filter, map, mergeMap, withLatestFrom } from 'rxjs/operators'
import { isActionOf } from 'typesafe-actions'

import {
  insufficientFunds,
  publicKeyValidation,
  showNotification,
  transactionFailed,
  transactionRequest,
  transactionSuccess,
  transferRequest,
  updateContactForm,
  updateFee,
  updateRemainingBalance,
  updateTransferForm,
} from '@actions'
import { getActiveAccount } from '@selectors'
import { getFeeInKinesis } from '@services/kinesis'
import { validateAmount } from '@services/util'
import { RootEpic } from '@store'
import { NotificationType, RootRoutes } from '@types'
import { replace } from 'connected-react-router'

export const amountCalculations$: RootEpic = (action$, state$, { getCurrentConnection }) => {
  const amountUpdate$ = action$.pipe(
    filter(isActionOf(updateTransferForm)),
    filter(({ payload: { field } }) => field === 'amount'),
    filter(({ payload: { newValue } }) => newValue === '' || validateAmount(newValue)),
    withLatestFrom(state$),
  )

  return amountUpdate$.pipe(
    exhaustMap(([action, state]) => {
      const amount = Number(action.payload.newValue)
      const fee$ = from(getFeeInKinesis(getCurrentConnection(state.connections), amount))
      const updateFee$ = fee$.pipe(map(updateFee))

      const calculateRemainingBalance$ = fee$.pipe(
        map(fee => state.accounts.accountInfo.balance - (Number(fee) + amount)),
      )
      const updateRemainingBalance$ = calculateRemainingBalance$.pipe(map(updateRemainingBalance))
      const insufficientFunds$ = calculateRemainingBalance$.pipe(
        map(remainingBalance => remainingBalance < 0),
        map(insufficientFunds),
      )
      return merge(updateFee$, updateRemainingBalance$, insufficientFunds$)
    }),
  )
}

export const publicKeyValidation$: RootEpic = (action$, _, { isValidPublicKey }) =>
  action$.pipe(
    filter(isActionOf(updateContactForm)),
    filter(({ payload: { field } }) => field === 'address'),
    map(action => publicKeyValidation(isValidPublicKey(action.payload.newValue))),
  )

export const transferRequest$: RootEpic = (
  action$,
  state$,
  { createKinesisTransfer, getCurrentConnection },
) =>
  action$.pipe(
    filter(isActionOf(transferRequest)),
    map(({ payload }) => payload),
    withLatestFrom(state$),
    exhaustMap(([request, state]) =>
      from(
        createKinesisTransfer(
          getActiveAccount(state.wallet).keypair.secret(),
          getCurrentConnection(state.connections),
          request,
        ),
      ).pipe(
        map(transactionRequest),
        catchError(err => of(transactionFailed(err))),
      ),
    ),
  )

export const transactionSubmission$: RootEpic = (
  action$,
  state$,
  { getCurrentConnection, submitSignedTransaction },
) =>
  action$.pipe(
    filter(isActionOf(transactionRequest)),
    mergeMap(({ payload }) =>
      from(submitSignedTransaction(getCurrentConnection(state$.value.connections), payload)).pipe(
        map(transactionSuccess),
        catchError(err => of(transactionFailed(err))),
      ),
    ),
  )

export const transactionSuccess$: RootEpic = (action$, state$, { sendAnalyticsEvent }) =>
  action$.pipe(
    filter(isActionOf(transactionSuccess)),
    withLatestFrom(state$),
    map(([_, state]) =>
      sendAnalyticsEvent({
        action: 'transfer',
        category: state.connections.currentCurrency,
        label: 'Funds transferred from wallet',
        value: (
          state.accounts.accountInfo.balance - state.transfer.formMeta.remainingBalance
        ).toFixed(5),
      }),
    ),
    mergeMap(() =>
      merge(
        of(replace(RootRoutes.dashboard) as any),
        of(
          showNotification({
            type: NotificationType.success,
            message: 'Transaction submitted successfully!',
          }),
        ),
      ),
    ),
  )

export const transactionFailed$: RootEpic = (action$, state$, { sendAnalyticsEvent }) =>
  action$.pipe(
    filter(isActionOf(transactionFailed)),
    withLatestFrom(state$),
    map(([_, state]) =>
      sendAnalyticsEvent({
        action: 'transfer',
        category: state.connections.currentCurrency,
        label: 'Fund transfer from wallet failed',
        value: (
          state.accounts.accountInfo.balance - state.transfer.formMeta.remainingBalance
        ).toFixed(5),
      }),
    ),
    map(() =>
      showNotification({
        type: NotificationType.error,
        message: 'Transaction error.',
      }),
    ),
  )
