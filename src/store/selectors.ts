import { RootState } from '@store'
import { Connection, Wallet } from '@types'

export function getActiveKeys(
  state: RootState,
): {
  publicKey: string
  privateKey: string
} {
  const sourceWallet = state.wallets.activeWallet as Wallet
  const privateKey = state.passwords.livePasswords[sourceWallet.publicKey].privateKey
  return { publicKey: sourceWallet.publicKey, privateKey }
}

export function getActivePublicKey(state: RootState): string {
  const sourceWallet = state.wallets.activeWallet as Wallet
  return sourceWallet.publicKey
}

export function getCurrentConnection(state: RootState): Connection {
  return state.connections.currentConnection
}
