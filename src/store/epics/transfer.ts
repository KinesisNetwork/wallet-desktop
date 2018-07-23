import {
  accountLoadRequest,
  transactionFailed,
  transactionRequest,
  transactionSuccess,
  transferRequest,
} from '@actions'
import { generalFailureAlert, generalSuccessAlert } from '@helpers/alert'
import { getTransactionErrorMessage } from '@services/kinesis'
import { createKinesisTransfer, submitSignedTransaction } from '@services/transfer'
import { Epic, RootState } from '@store'
import { Connection, Wallet } from '@types'
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

// TODO: these should be selectors like from reselect
function getActiveKeys(state: RootState): { publicKey: string; privateKey: string } {
  const sourceWallet = state.wallets.activeWallet as Wallet
  const privateKey = state.passwords.livePasswords[sourceWallet.publicKey].privateKey
  return { publicKey: sourceWallet.publicKey, privateKey }
}

function getCurrentConnection(state: RootState): Connection {
  return state.connections.currentConnection
}

export const transferRequest$: Epic = (action$, state$) =>
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

export const transactionSubmission$: Epic = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(transactionRequest)),
    mergeMap(({ payload }) =>
      fromPromise(submitSignedTransaction(getCurrentConnection(state$.value), payload)).pipe(
        map(transactionSuccess),
        catchError(err => of(transactionFailed(err))),
      ),
    ),
  )

export const transactionSuccess$: Epic = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(transactionSuccess)),
    flatMap(() => generalSuccessAlert('The transfer was successful.')),
    map(() => accountLoadRequest(getActiveKeys(state$.value).publicKey)),
  )

export const transactionFailed$: Epic = action$ =>
  action$.pipe(
    filter(isActionOf(transactionFailed)),
    map(({ payload }) => generalFailureAlert(getTransactionErrorMessage(payload))),
    ignoreElements(),
  )
