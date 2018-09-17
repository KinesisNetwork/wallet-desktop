import {
  accountLoadFailure,
  accountLoadRequest,
  accountLoadSuccess,
  accountTransactionsLoaded,
  selectConnectedCurrency,
  unlockWalletNew,
} from '@actions'
import { getActiveAccount } from '@selectors'
import { RootEpic, RootState } from '@store'
import { RootRoutes } from '@types'
import { from, interval, merge, of } from 'rxjs'
import {
  catchError,
  distinctUntilChanged,
  filter,
  map,
  mergeMap,
  pluck,
  skipWhile,
  startWith,
  switchMap,
  takeUntil,
  withLatestFrom,
} from 'rxjs/operators'
import { isActionOf } from 'typesafe-actions'

export const loadAccount$: RootEpic = (
  action$,
  state$,
  { getCurrentConnection, loadAccount, getTransactions },
) => {
  const accountLoadRequest$ = action$.pipe(filter(isActionOf(accountLoadRequest)))
  // If there are other things that would invalidate the polling, should add to here
  const invalidatePoll$ = merge(
    accountLoadRequest$,
    state$.pipe(filter(({ router }) => !router.location.pathname.startsWith(RootRoutes.dashboard))),
  )

  const accountLoadPoll$ = accountLoadRequest$.pipe(
    mergeMap(action =>
      interval(20000).pipe(
        startWith(0),
        withLatestFrom(state$),
        // Want to skip while not focused on dashboard page
        skipWhile(([_, state]) => state.router.location.pathname !== RootRoutes.dashboard),
        switchMap(([_, { connections }]) =>
          merge(
            from(loadAccount(action.payload, getCurrentConnection(connections))).pipe(
              map(accountLoadSuccess),
              catchError(err => of(accountLoadFailure(err))),
            ),
            from(getTransactions(getCurrentConnection(connections), action.payload)).pipe(
              map(accountTransactionsLoaded),
            ),
          ),
        ),
        takeUntil(invalidatePoll$),
      ),
    ),
  )

  return accountLoadPoll$
}

export const initiateLoadRequest$: RootEpic = (action$, state$) => {
  const initiateActions$ = action$.pipe(
    filter(isActionOf([selectConnectedCurrency, unlockWalletNew])),
  )

  const stateStarter$ = state$.pipe(
    pluck<RootState, string>('router', 'location', 'pathname'),
    filter(path => path === RootRoutes.dashboard),
    distinctUntilChanged(),
  )

  return merge(initiateActions$, stateStarter$).pipe(
    withLatestFrom(state$),
    map(([_, state]) => getActiveAccount(state.wallet)),
    map(({ keypair }) => accountLoadRequest(keypair.publicKey())),
  )
}
