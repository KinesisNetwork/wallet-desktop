import { from, merge, of } from 'rxjs'
import { catchError, filter, map, mapTo, mergeMap, withLatestFrom } from 'rxjs/operators'
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
import { RootEpic } from '@store'
import { NotificationType } from '@types'

export const amountCalculations$: RootEpic = (action$, state$, { getCurrentConnection }) =>
  action$.pipe(
    filter(isActionOf(updateTransferForm)),
    filter(({ payload: { field } }) => field === 'amount'),
    filter(
      ({ payload: { newValue } }) => newValue === '' || /^[0-9]+(\.)?([0-9]{1,5})?$/.test(newValue),
    ),
    withLatestFrom(state$),
    mergeMap(([action, state]) => {
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
    mergeMap(([request, state]) =>
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
        mapTo(transactionSuccess()),
        catchError(err => of(transactionFailed(err))),
      ),
    ),
  )

export const transactionSuccess$: RootEpic = action$ =>
  action$.pipe(
    filter(isActionOf(transactionSuccess)),
    map(() =>
      showNotification({
        type: NotificationType.success,
        message: 'Transaction submitted successfully!',
      }),
    ),
  )

export const transactionFailed$: RootEpic = action$ =>
  action$.pipe(
    filter(isActionOf(transactionFailed)),
    map(() =>
      showNotification({
        type: NotificationType.error,
        message: 'Transaction error.',
      }),
    ),
  )
