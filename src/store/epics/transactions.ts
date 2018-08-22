import { filter, map, pluck, switchMap, withLatestFrom } from 'rxjs/operators'
import { isActionOf } from 'typesafe-actions'

import { accountTransactionsLoaded, loadAccountTransactions, loadNextTransactionPage } from '@actions'
import { RootAction, RootEpic } from '@store'

export const loadTransactionsForAccount: RootEpic = (action$, state$, { getCurrentConnection, getTransactions, withPolling }) => {
  const loadAccountTransactions$ = action$.pipe(
    filter(isActionOf(loadAccountTransactions)),
  )

  return loadAccountTransactions$.pipe(
    withPolling(350, 20000),
    pluck<RootAction, string>('payload'),
    withLatestFrom(state$),
    switchMap(([ publicKey, state ]) => getTransactions(getCurrentConnection(state), publicKey)),
    map(accountTransactionsLoaded),
  )
}

export const loadNextPage: RootEpic = (action$) =>
  action$.pipe(
    filter(isActionOf(accountTransactionsLoaded)),
    map(() => loadNextTransactionPage()),
  )
