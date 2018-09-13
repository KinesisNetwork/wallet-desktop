import { RootState } from '@store'
import { Connection } from '@types'
import { ConnectionsState } from './reducers'

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

export function getActiveAccount(wallet: RootState['wallet']) {
  const accountIndex = wallet.persisted.activeAccount
  return wallet.accounts[accountIndex]
}

export function getLoginState(wallet: RootState['wallet']) {
  return !!wallet.passphrase
}
