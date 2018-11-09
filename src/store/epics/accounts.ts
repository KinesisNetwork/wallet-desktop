import { push } from 'connected-react-router'
import { from, merge, of, pipe, timer } from 'rxjs'
import {
  catchError,
  distinctUntilChanged,
  filter,
  map,
  mapTo,
  pluck,
  switchMap,
  takeUntil,
  takeWhile,
  withLatestFrom,
} from 'rxjs/operators'
import { isActionOf } from 'typesafe-actions'

import {
  accountLoadFailure,
  accountLoadRequest,
  accountLoadSuccess,
  accountTransactionsLoaded,
  selectConnectedCurrency,
  setActiveAccount,
  showNotification,
  transactionSuccess,
  unlockWalletNew,
  updateAccountName,
} from '@actions'
import { RootEpic, RootState } from '@store'
import { NotificationType, RootRoutes } from '@types'

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
      timer(0, 10000).pipe(
        takeUntil(invalidatePoll$),
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

export const setActiveAccount$: RootEpic = action$ =>
  action$.pipe(
    filter(isActionOf(setActiveAccount)),
    mapTo(push(RootRoutes.dashboard) as any),
  )

export const initiateLoadRequest$: RootEpic = (
  action$,
  state$,
  { getActiveAccount, getLoginState },
) => {
  const initiateActions$ = action$.pipe(
    filter(
      isActionOf([selectConnectedCurrency, unlockWalletNew, setActiveAccount, transactionSuccess]),
    ),
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

export const accountNameUpdate: RootEpic = pipe(
  filter(isActionOf(updateAccountName)),
  mapTo(
    showNotification({
      type: NotificationType.success,
      message: 'Account name successfully updated',
    }),
  ),
)
