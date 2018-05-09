import { Epic } from '@store'
import { filter, mergeMap, map } from 'rxjs/operators';
import { merge } from 'rxjs'
import { fromPromise } from 'rxjs/observable/fromPromise'
import { isActionOf } from 'typesafe-actions';
import { deleteWallet as deleteWalletAction, walletsSaved, changeView } from '@actions';
import { deleteWallet } from '@services/wallets';
import { View } from '@types';

export const deleteWallet$: Epic = (action$) => {
  const deleteWalletAction$ = action$.pipe(
    filter(isActionOf(deleteWalletAction)),
  )

  const persistWalletDeletion$ = deleteWalletAction$.pipe(
    mergeMap(
      (action) => fromPromise(deleteWallet(action.payload.publicKey))
        .pipe(
          map((wallets) => walletsSaved(wallets))
        )
    ),
  )

  const switchView$ = deleteWalletAction$.pipe(
    map(() => changeView(View.create))
  )

  return merge(switchView$, persistWalletDeletion$)
}
