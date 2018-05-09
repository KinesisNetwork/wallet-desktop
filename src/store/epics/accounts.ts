import { accountLoadFailure, accountLoadRequest, accountLoadSuccess, accountIsLoading } from '@actions'
import { loadAccount } from '@services/accounts'
import { Epic } from '@store'
import { of, merge } from 'rxjs'
import { fromPromise } from 'rxjs/observable/fromPromise'
import { catchError, filter, map, mergeMap, withLatestFrom, distinctUntilChanged } from 'rxjs/operators'
import { isActionOf } from 'typesafe-actions'

export const loadAccount$: Epic = (action$, state$) => {
  const accountLoadRequest$ = action$.pipe(
    filter(isActionOf(accountLoadRequest)),
    distinctUntilChanged((prev, curr) => prev.payload === curr.payload),
    map(({ payload }) => payload),
  )

  const accountIsLoading$ = accountLoadRequest$.pipe(
    map(() => accountIsLoading())
  )

  const accountLoad$ = accountLoadRequest$.pipe(
    withLatestFrom(state$),
    mergeMap(
      ([publicKey, state]) => fromPromise(loadAccount(publicKey, state.connections.currentConnection))
        .pipe(
          map((response) => accountLoadSuccess(response)),
          catchError((err) => of(accountLoadFailure(err))),
      )
    ),
  )

  return merge(accountIsLoading$, accountLoad$)
}
