import { accountLoadFailure, accountLoad, accountLoadSuccess, accountIsLoading } from '@actions'
import { loadAccount } from '@services/accounts'
import { Epic } from '@store'
import { of, merge } from 'rxjs'
import { fromPromise } from 'rxjs/observable/fromPromise'
import { catchError, filter, map, mergeMap, withLatestFrom, throttleTime } from 'rxjs/operators'
import { isActionOf } from 'typesafe-actions'

export const loadAccount$: Epic = (action$, state$) => {
  const accountLoad$ = action$.pipe(
    filter(isActionOf(accountLoad)),
    throttleTime(1000),
    map(({ payload }) => payload),
  )

  const accountIsLoading$ = accountLoad$.pipe(
    map(() => accountIsLoading())
  )

  const accountLoadRequest$ = accountLoad$.pipe(
    withLatestFrom(state$),
    mergeMap(
      ([publicKey, state]) => fromPromise(loadAccount(publicKey, state.connections.currentConnection))
        .pipe(
          map((response) => accountLoadSuccess(response)),
          catchError((err) => of(accountLoadFailure(err))),
      )
    ),
  )

  return merge(accountIsLoading$, accountLoadRequest$)
}
