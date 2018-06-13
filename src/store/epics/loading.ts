import { accountLoadRequest, changeWalletView } from '@actions'
import { Epic } from '@store'
import { WalletView } from '@types'
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
    filter(({ view }) => view.walletView === WalletView.dashboard),
    map(({ wallets: { selectedWallet } }) => {
      return selectedWallet
        ? accountLoadRequest(selectedWallet.publicKey)
        : changeWalletView(WalletView.create)
    }),
  )

  return merge(loadAccount$)
}
