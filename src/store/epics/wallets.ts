import {
  accountLoadRequest,
  addWallet,
  clearSignForms,
  deleteWallet as deleteWalletAction,
  selectWallet,
} from '@actions'
import { Epic } from '@store'
import { saveAs } from 'file-saver'
import { startCase } from 'lodash'
import { merge } from 'rxjs'
import { filter, ignoreElements, map, tap } from 'rxjs/operators'
import { isActionOf } from 'typesafe-actions'

export const deleteWallet$: Epic = (action$) => {
  const deleteWalletAction$ = action$.pipe(
    filter(isActionOf(deleteWalletAction)),
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

  return merge(downloadPaperWallet$)
}

export const changeWallet: Epic = (action$) => {
  const switchWallet$ = action$.pipe(
    filter(isActionOf([selectWallet, addWallet])),
  )

  const loadAccount$ = switchWallet$.pipe(
    map(({ payload }) => accountLoadRequest(payload.publicKey)),
  )

  const clearSignFields$ = switchWallet$.pipe(
    map(clearSignForms),
  )

  return merge(loadAccount$, clearSignFields$)
}
