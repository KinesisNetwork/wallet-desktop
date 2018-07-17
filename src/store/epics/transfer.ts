import { accountLoadRequest, transferFailed, transferRequest, transferSuccess } from '@actions'
import { generalSuccessAlert, transferFailureAlert } from '@helpers/alert'
import { transferKinesis } from '@services/transfer'
import { Epic } from '@store'
import { Wallet } from '@types'
import { of } from 'rxjs'
import { fromPromise } from 'rxjs/observable/fromPromise'
import { catchError, filter, ignoreElements, map, mergeMap, withLatestFrom } from 'rxjs/operators'
import { isActionOf } from 'typesafe-actions'

export const transferRequest$: Epic = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(transferRequest)),
    map(({ payload }) => payload),
    withLatestFrom(state$),
    mergeMap(
      ([request, state]) => {
        const sourceWallet = state.wallets.activeWallet as Wallet
        const privateKey = state.passwords.livePasswords[sourceWallet.publicKey].privateKey
        const connection = state.connections.currentConnection
        return fromPromise(transferKinesis(privateKey, connection, request))
          .pipe(
            map(() => transferSuccess(sourceWallet.publicKey)),
            catchError((err) => of(transferFailed(err))),
        )
      },
    ),
  )

export const transferSuccess$: Epic = (action$) =>
  action$.pipe(
    filter(isActionOf(transferSuccess)),
    mergeMap(({ payload }) => {
      return fromPromise(generalSuccessAlert('The transfer was successful.'))
        .pipe(
          map(() => accountLoadRequest(payload)),
      )
    }),
  )

export const transferFailed$: Epic = (action$) =>
  action$.pipe(
    filter(isActionOf(transferFailed)),
    map(({payload}) => fromPromise(transferFailureAlert(payload))),
    ignoreElements(),
  )
