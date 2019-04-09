import { replace } from 'connected-react-router'
import { from, merge, of } from 'rxjs'
import {
  catchError,
  exhaustMap,
  filter,
  map,
  mergeMap,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators'
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
  updateMinimumBalance,
  updateRemainingBalance,
  updateTransferForm,
} from '@actions'
import { getActiveAccount } from '@selectors'
import { validateAmount } from '@services/util'
import { RootEpic } from '@store'
import { GoogleAnalyticsAction, GoogleAnalyticsLabel, NotificationType, RootRoutes } from '@types'

export const amountCalculations$: RootEpic = (
  action$,
  state$,
  { getCurrentConnection, getFeeInKinesis, getMinBalanceInKinesis },
) => {
  const amountUpdate$ = action$.pipe(
    filter(isActionOf(updateTransferForm)),
    filter(({ payload: { field } }) => field === 'amount'),
    filter(({ payload: { newValue } }) => newValue === '' || validateAmount(newValue)),
    map(({ payload: { newValue } }) => parseFloat(newValue) || 0),
  )

  const accountConnectionTransferState$ = state$.pipe(
    map(({ accounts, connections, transfer }) => {
      const { balance } = accounts.accountInfo
      const { fee } = transfer.formData
      const currentConnection = getCurrentConnection(connections)

      return {
        balance,
        currentConnection,
        fee,
      }
    }),
  )

  const amountUpdatesWithState$ = amountUpdate$.pipe(
    withLatestFrom(accountConnectionTransferState$),
  )

  const fee$ = amountUpdatesWithState$.pipe(
    switchMap(([amount, { currentConnection }]) =>
      from(getFeeInKinesis(currentConnection, amount)),
    ),
  )
  const updateFee$ = fee$.pipe(map(updateFee))

  const minBalance$ = amountUpdatesWithState$.pipe(
    switchMap(([, { currentConnection }]) => from(getMinBalanceInKinesis(currentConnection))),
  )
  const updateMinimumBalance$ = minBalance$.pipe(map(updateMinimumBalance))

  const remainingBalance$ = amountUpdatesWithState$.pipe(
    map(([amount, { balance, fee }]) => balance - (Number(fee) + amount)),
  )

  const updateRemainingBalance$ = remainingBalance$.pipe(map(updateRemainingBalance))

  const insufficientFunds$ = remainingBalance$.pipe(
    withLatestFrom(minBalance$),
    map(([remainingBalance, minBalance]) => remainingBalance < minBalance),
    map(insufficientFunds),
  )

  return merge(updateRemainingBalance$, updateFee$, updateMinimumBalance$, insufficientFunds$)
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
    withLatestFrom(state$),
    mergeMap(([{ payload }, { transfer }]) =>
      from(submitSignedTransaction(getCurrentConnection(state$.value.connections), payload)).pipe(
        map(() => transactionSuccess(transfer.formData)),
        catchError(err => of(transactionFailed(err))),
      ),
    ),
  )

export const transactionSuccess$: RootEpic = (action$, state$, { sendAnalyticsEvent }) =>
  action$.pipe(
    filter(isActionOf(transactionSuccess)),
    withLatestFrom(state$),
    tap(([{ payload: { amount, fee } }, { connections }]) =>
      sendAnalyticsEvent({
        action: GoogleAnalyticsAction.transfer,
        category: connections.currentCurrency,
        label: `${GoogleAnalyticsLabel.transferFund} success`,
        value: (Number(amount) + Number(fee)).toFixed(5),
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
    tap(([_, { connections }]) =>
      sendAnalyticsEvent({
        action: GoogleAnalyticsAction.transfer,
        category: connections.currentCurrency,
        label: `${GoogleAnalyticsLabel.transferFund} failure`,
      }),
    ),
    mergeMap(([{ payload }]) =>
      merge(
        of(replace(RootRoutes.dashboard) as any),
        of(
          showNotification({
            type:
              payload.name === 'HorizonError' ? NotificationType.warning : NotificationType.error,
            message: payload.message || 'Transaction error.',
          }),
        ),
      ),
    ),
  )
