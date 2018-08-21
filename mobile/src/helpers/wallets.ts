import * as _ from 'lodash'
import { decryptPrivateKey } from '../services/encryption'
import { AppState, Wallet } from '../store/options/index'

export function getActiveWallet(appState: AppState): Wallet {
  let walletList = appState.walletList
  let walletId = appState.activeWalletIndex
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

