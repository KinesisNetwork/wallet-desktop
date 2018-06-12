import { accountLoadRequest } from '@actions'
import { Epic } from '@store'
import { View } from '@types'
import { ofType } from 'redux-observable'
import { REHYDRATE } from 'redux-persist'
import { merge } from 'rxjs'
import { filter, map, withLatestFrom } from 'rxjs/operators'

export const initalLoad$: Epic = (action$, state$) => {
  const rehydrate$ = action$.pipe(
    ofType(REHYDRATE),
    withLatestFrom(state$),
    map(([, state]) => state),
  )

  const loadAccount$ = rehydrate$.pipe(
    filter(({ view }) => view.currentView === View.dashboard),
    map(({ wallets }) => accountLoadRequest(wallets.walletList[wallets.currentlySelected].publicKey)),
  )

  return merge(loadAccount$)
}
