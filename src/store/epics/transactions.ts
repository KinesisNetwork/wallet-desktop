import { accountTransactionsLoaded, loadAccountTransactions, loadNextTransactionPage } from '@actions'
import { getTransactions } from '@services/kinesis'
import { OurEpic } from '@store'
import { fromPromise } from 'rxjs/observable/fromPromise'
import { delay, filter, map, mergeMap, withLatestFrom } from 'rxjs/operators'
import { isActionOf } from 'typesafe-actions'

export const loadAccountTransactions$: OurEpic = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(loadAccountTransactions)),
    delay(500),
    withLatestFrom(state$),
    mergeMap(([action, state]) => {
      return fromPromise(getTransactions(state.connections.currentConnection, action.payload))
        .pipe(
          map((transactions) => accountTransactionsLoaded(transactions)),
        )
      },
    ),
  )

export const loadNextPage$: OurEpic = (action$) =>
  action$.pipe(
    filter(isActionOf(accountTransactionsLoaded)),
    map(() => loadNextTransactionPage()),
  )
