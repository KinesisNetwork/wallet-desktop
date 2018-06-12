import {
  accountLoadRequest,
  changeView,
  deleteWallet as deleteWalletAction,
  selectWallet,
} from '@actions'
import { Epic } from '@store'
import { View } from '@types'
import { saveAs } from 'file-saver'
import { startCase } from 'lodash'
import { merge } from 'rxjs'
import { filter, ignoreElements, map, tap, withLatestFrom } from 'rxjs/operators'
import { isActionOf } from 'typesafe-actions'

export const deleteWallet$: Epic = (action$) => {
  const deleteWalletAction$ = action$.pipe(
    filter(isActionOf(deleteWalletAction)),
  )

  const switchView$ = deleteWalletAction$.pipe(
    map(() => changeView(View.create)),
  )

  const downloadPaperWallet$ = deleteWalletAction$.pipe(
    tap(({ payload }) => {
      const text = Object.entries(payload)
        .filter(([key]) => key !== 'encryptedPrivateKey')
        .sort((a, b) => a[0] < b[0] ? -1 : 1)
        .map(([key, value]) => `${startCase(key)},${value}`)
        .join('\n')
      const blob = new Blob([text], { type: 'text/csv;charset=utf-8' })
      saveAs(blob, `${payload.accountName} Credentials.csv`)
    }),
    ignoreElements(),
  )

  return merge(switchView$, downloadPaperWallet$)
}

export const switchWallet$: Epic = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(selectWallet)),
    withLatestFrom(state$),
    map(([{ payload }, state]) => accountLoadRequest(state.wallets.walletList[payload].publicKey)),
  )
