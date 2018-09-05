import { accountLoadRequest } from '@actions'
import { RootEpic } from '@store'
import { RootRoutes } from '@types'
import { ofType } from 'redux-observable'
import { REHYDRATE } from 'redux-persist'
import { merge } from 'rxjs'
import { filter, map, withLatestFrom } from 'rxjs/operators'

export const initalLoad$: RootEpic = (action$, state$) => {
  const rehydrate$ = action$.pipe(
    ofType(REHYDRATE),
    withLatestFrom(state$),
    map(([, state]) => state),
  )

  const loadAccount$ = rehydrate$.pipe(
    filter(({ router }) => router.location.pathname.startsWith(RootRoutes.dashboard)),
    map(({ wallets: { activeWallet } }) => accountLoadRequest(activeWallet!.publicKey)),
  )

  return merge(loadAccount$)
}
