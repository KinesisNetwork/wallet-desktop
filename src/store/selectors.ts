import { RootState } from '@store'
import { Connection } from '@types'
import { ConnectionsState } from './reducers'

export function getActiveKeys(
  state: RootState,
): {
  publicKey: string
  privateKey: string | null
} {
  const sourceWallet = state.wallets.activeWallet!
  const passwordState = state.passwords.livePasswords[sourceWallet.publicKey]
  const privateKey = passwordState ? passwordState.privateKey : null
  return { publicKey: sourceWallet.publicKey, privateKey }
}

export function getActivePublicKey({ wallets: { activeWallet } }: RootState): string {
  return activeWallet!.publicKey
}

export function getCurrentConnection({
  connections,
  currentStage,
  currentCurrency,
}: ConnectionsState): Connection {
  return connections[currentStage]![currentCurrency]
}

export function getCurrentConnectionForEditing({
  connections,
  updating,
  currentStage,
}: ConnectionsState) {
  return connections[currentStage]![updating.selectedCurrency]
}

export function getActiveAccount({ wallet }: RootState) {
  const accountIndex = wallet.persisted.activeAccount
  return wallet.accounts[accountIndex]
}

export function getLoginState({ wallet }: RootState) {
  return !!wallet.passphrase
}
