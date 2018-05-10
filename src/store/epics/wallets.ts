import { accountLoadRequest, changeView, deleteWallet as deleteWalletAction, selectWallet, walletsSaved } from '@actions'
import { deleteWallet } from '@services/wallets'
import { Epic } from '@store'
import { View } from '@types'
import { merge } from 'rxjs'
import { fromPromise } from 'rxjs/observable/fromPromise'
import { filter, map, mergeMap, withLatestFrom } from 'rxjs/operators'
import { isActionOf } from 'typesafe-actions'

export const deleteWallet$: Epic = (action$) => {
  const deleteWalletAction$ = action$.pipe(
    filter(isActionOf(deleteWalletAction)),
  )

  const persistWalletDeletion$ = deleteWalletAction$.pipe(
    mergeMap(
      (action) => fromPromise(deleteWallet(action.payload.publicKey))
        .pipe(
          map((wallets) => walletsSaved(wallets)),
        ),
    ),
  )

  const switchView$ = deleteWalletAction$.pipe(
    map(() => changeView(View.create)),
  )

  return merge(switchView$, persistWalletDeletion$)
}

export const switchWallet$: Epic = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(selectWallet)),
    withLatestFrom(state$),
    map(([{payload}, state]) => accountLoadRequest(state.wallets.walletList[payload].publicKey)),
  )
