import { AsyncStorage } from 'react-native'
import { Wallet } from '../store/options/index';
const walletsKey = 'wallets'

export async function addNewWallet(publicKey: string, encryptedPrivateKey: string, accountName: string): Promise<Wallet[]> {
  const walletEntry = { publicKey, encryptedPrivateKey, accountName }

  const wallets = await retrieveWallets()
  const newWalletList = [walletEntry, ...wallets]
  return saveWallets(newWalletList)
}

export async function retrieveWallets(): Promise<Wallet[]> {
  let wallets: string = await AsyncStorage.getItem(walletsKey);
  if (wallets) {
    return JSON.parse(wallets)
  }
  return []
}

export async function saveWallets(newWalletList: any): Promise<Wallet[]> {
  let stringifiedWallets = JSON.stringify(newWalletList)
  await AsyncStorage.setItem(walletsKey, stringifiedWallets);
  return newWalletList
}

export async function deleteWallet(accountId: string): Promise<Wallet[]> {
  const wallets = await retrieveWallets()
  const newList = wallets.filter((wallet: Wallet) => wallet.publicKey !== accountId)
  return saveWallets(newList)
}
