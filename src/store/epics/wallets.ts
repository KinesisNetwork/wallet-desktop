import {
  accountLoadRequest,
  changeView,
  deleteWallet as deleteWalletAction,
  selectWallet,
  walletsSaved,
} from '@actions'
import { deleteWallet } from '@services/wallets'
import { Epic } from '@store'
import { View } from '@types'
import { saveAs } from 'file-saver'
import { merge } from 'rxjs'
import { fromPromise } from 'rxjs/observable/fromPromise'
import { filter, ignoreElements, map, mergeMap, tap, withLatestFrom } from 'rxjs/operators'
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

  const downloadPaperWallet$ = deleteWalletAction$.pipe(
    tap(({ payload }) => {
      const text = `PrivateKey,${payload.decryptedPrivateKey}`
      const blob = new Blob([text], { type: 'text/csv;charset=utf-8' })
      saveAs(blob, `${payload.accountName} Credentials.csv`)
    }),
    ignoreElements(),
  )

  return merge(switchView$, persistWalletDeletion$, downloadPaperWallet$)
}

export const switchWallet$: Epic = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(selectWallet)),
    withLatestFrom(state$),
    map(([{ payload }, state]) => accountLoadRequest(state.wallets.walletList[payload].publicKey)),
  )
