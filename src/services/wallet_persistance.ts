import { Wallet } from '../app';
import { addNewItem, retrieveItems, saveItems, deleteItem } from './persistance';
const walletsKey = 'wallets'

export function addNewWallet(publicKey: string, encryptedPrivateKey: string) {
  return addNewItem<Wallet>(walletsKey, {publicKey, encryptedPrivateKey})
}

export function retrieveWallets() {
  return retrieveItems<Wallet>(walletsKey)
}

export function saveWallets(wallets: Wallet[]) {
  return saveItems<Wallet>(walletsKey, wallets)
}

export function deleteWallets(accountId: string) {
  return deleteItem<Wallet>(walletsKey, (wallet: any) => wallet.publicKey !== accountId)
}

