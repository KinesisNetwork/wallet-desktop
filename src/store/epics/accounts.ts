import {
  accountLoadFailure,
  accountLoadRequest,
  accountLoadSuccess,
  accountTransactionsLoaded,
  selectConnectedCurrency,
  setActiveAccount,
  unlockWalletNew,
} from '@actions'
import { getActiveAccount, getLoginState } from '@selectors'
import { RootEpic, RootState } from '@store'
import { RootRoutes } from '@types'
import { from, interval, merge, of } from 'rxjs'
import {
  catchError,
  distinctUntilChanged,
  filter,
  map,
  pluck,
  startWith,
  switchMap,
  takeUntil,
  takeWhile,
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
  const invalidatePoll$ = merge(accountLoadRequest$)

  const accountLoadPoll$ = accountLoadRequest$.pipe(
    switchMap(action =>
      interval(20000).pipe(
        takeUntil(invalidatePoll$),
        startWith(0),
        withLatestFrom(state$),
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
      ),
    ),
  )

  return accountLoadPoll$
}

export const initiateLoadRequest$: RootEpic = (action$, state$) => {
  const initiateActions$ = action$.pipe(
    filter(isActionOf([selectConnectedCurrency, unlockWalletNew, setActiveAccount])),
  )

  const stateStarter$ = state$.pipe(
    takeWhile(state => getLoginState(state.wallet)),
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
