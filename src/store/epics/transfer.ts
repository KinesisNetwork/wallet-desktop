import { merge, of } from 'rxjs'
import { fromPromise } from 'rxjs/observable/fromPromise'
import {
  catchError,
  filter,
  flatMap,
  ignoreElements,
  map,
  mergeMap,
  withLatestFrom,
} from 'rxjs/operators'
import { isActionOf } from 'typesafe-actions'

import {
  accountLoadRequest,
  transactionFailed,
  transactionRequest,
  transactionSuccess,
  transferRequest,
  updateFee,
  updateRemainingBalance,
  updateTransferForm,
} from '@actions'
import { getActiveAccount } from '@selectors'
import { getFeeInKinesis } from '@services/kinesis'
import { RootEpic } from '@store'

export const calculateFee$: RootEpic = (action$, state$, { getCurrentConnection }) =>
  action$.pipe(
    filter(isActionOf(updateTransferForm)),
    filter(({ payload }) => payload.field === 'amount'),
    withLatestFrom(state$),
    mergeMap(([action, state]) => {
      const amount = Number(action.payload.newValue)
      const fee$ = fromPromise(
        getFeeInKinesis(getCurrentConnection(state.connections), amount)
      )
      const updateFee$ = fee$.pipe(
          map(updateFee)
      )
      const calculateRemainingBalance$ = fee$.pipe(
        map((fee) => state.accounts.accountInfo.balance - (Number(fee) + amount) ),
        map(updateRemainingBalance)
      )
      return merge(updateFee$, calculateRemainingBalance$)
    }
    )
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
      fromPromise(
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
      fromPromise(
        submitSignedTransaction(getCurrentConnection(state$.value.connections), payload),
      ).pipe(
        map(transactionSuccess),
        catchError(err => of(transactionFailed(err))),
      ),
    ),
  )

export const transactionSuccess$: RootEpic = (action$, state$, { generalSuccessAlert }) =>
  action$.pipe(
    filter(isActionOf(transactionSuccess)),
    flatMap(() => generalSuccessAlert('The transfer was successful.')),
    map(() => accountLoadRequest(getActiveAccount(state$.value.wallet).keypair.publicKey())),
  )

export const transactionFailed$: RootEpic = (
  action$,
  _,
  { generalFailureAlert, getTransactionErrorMessage },
) =>
  action$.pipe(
    filter(isActionOf(transactionFailed)),
    map(({ payload }) => generalFailureAlert(getTransactionErrorMessage(payload))),
    ignoreElements(),
  )
