import { addNewItem, retrieveItems, saveItems, deleteItem } from './persistance';
import { Wallet } from '@types'
const WALLETS_KEY = 'wallets'

export function addNewWallet(newWallet: Wallet): Promise<Wallet[]> {
  return addNewItem(WALLETS_KEY, newWallet)
}

export function retrieveWallets(): Promise<Wallet[]> {
  const errorMessage = 'Something appeared to be wrong while attempting to retrieve your wallet'
  return retrieveItems<Wallet>(WALLETS_KEY, errorMessage)
}

export function saveWallets(wallets: Wallet[]) {
  const error = 'Something appeared to be wrong while attempting to save the new address to your wallet'
  return saveItems(WALLETS_KEY, wallets, error)
}

export function deleteWallet(accountId: string) {
  return deleteItem<Wallet>(WALLETS_KEY, (wallet) => wallet.publicKey !== accountId)
}
