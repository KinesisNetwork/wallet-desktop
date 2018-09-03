import { accountLoadRequest, changeWalletView } from '@actions'
import { RootEpic } from '@store'
import { WalletView } from '@types'
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
    filter(({ view }) => view.walletView === WalletView.dashboard),
    map(({ wallets: { activeWallet } }) => {
      return activeWallet
        ? accountLoadRequest(activeWallet.publicKey)
        : changeWalletView(WalletView.create)
    }),
  )

  return merge(loadAccount$)
}
