import { AppState, Wallet } from '../app'
import * as _ from 'lodash'
import { decryptPrivateKey } from '../services/encryption';

export function getActiveWallet(appState: AppState): Wallet {
  let walletList = appState.walletList
  let walletId = _.get(appState, 'viewParams.walletIndex', 0)
  return walletList[walletId]
}

export function getPrivateKey(appState: AppState, wallet: Wallet): string {
  let password = _.get(appState, `passwordMap[${wallet.publicKey}].password`, '')
  let privateKey = wallet.encryptedPrivateKey
  if (!password) {
    return ''
  }
  return decryptPrivateKey(privateKey, password)
}

export function getActivePrivateKey(appState: AppState): string {
  let activeWallet = getActiveWallet(appState) || {}
  return getPrivateKey(appState, activeWallet)
}
