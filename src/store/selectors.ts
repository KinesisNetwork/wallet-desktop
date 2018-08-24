import { RootState } from '@store'
import { Connection } from '@types'

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

export function getCurrentConnection(state: RootState): Connection {
  return state.connections.currentConnection
}
