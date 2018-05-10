import { accountTransactionsLoaded, loadAccountTransactions, loadNextTransactionPage } from '@actions'
import { getTransactions } from '@services/kinesis'
import { Epic } from '@store'
import { fromPromise } from 'rxjs/observable/fromPromise'
import { filter, map, mergeMap, withLatestFrom } from 'rxjs/operators'
import { isActionOf } from 'typesafe-actions'

export const loadAccountTransactions$: Epic = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(loadAccountTransactions)),
    withLatestFrom(state$),
    mergeMap(([action, state]) => {
      return fromPromise(getTransactions(state.connections.currentConnection, action.payload))
        .pipe(
          map((transactions) => accountTransactionsLoaded(transactions)),
        )
      },
    ),
  )

export const loadNextPage$: Epic = (action$) =>
  action$.pipe(
    filter(isActionOf(accountTransactionsLoaded)),
    map(() => loadNextTransactionPage()),
  )
