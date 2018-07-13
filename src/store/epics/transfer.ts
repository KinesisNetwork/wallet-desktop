
import { of } from 'rxjs'
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

import { OurEpic } from '@store'
import {
  accountLoadRequest,
  transactionFailed,
  transactionRequest,
  transactionSuccess,
  transferRequest,
} from '@actions'

export const transferRequest$: OurEpic = (action$, state$, { createKinesisTransfer, getActiveKeys, getCurrentConnection }) =>
  action$.pipe(
    filter(isActionOf(transferRequest)),
    map(({ payload }) => payload),
    withLatestFrom(state$),
    mergeMap(([request, state]) =>
      fromPromise(
        createKinesisTransfer(
          getActiveKeys(state).privateKey,
          getCurrentConnection(state),
          request,
        ),
      ).pipe(
        map(transactionRequest),
        catchError(err => of(transactionFailed(err))),
      ),
    ),
  )

export const transactionSubmission$: OurEpic = (action$, state$, { getCurrentConnection, submitSignedTransaction }) =>
  action$.pipe(
    filter(isActionOf(transactionRequest)),
    mergeMap(({ payload }) =>
      fromPromise(submitSignedTransaction(getCurrentConnection(state$.value), payload)).pipe(
        map(transactionSuccess),
        catchError(err => of(transactionFailed(err))),
      ),
    ),
  )

export const transactionSuccess$: OurEpic = (action$, state$, { generalSuccessAlert, getActiveKeys }) =>
  action$.pipe(
    filter(isActionOf(transactionSuccess)),
    flatMap(() => generalSuccessAlert('The transfer was successful.')),
    map(() => accountLoadRequest(getActiveKeys(state$.value).publicKey)),
  )

export const transactionFailed$: OurEpic = (action$, _, { generalFailureAlert, getTransactionErrorMessage }) =>
  action$.pipe(
    filter(isActionOf(transactionFailed)),
    map(({ payload }) => generalFailureAlert(getTransactionErrorMessage(payload))),
    ignoreElements(),
  )
