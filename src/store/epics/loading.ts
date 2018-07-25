import { accountLoadRequest, changeWalletView, loadConnections, lockAllAccounts } from '@actions'
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
    map(({ wallets: { activeWallet } }) => {
      return activeWallet
        ? accountLoadRequest(activeWallet.publicKey)
        : changeWalletView(WalletView.create)
    }),
  )

  const lockAllAccounts$ = rehydrate$.pipe(map(() => lockAllAccounts()))

  const loadConnections$ = rehydrate$.pipe(map(loadConnections))

  return merge(loadAccount$, lockAllAccounts$, loadConnections$)
}
