import {
  accountLoadFailure,
  accountLoadRequest,
  accountLoadSuccess,
  accountTransactionsLoaded,
} from '@actions'
import { RootEpic } from '@store'
import { AccountPage, WalletView } from '@types'
import { from, interval, merge, of } from 'rxjs'
import {
  catchError,
  filter,
  map,
  mergeMap,
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
    state$.pipe(filter(state => state.view.walletView !== WalletView.dashboard)),
  )

  const accountLoadPoll$ = accountLoadRequest$.pipe(
    mergeMap(action =>
      interval(5000).pipe(
        startWith(0),
        withLatestFrom(state$),
        // Want to skip while not focused on dashboard page
        skipWhile(([_, state]) => state.accountPage.accountPage !== AccountPage.dashboard),
        switchMap(([_, state]) =>
          merge(
            from(loadAccount(action.payload, getCurrentConnection(state))).pipe(
              map(accountLoadSuccess),
              catchError(err => of(accountLoadFailure(err))),
            ),
            from(getTransactions(getCurrentConnection(state), action.payload)).pipe(
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
