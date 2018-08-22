import { merge, of } from 'rxjs'
import { fromPromise } from 'rxjs/observable/fromPromise'
import { catchError, filter, map, pluck, switchMap, withLatestFrom } from 'rxjs/operators'
import { isActionOf } from 'typesafe-actions'

import {
  accountIsLoading,
  accountLoadFailure,
  accountLoadRequest,
  accountLoadSuccess,
  loadAccountTransactions,
} from '@actions'
import { RootAction, RootEpic } from '@store'

export const loadAccount$: RootEpic = (action$, state$, { getCurrentConnection, loadAccount, withPolling }) => {
  const accountLoadRequest$ = action$.pipe(
    filter(isActionOf(accountLoadRequest)),
  )

  const accountIsLoading$ = accountLoadRequest$.pipe(
    map(() => accountIsLoading()),
  )

  const accountLoad$ = accountLoadRequest$.pipe(
    withPolling(350, 20000),
    pluck<RootAction, string>('payload'),
    withLatestFrom(state$),
    switchMap(([ publicKey, state ]) =>
      fromPromise(loadAccount(publicKey, getCurrentConnection(state))).pipe(
        map(accountLoadSuccess),
        catchError((err) => of(accountLoadFailure(err))),
      ),
    )
  )

  const loadAccountTransactions$ = accountLoadRequest$.pipe(
    pluck<RootAction, string>('payload'),
    map(loadAccountTransactions),
  )

  return merge(accountIsLoading$, accountLoad$, loadAccountTransactions$)
}
